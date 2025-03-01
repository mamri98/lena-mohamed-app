// components/UserCard.js
// Simplified user card with minimal animation for iPhone compatibility
import { useState, useCallback } from 'react';
import { ANIMATIONS, createAnimationController } from '../utils/app-animations';

export default function UserCard({ name, onToggle }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayName, setDisplayName] = useState(name);
  
  // Get greeting based on time of day
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();
  
  // Calculate current date
  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  // Handle user toggle with animation
  const handleToggle = useCallback(() => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    const controller = createAnimationController();
    
    // Wait for half of the animation to update displayed name
    controller.after(() => {
      const newName = displayName === 'Lena' ? 'Mohamed' : 'Lena';
      setDisplayName(newName);
      
      if (onToggle) onToggle(newName);
      
      // Reset animation state
      controller.after(() => {
        setIsFlipping(false);
      }, 50);
    }, 300);
    
    return controller.cleanup;
  }, [isFlipping, displayName, onToggle]);
  
  // Simple version without complex animations - guaranteed to work on iPhone
  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-4 py-2 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-base font-bold">{greeting}, {displayName}!</h1>
            <p className="text-xs opacity-90">{formattedDate}</p>
          </div>
          
          <button 
            onClick={handleToggle}
            disabled={isFlipping}
            className="bg-white bg-opacity-20 text-white text-xs font-medium rounded-full px-2 py-1 hover:bg-opacity-30 transition-colors"
          >
            Switch to {displayName === 'Lena' ? 'Mohamed' : 'Lena'}
          </button>
        </div>
      </div>
    </div>
  );
}