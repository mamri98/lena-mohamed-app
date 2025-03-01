// components/UserCard.js
// Simplified user card with flip animation for switching users
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
    <div className="relative h-16">
      <div className={`sticky top-0 z-10 h-16 ${ANIMATIONS.CARD_CONTAINER} ${isFlipping ? ANIMATIONS.CARD_FLIP : ''}`}>
        {/* Front card */}
        <div className={`${ANIMATIONS.CARD_FRONT} bg-gradient-to-r from-purple-500 to-pink-400 text-white px-4 py-4 shadow-md w-full`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{greeting}, {displayName}!</h1>
              <p className="text-xs opacity-90">{formattedDate}</p>
            </div>
            <button
              onClick={handleToggle}
              className="bg-white bg-opacity-20 text-white text-sm font-medium rounded-full px-3 py-2 hover:bg-opacity-30 transition-colors"
              disabled={isFlipping}
            >
              Switch to {otherName}
            </button>
          </div>
        </div>
        
        {/* Back card */}
        <div className={`${ANIMATIONS.CARD_BACK} bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-4 shadow-md w-full`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{greeting}, {otherName}!</h1>
              <p className="text-xs opacity-90">{formattedDate}</p>
            </div>
            <button className="bg-white bg-opacity-20 text-white text-sm font-medium rounded-full px-3 py-2 opacity-0">
              {/* Placeholder button for alignment */}
              Switch to {displayName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}