// components/FeatureContainer.js
// CHANGED: In landscape drawing mode, the container becomes fully transparent
// with zero padding and no border/rounded corners — just a floating close button
// overlaid on top. This lets DrawingCanvas stretch edge-to-edge horizontally.

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
  const [isLandscape, setIsLandscape] = useState(false);

  const isDocumentView = title === 'Our Journal' || title === 'Our Dua Journal';
  const isDrawingView  = title === 'Draw Together';
  const isFullHeight   = isDocumentView || isDrawingView;

  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    const delayedCheck = () => setTimeout(check, 100);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', delayedCheck);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', delayedCheck);
    };
  }, []);

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

  // Landscape drawing: no card chrome at all — canvas goes full bleed,
  // close button floats as an overlay in the top-right corner of the canvas
  if (isDrawingView && isLandscape) {
    return (
      <div className={`relative flex flex-col h-full w-full overflow-hidden ${animationClass}`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-16 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-md p-4 mb-4 ${animationClass} ${
        isFullHeight ? 'flex flex-col h-full overflow-hidden' : ''
      }`}
    >
      <div className={`flex justify-between items-center flex-shrink-0 ${isFullHeight ? 'mb-1' : 'mb-4'}`}>
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
      <div className={`${isFullHeight ? 'flex-1 min-h-0 flex flex-col overflow-hidden' : 'overflow-visible'}`}>
        {children}
      </div>
    </div>
  );
}