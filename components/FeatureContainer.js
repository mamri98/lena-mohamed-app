// components/FeatureContainer.js
// CHANGED: Card bg changed to bg-white/10 backdrop-blur, title/close button colors updated for dark theme

import { useState, useEffect } from 'react';
import { ANIMATIONS, createAnimationController } from '../utils/app-animations';

const TEXT_COLOR_CLASSES = {
  purple: 'text-purple-300',
  blue:   'text-blue-300',
  green:  'text-green-300',
  amber:  'text-amber-300',
  indigo: 'text-indigo-300',
  red:    'text-red-300',
  pink:   'text-pink-300',
};

export default function FeatureContainer({ title, color, isActive, onClose, children }) {
  const [animationState, setAnimationState] = useState(null);
  const [isDocumentView, setIsDocumentView] = useState(false);
  const [isDrawingView, setIsDrawingView] = useState(false);

  useEffect(() => {
    setIsDocumentView(title === 'Our Journal' || title === 'Our Dua Journal');
    setIsDrawingView(title === 'Draw Together');
  }, [title]);

  useEffect(() => {
    if ((isActive && animationState === 'expanding') ||
        (!isActive && !animationState)) return;

    const controller = createAnimationController();

    if (isActive) {
      setAnimationState('expanding');
    } else if (animationState === 'expanding') {
      setAnimationState('shrinking');
      controller.after(() => setAnimationState(null), 400);
    }

    return controller.cleanup;
  }, [isActive, animationState]);

  if (!isActive && !animationState) return null;

  const animationClass = animationState === 'expanding'
    ? ANIMATIONS.FEATURE_EXPAND
    : animationState === 'shrinking'
      ? ANIMATIONS.FEATURE_SHRINK
      : '';

  const textColorClass = TEXT_COLOR_CLASSES[color] || 'text-purple-200';
  const isFullHeight = isDocumentView || isDrawingView;

  const containerStyle = isFullHeight
    ? { height: 'calc(100vh - 120px)', maxHeight: 'unset', display: 'flex', flexDirection: 'column', paddingBottom: '8px', overflow: 'visible' }
    : { overflow: 'visible' };

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-md p-4 mb-4 ${animationClass}`}
      style={containerStyle}
    >
      <div className={`flex justify-between items-center ${isFullHeight ? 'mb-1' : 'mb-4'}`}>
        <h2 className={`text-xl font-semibold ${textColorClass}`}>{title}</h2>
        <button
          onClick={onClose}
          className="text-purple-300 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="overflow-visible flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}