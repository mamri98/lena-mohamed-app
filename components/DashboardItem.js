// components/DashboardItem.js
// CHANGED: Updated card bg to semi-transparent purple (bg-white/10), icon bg colors darkened,
// text updated to white/purple-200 to match the dark purple app theme

import { useState, useCallback } from 'react';
import { ANIMATIONS, createAnimationController } from '../utils/app-animations';

const COLOR_CLASSES = {
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-300' },
  blue:   { bg: 'bg-blue-500/20',   text: 'text-blue-300' },
  green:  { bg: 'bg-green-500/20',  text: 'text-green-300' },
  amber:  { bg: 'bg-amber-500/20',  text: 'text-amber-300' },
  red:    { bg: 'bg-red-500/20',    text: 'text-red-300' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-300' },
  pink:   { bg: 'bg-pink-500/20',   text: 'text-pink-300' },
  default:{ bg: 'bg-white/10',      text: 'text-purple-200' }
};

export default function DashboardItem({ icon, title, description, color, onClick }) {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = useCallback(() => {
    if (isPulsing) return;
    setIsPulsing(true);
    const controller = createAnimationController();
    controller.after(() => {
      setIsPulsing(false);
      if (onClick) onClick();
    }, 350);
    return controller.cleanup;
  }, [isPulsing, onClick]);

  const colorClasses = COLOR_CLASSES[color] || COLOR_CLASSES.default;

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/15 transition-all ${isPulsing ? ANIMATIONS.ITEM_PULSE : ''}`}
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
      <p className="text-xs text-purple-300/70 text-center mt-1">{description}</p>
    </div>
  );
}