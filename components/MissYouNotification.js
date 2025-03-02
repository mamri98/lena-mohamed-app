// components/MissYouNotification.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function MissYouNotification({ name }) {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Only run on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Listen for miss you messages
  useEffect(() => {
    if (!isMounted || !db || !name) return;
    
    // The other person's name
    const otherPerson = name === 'Lena' ? 'Mohamed' : 'Lena';
    
    let unsubscribe = () => {};
    
    try {
      // Set up Firestore listener
      const missYouRef = collection(db, 'missYou');
      const q = query(
        missYouRef,
        where('name', '==', otherPerson),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          
          // Check if this is a recent notification (within 5 minutes)
          const timestamp = data.timestamp?.toDate() || new Date();
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          
          if (timestamp > fiveMinutesAgo) {
            // Show new notification
            setNotification({
              name: data.name,
              timestamp
            });
            setIsVisible(true);
            
            // Auto-dismiss after 10 seconds
            setTimeout(() => {
              setIsVisible(false);
            }, 10000);
          }
        }
      }, (error) => {
        console.error("Error listening for miss you messages:", error);
      });
    } catch (error) {
      console.error("Error setting up miss you listener:", error);
    }
    
    return () => unsubscribe();
  }, [isMounted, db, name]);
  
  // Hide notification completely after fade-out
  const handleAnimationEnd = () => {
    if (!isVisible) {
      setNotification(null);
    }
  };
  
  if (!isMounted || !notification) return null;
  
  // Format time since message was sent
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };
  
  return (
    <div 
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ maxWidth: '90%' }}
      onTransitionEnd={handleAnimationEnd}
    >
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-red-500 mr-2 flex-shrink-0 animate-pulse" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
            clipRule="evenodd" 
          />
        </svg>
        <div>
          <p className="font-medium text-gray-800">{notification.name} misses you ❤️</p>
          <p className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</p>
        </div>
      </div>
    </div>
  );
}