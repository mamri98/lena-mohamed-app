// app-animations.js
// Streamlined animation utilities with minimal overhead

/**
 * Simplified animation classes with optimal performance characteristics
 * - Uses pure CSS classes to minimize JS overhead
 * - Avoids dynamic style injection
 * - Focuses on transform and opacity for GPU acceleration
 */

// Animation class names to be used with tailwind/CSS
export const ANIMATIONS = {
    // Splash screen animation
    SPLASH_FADE: 'animate-splash-fade',
    CONTENT_FADE_IN: 'animate-content-fade-in',
    
    // User card flip animations
    CARD_CONTAINER: 'perspective preserve-3d',
    CARD_FLIP: 'animate-flip',
    CARD_FRONT: 'backface-hidden rotateY-0',
    CARD_BACK: 'backface-hidden rotateY-180',
    
    // Feature animations
    ITEM_PULSE: 'animate-pulse-subtle',
    FEATURE_EXPAND: 'animate-feature-expand',
    FEATURE_SHRINK: 'animate-feature-shrink'
  };
  
  // Simple animation state tracker to manage component transitions
  export const createAnimationController = () => {
    let activeTimers = [];
    
    const scheduleTask = (callback, delay) => {
      const timer = setTimeout(callback, delay);
      activeTimers.push(timer);
      return timer;
    };
    
    return {
      after: scheduleTask,
      
      // Clean up timers
      cleanup: () => {
        activeTimers.forEach(clearTimeout);
        activeTimers = [];
      }
    };
  };