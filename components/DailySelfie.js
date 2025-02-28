import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function DailySelfie({ name }) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todaysSelfie, setTodaysSelfie] = useState(null);
  const [hasUploadedToday, setHasUploadedToday] = useState(false);

  // Initialize on client side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if user has already uploaded today and get the latest selfie
  useEffect(() => {
    if (!isMounted || !db || !name) return;

    const fetchTodaysSelfie = async () => {
      try {
        // Get today's date at midnight (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Query for selfies uploaded by this user today
        const selfiesRef = collection(db, 'selfies');
        const q = query(
          selfiesRef,
          where('name', '==', name),
          where('timestamp', '>=', today),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const selfieData = snapshot.docs[0].data();
          setTodaysSelfie(selfieData);
          setHasUploadedToday(true);
        } else {
          // No selfie today, check for the most recent one
          const recentQuery = query(
            selfiesRef,
            where('name', '==', name),
            orderBy('timestamp', 'desc'),
            limit(1)
          );
          
          const recentSnapshot = await getDocs(recentQuery);
          
          if (!recentSnapshot.empty) {
            setTodaysSelfie(recentSnapshot.docs[0].data());
            setHasUploadedToday(false);
          }
        }
      } catch (error) {
        console.error('Error fetching selfie:', error);
      }
    };

    fetchTodaysSelfie();
  }, [isMounted, db, name]);

  // Compress image and convert to Base64
  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions (max 800px width/height while maintaining aspect ratio)
          let width = img.width;
          let height = img.height;
          const maxSize = 800;
          
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw resized image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image as base64 string (using 0.8 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          resolve(compressedBase64);
        };
        
        img.onerror = (error) => {
          reject(error);
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setLoading(true);
    
    try {
      // Process and compress the image
      const base64Image = await processImage(file);
      
      // Save to Firestore
      const selfieDoc = {
        name,
        imageData: base64Image,
        timestamp: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'selfies'), selfieDoc);
      
      // Update local state
      selfieDoc.timestamp = new Date(); // Use local date until server date is available
      setTodaysSelfie(selfieDoc);
      setHasUploadedToday(true);
      
    } catch (error) {
      console.error('Error uploading selfie:', error);
      alert('Failed to upload selfie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format the timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp);
      
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show a placeholder during server-side rendering
  if (!isMounted) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
        <p>Loading selfie feature...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 text-center">Daily Selfie</h2>
      
      {todaysSelfie && (todaysSelfie.imageUrl || todaysSelfie.imageData) ? (
        <div className="text-center flex-grow flex flex-col justify-center">
          <div className="relative rounded-lg overflow-hidden mb-4 flex justify-center bg-gray-100">
            <img 
              src={todaysSelfie.imageUrl || todaysSelfie.imageData} 
              alt={`${name}'s selfie`} 
              className="object-contain w-full h-auto max-h-96"
            />
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {formatDate(todaysSelfie.timestamp)}
          </p>
        </div>
      ) : (
        <div className="text-center mb-4 flex-grow flex flex-col justify-center">
          <div className="bg-gray-100 rounded-lg py-16 px-4 mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-base">No selfie yet</p>
        </div>
      )}
      
      <div className="w-full border-t border-gray-200 pt-4">
        <div className="flex justify-center items-center">
          <label 
            htmlFor="selfie-upload" 
            className={`
              inline-flex items-center justify-center 
              bg-purple-600 text-white rounded-lg px-6 py-3
              text-base font-medium
              ${loading || (hasUploadedToday && todaysSelfie) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 cursor-pointer'}
              transition duration-150 ease-in-out
              w-full max-w-xs
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : hasUploadedToday ? (
              'You already uploaded today'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take a Selfie
              </>
            )}
          </label>
          <input
            id="selfie-upload"
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileUpload}
            disabled={loading || hasUploadedToday}
            className="sr-only"
          />
        </div>
        
        {!hasUploadedToday && (
          <p className="text-sm text-center text-gray-500 mt-3">
            One selfie per day
          </p>
        )}
      </div>
    </div>
  );
}