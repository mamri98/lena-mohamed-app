// components/UserCard.js
// Fixed user card component with improved iPhone compatibility
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
  
  // Get formatted date (calculated once on render)
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
      
      // Call parent handler
      if (onToggle) onToggle(newName);
      
      // Reset animation state
      controller.after(() => {
        setIsFlipping(false);
      }, 50);
    }, 300);
    
    return controller.cleanup;
  }, [isFlipping, displayName, onToggle]);
  
  // Compute other user name
  const otherName = displayName === 'Lena' ? 'Mohamed' : 'Lena';
  
  return (
    <div className="relative">
      {/* Fixed height container to prevent content overflow */}
      <div className={`sticky top-0 z-10 ${ANIMATIONS.CARD_CONTAINER} ${isFlipping ? ANIMATIONS.CARD_FLIP : ''}`}>
        {/* Front card with explicit padding and height */}
        <div className={`${ANIMATIONS.CARD_FRONT} bg-gradient-to-r from-purple-500 to-pink-400 text-white px-4 py-3 shadow-md w-full`}>
          <div className="flex justify-between items-center">
            {/* Left content - greeting and date */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">{greeting}, {displayName}!</h1>
              <p className="text-xs opacity-90 truncate">{formattedDate}</p>
            </div>
            
            {/* Right content - switch button with fixed width */}
            <button
              onClick={handleToggle}
              className="ml-2 bg-white bg-opacity-20 text-white text-sm font-medium rounded-full px-3 py-2 hover:bg-opacity-30 transition-colors whitespace-nowrap flex-shrink-0"
              disabled={isFlipping}
            >
              Switch to {otherName}
            </button>
          </div>
        </div>
        
        {/* Back card with matching style */}
        <div className={`${ANIMATIONS.CARD_BACK} bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-3 shadow-md w-full`}>
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">{greeting}, {otherName}!</h1>
              <p className="text-xs opacity-90 truncate">{formattedDate}</p>
            </div>
            <button className="ml-2 bg-white bg-opacity-20 text-white text-sm font-medium rounded-full px-3 py-2 opacity-0 flex-shrink-0">
              {/* Placeholder button for alignment */}
              Switch to {displayName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}