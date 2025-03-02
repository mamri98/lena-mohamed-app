// components/FeatureContainer.js
// The key fix is removing overflow constraints that might be clipping dropdowns
import { useState, useEffect } from 'react';
import { ANIMATIONS, createAnimationController } from '../utils/app-animations';

// Simple color mapping to avoid recalculation
const TEXT_COLOR_CLASSES = {
  purple: 'text-purple-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  amber: 'text-amber-600',
  indigo: 'text-indigo-600'
};

export default function FeatureContainer({ title, color, isActive, onClose, children }) {
  const [animationState, setAnimationState] = useState(null); // null, 'expanding', 'shrinking'
  const [isDocumentView, setIsDocumentView] = useState(false);
  
  // Check if this is the document view to apply special styling
  useEffect(() => {
    setIsDocumentView(title === 'Our Journal');
  }, [title]);
  
  // Handle animation state based on active state
  useEffect(() => {
    // Skip if no change in active state
    if ((isActive && animationState === 'expanding') || 
        (!isActive && !animationState)) {
      return;
    }
    
    const controller = createAnimationController();
    
    if (isActive) {
      setAnimationState('expanding');
    } else if (animationState === 'expanding') {
      setAnimationState('shrinking');
      
      // Reset state after animation completes
      controller.after(() => {
        setAnimationState(null);
      }, 400);
    }
    
    return controller.cleanup;
  }, [isActive, animationState]);
  
  // Don't render if not active and not animating
  if (!isActive && !animationState) return null;
  
  // Get animation class based on state
  const animationClass = animationState === 'expanding' 
    ? ANIMATIONS.FEATURE_EXPAND 
    : animationState === 'shrinking' 
      ? ANIMATIONS.FEATURE_SHRINK 
      : '';
  
  // Get text color class with fallback
  const textColorClass = TEXT_COLOR_CLASSES[color] || 'text-gray-600';
  
  // Special document container style
  const containerStyle = isDocumentView 
    ? {
        height: 'calc(100vh - 120px)',
        maxHeight: 'unset',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '8px',
        overflow: 'visible' // Ensure overflow is visible for dropdowns
      } 
    : { 
        overflow: 'visible'  // Explicitly set overflow to visible
      };
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-4 mb-4 ${animationClass}`}
      style={containerStyle}
    >
      <div className={`flex justify-between items-center ${isDocumentView ? 'mb-1' : 'mb-4'}`}>
        <h2 className={`text-xl font-semibold ${textColorClass}`}>{title}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="overflow-visible">
        {children}
      </div>
    </div>
  );
}