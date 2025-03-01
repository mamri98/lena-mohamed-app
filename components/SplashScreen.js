// components/SplashScreen.js
// Simplified splash screen with efficient animations
import { useEffect, useState } from 'react';
import { ANIMATIONS, createAnimationController } from '../utils/app-animations';

export default function SplashScreen({ onComplete }) {
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    const controller = createAnimationController();
    
    // Start animation after a short delay
    controller.after(() => {
      setAnimating(true);
      
      // Complete animation and hide splash screen
      controller.after(() => {
        if (onComplete) onComplete();
      }, 700); // Match animation duration
    }, 1000);
    
    return controller.cleanup;
  }, [onComplete]);
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100 ${animating ? ANIMATIONS.SPLASH_FADE : ''}`}>
      <div className="text-center">
        <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-4">
          <h1 className="text-3xl font-bold text-purple-600">L&M</h1>
        </div>
        <p className="text-gray-700">بسم الله الرحمن الرحيم</p>
      </div>
    </div>
  );
}