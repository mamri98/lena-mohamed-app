import '../styles/globals.css';
import { useEffect, useState } from 'react';
import SplashScreen from '../components/SplashScreen';

function MyApp({ Component, pageProps }) {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (installed on home screen)
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator.standalone) || 
                               document.referrer.includes('android-app://');
    
    setIsStandalone(isRunningStandalone);
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <>
      {isStandalone && <SplashScreen />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;