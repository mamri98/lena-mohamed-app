// components/SharedDocument.js
import { useState, useEffect } from 'react';

export default function SharedDocument() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Only render on client side to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
    
    // Simulate iframe loading time and set loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Your Google Doc URL - replace with your actual shared doc URL
  // Format: https://docs.google.com/document/d/YOUR_DOC_ID/edit?usp=sharing
  const docUrl = "https://docs.google.com/document/d/1Ze1jOiplVx2wVvqYTlt5sHgEY7R3rrK0Hv20tYX8FIs/edit?pli=1&tab=t.0";
  
  // Convert to embedded URL format
  const embedUrl = docUrl.replace("/edit?usp=sharing", "/preview");
  
  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 text-center">
        <p>Loading shared document...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md p-2 h-full flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      {isLoading ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      ) : (
        <div className="w-full flex-grow overflow-hidden rounded-lg bg-gray-50" style={{ height: 'calc(100vh - 160px)' }}>
          <iframe 
            src={embedUrl} 
            className="w-full h-full border-none"
            style={{ minHeight: '500px' }}
            title="Shared Google Document"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      
      <div className="mt-2 text-center text-xs text-gray-500">
        <p>Updates automatically when edited on Google Docs</p>
      </div>
    </div>
  );
}