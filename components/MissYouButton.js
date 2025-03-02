// components/MissYouButton.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function MissYouButton({ name }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Only run on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleMissYouClick = async () => {
    if (isAnimating || !isMounted || !db) return;
    
    setIsAnimating(true);
    
    try {
      // Add to Firestore
      await addDoc(collection(db, 'missYou'), {
        name,
        timestamp: serverTimestamp(),
      });
      
      // Animation duration
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending miss you:', error);
      setIsAnimating(false);
    }
  };
  
  if (!isMounted) return null;
  
  return (
    <div className="text-center my-4">
      <button
        onClick={handleMissYouClick}
        className={`relative bg-white rounded-full p-4 shadow-md hover:shadow-lg transition-all duration-300 ${
          isAnimating ? 'scale-110' : 'hover:scale-105'
        }`}
        disabled={isAnimating}
        aria-label="Send I miss you"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-8 w-8 text-red-500 ${isAnimating ? 'animate-pulse' : ''}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      <p className="text-sm text-gray-600 mt-2">Send "I miss you"</p>
    </div>
  );
}