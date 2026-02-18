// components/DashboardItem.js
import { useState, useCallback } from 'react';
import { ANIMATIONS, createAnimationController } from '../utils/app-animations';

// Simple color mapping to avoid recalculation
const COLOR_CLASSES = {
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  default: { bg: 'bg-gray-100', text: 'text-gray-600' }
};

export default function DashboardItem({ icon, title, description, color, onClick }) {
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Handle click with animation
  const handleClick = useCallback(() => {
    if (isPulsing) return;
    
    setIsPulsing(true);
    const controller = createAnimationController();
    
    // Reset animation after completion
    controller.after(() => {
      setIsPulsing(false);
      if (onClick) onClick();
    }, 350);
    
    return controller.cleanup;
  }, [isPulsing, onClick]);
  
  // Get color classes with fallback
  const colorClasses = COLOR_CLASSES[color] || COLOR_CLASSES.default;
  
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow ${isPulsing ? ANIMATIONS.ITEM_PULSE : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${title}`}
    >
      <div className={`w-16 h-16 rounded-full ${colorClasses.bg} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <h2
        className={`font-semibold ${colorClasses.text} text-center leading-tight w-full`}
        style={{ fontSize: 'clamp(0.75rem, 3vw, 1.125rem)' }}
      >
        {title}
      </h2>
      <p className="text-xs text-gray-500 text-center mt-1">{description}</p>
    </div>
  );
}