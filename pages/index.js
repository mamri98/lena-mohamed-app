// pages/index.js
// CHANGED: Wrapped app in a viewport-locked flex column (h-[100dvh]) so height
// flows correctly to FeatureContainer and DrawingCanvas in landscape mobile.
// The <main> element now uses flex-1 + min-h-0 + overflow-y-auto so it fills
// remaining space after the UserCard header without overflowing the screen.

import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import InstallPrompt from '../components/InstallPrompt';
import UserCard from '../components/UserCard';
import DashboardItem from '../components/DashboardItem';
import FeatureContainer from '../components/FeatureContainer';
import SplashScreen from '../components/SplashScreen';
import { ANIMATIONS } from '../utils/app-animations';

const MoodTracker = dynamic(() => import('../components/MoodTracker'), { 
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading mood tracker...</div>
});

const DailySelfie = dynamic(() => import('../components/DailySelfie'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading selfie feature...</div>
});

const DailyQuranVerse = dynamic(() => import('../components/DailyQuranVerse'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading Quran verse...</div>
});

const LinkShare = dynamic(() => import('../components/LinkShare'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading link sharing...</div>
});

const MarriageTips = dynamic(() => import('../components/MarriageTips'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading marriage tips...</div>
});

const SharedDocument = dynamic(() => import('../components/SharedDocument'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading shared document...</div>
});

const MissYouButton = dynamic(() => import('../components/MissYouButton'), {
  ssr: false,
  loading: () => null
});

const MissYouNotification = dynamic(() => import('../components/MissYouNotification'), {
  ssr: false,
  loading: () => null
});

const DrawingCanvas = dynamic(() => import('../components/DrawingCanvas'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading canvas...</div>
});

const FEATURES = {
  mood: {
    title: 'Mood Tracker',
    color: 'purple',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    ),
    description: "How are you feeling?"
  },
  selfie: {
    title: 'Daily Selfie',
    color: 'blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
      </svg>
    ),
    description: "Selfie time!"
  },
  quran: {
    title: 'Daily Quran Verse',
    color: 'green',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        <line x1="8" y1="7" x2="16" y2="7"></line>
        <line x1="8" y1="11" x2="16" y2="11"></line>
        <line x1="8" y1="15" x2="12" y2="15"></line>
      </svg>
    ),
    description: "ربنا اغفر لنا"
  },
  links: {
    title: 'Link Sharing',
    color: 'amber',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    ),
    description: "Link and connect"
  },
  marriage: {
    title: 'Marriage Tips',
    color: 'red',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    description: "Tips for our future"
  },
  document: {
    title: 'Our Dua Journal',
    color: 'indigo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    description: "Our shared notes<3"
  },
  drawing: {
    title: 'Draw Together',
    color: 'pink',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    ),
    description: "Let's draw together :)"
  }
};

export default function Home() {
  const [name, setName] = useState('Lena');
  const [activeFeature, setActiveFeature] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    setAppReady(true);
  }, []);
  
  const handleToggleName = useCallback((newName) => {
    setName(newName);
    setActiveFeature(null);
  }, []);
  
  const selectFeature = useCallback((feature) => {
    setActiveFeature(feature);
  }, []);
  
  const closeFeature = useCallback(() => {
    setActiveFeature(null);
  }, []);
  
  const isFullscreenFeature = activeFeature === 'document' || activeFeature === 'drawing';

  function renderFeatureContent() {
    switch (activeFeature) {
      case 'mood':     return <MoodTracker name={name} />;
      case 'selfie':   return <DailySelfie name={name} />;
      case 'quran':    return <DailyQuranVerse />;
      case 'links':    return <LinkShare name={name} />;
      case 'marriage': return <MarriageTips />;
      case 'document': return <SharedDocument />;
      case 'drawing':  return <DrawingCanvas name={name} />;
      default:         return null;
    }
  }
  
  return (
    // KEY CHANGE: h-[100dvh] + flex-col locks the entire app to the true visible
    // viewport height in both portrait AND landscape, on all devices.
    // overflow-hidden prevents the page from scrolling when drawing is open.
    <div
      className="bg-gradient-to-b from-[#1a0533] to-[#2d0a5e] flex flex-col overflow-hidden"
      style={{ height: '100dvh' }}
    >
      <Head>
        <title>Lena & Mohamed</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
        <style jsx global>{`
          .font-arabic { font-family: 'Amiri', serif; }
          @supports (-webkit-touch-callout: none) {
            .min-h-screen { min-height: -webkit-fill-available; }
          }
        `}</style>
      </Head>

      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className={`flex flex-col flex-1 min-h-0 ${appReady ? ANIMATIONS.CONTENT_FADE_IN : 'hidden'}`}>
        <MissYouNotification name={name} />

        {/* UserCard is fixed height at top */}
        <UserCard name={name} onToggle={handleToggleName} />

        {/* main fills all remaining height; scrollable for normal features, locked for drawing */}
        <main
          className={`flex-1 min-h-0 max-w-md w-full mx-auto px-4 ${
            isFullscreenFeature
              ? 'overflow-hidden flex flex-col pt-2'
              : 'overflow-y-auto py-6'
          }`}
        >
          {activeFeature && (
            <FeatureContainer
              title={FEATURES[activeFeature]?.title || ''}
              color={FEATURES[activeFeature]?.color || 'gray'}
              isActive={!!activeFeature}
              onClose={closeFeature}
            >
              {renderFeatureContent()}
            </FeatureContainer>
          )}
          
          {!activeFeature && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(FEATURES).map(([key, feature]) => (
                  <DashboardItem
                    key={key}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    onClick={() => selectFeature(key)}
                  />
                ))}
              </div>

              <div className="pb-16 text-center">
                <MissYouButton name={name} />
                <p className="text-purple-200 text-sm mt-2">Made with love for my bunny 💜</p>
              </div>
            </>
          )}
        </main>
      </div>

      <InstallPrompt />
    </div>
  );
}