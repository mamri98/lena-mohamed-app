// pages/_app.js
// Simplified to focus on core functionality
import '../styles/globals.css';
import '../utils/animations.css';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if app is running in standalone mode (installed on home screen)
    if (typeof window !== 'undefined') {
      const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                                 (window.navigator.standalone) || 
                                 document.referrer.includes('android-app://');
      
      setIsStandalone(isRunningStandalone);
      
      // Register service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.log('Service Worker registration failed: ', err);
        });
      }
    }
  }, []);

  return <Component {...pageProps} isStandalone={isStandalone} />;
}

export default MyApp;