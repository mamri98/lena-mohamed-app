import { useEffect, useState } from 'react';
export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Check if on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Check if already installed to home screen
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator.standalone) || 
                        document.referrer.includes('android-app://');
    
    // Only show the prompt on iOS when not already installed
    if (isIOS && !isStandalone) {
      // Check if we've already shown the prompt
      const hasShownPrompt = localStorage.getItem('installPromptShown');
      
      if (!hasShownPrompt) {
        // Wait 3 seconds before showing prompt
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);
  
  const closePrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptShown', 'true');
  };
  
  if (!showPrompt) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="flex items-start">
        <div className="flex-1">
          <p className="font-bold mb-1">Install this app</p>
          <p className="text-sm text-gray-600 mb-2">
            Tap <span className="inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
              </svg>
            </span> then "Add to Home Screen"
          </p>
        </div>
        <button 
          onClick={closePrompt}
          className="text-purple-600 font-semibold"
        >
          Got it
        </button>
      </div>
    </div>
  );
}