// components/UserCard.js
// CHANGED: In landscape mode, reduces padding and font sizes so the header
// takes up minimal vertical space, leaving more room for the canvas.

import { useState, useCallback, useEffect } from 'react';
import { ANIMATIONS, createAnimationController } from '../utils/app-animations';

export default function UserCard({ name, onToggle }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayName, setDisplayName] = useState(name);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  const handleToggle = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    const controller = createAnimationController();
    controller.after(() => {
      const newName = displayName === 'Lena' ? 'Mohamed' : 'Lena';
      setDisplayName(newName);
      if (onToggle) onToggle(newName);
      controller.after(() => setIsFlipping(false), 50);
    }, 300);
    return controller.cleanup;
  }, [isFlipping, displayName, onToggle]);

  return (
    <div className="sticky top-0 z-10 w-full">
      <div className={`bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-md ${isLandscape ? 'px-4 py-1' : 'px-4 py-2'}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className={`font-bold ${isLandscape ? 'text-sm' : 'text-base'}`}>
              {greeting}, {displayName}!
            </h1>
            {/* Hide date in landscape to save space */}
            {!isLandscape && (
              <p className="text-xs opacity-90">{formattedDate}</p>
            )}
          </div>
          <button
            onClick={handleToggle}
            disabled={isFlipping}
            className={`bg-white bg-opacity-20 text-white font-medium rounded-full px-2 hover:bg-opacity-30 transition-colors ${isLandscape ? 'text-xs py-0.5' : 'text-xs py-1'}`}
          >
            Switch to {displayName === 'Lena' ? 'Mohamed' : 'Lena'}
          </button>
        </div>
      </div>
    </div>
  );
}