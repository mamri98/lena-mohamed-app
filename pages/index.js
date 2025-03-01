// pages/index.js
// Updated with a feature dashboard layout
import Head from 'next/head';
import { useEffect, useState } from 'react';
import InstallPrompt from '../components/InstallPrompt';
import MoodTracker from '../components/MoodTracker';
import DailySelfie from '../components/DailySelfie';
import DailyQuranVerse from '../components/DailyQuranVerse';
import LinkShare from '../components/LinkShare';

export default function Home() {
  const [name, setName] = useState('Lena');
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeFeature, setActiveFeature] = useState(null);
  
  useEffect(() => {
    // Determine appropriate greeting based on time of day
    const hour = new Date().getHours();
    let timeGreeting = 'Hello';
    
    if (hour >= 5 && hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }
    
    setGreeting(timeGreeting);
    
    // Format current date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, options));
  }, []);

  const toggleName = () => {
    setName(name === 'Lena' ? 'Mohamed' : 'Lena');
    setActiveFeature(null); // Reset active feature when switching users
  };

  // Function to render the active feature content
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'mood':
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-600">Mood Tracker</h2>
              <button 
                onClick={() => setActiveFeature(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MoodTracker name={name} />
          </div>
        );
      case 'selfie':
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-600">Daily Selfie</h2>
              <button 
                onClick={() => setActiveFeature(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DailySelfie name={name} />
          </div>
        );
      case 'quran':
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-600">Daily Quran Verse</h2>
              <button 
                onClick={() => setActiveFeature(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DailyQuranVerse />
          </div>
        );
      case 'links':
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-amber-600">Link Sharing</h2>
              <button 
                onClick={() => setActiveFeature(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <LinkShare name={name} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Head>
        <title>Lena & Mohamed</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        {/* Add Arabic font for Quran verses */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" 
          rel="stylesheet"
        />
        <style jsx global>{`
          .font-arabic {
            font-family: 'Amiri', serif;
          }
        `}</style>
      </Head>

      {/* Header with greeting and date */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-pink-400 text-white px-4 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{greeting}, {name}!</h1>
            <p className="text-xs opacity-90">{currentDate}</p>
          </div>
          <button 
            onClick={toggleName} 
            className="bg-white bg-opacity-20 text-white text-sm font-medium rounded-full px-3 py-2 hover:bg-opacity-30 transition duration-300"
          >
            Switch to {name === 'Lena' ? 'Mohamed' : 'Lena'}
          </button>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Active Feature Content */}
        {activeFeature && renderFeatureContent()}
        
        {/* Dashboard Grid */}
        {!activeFeature && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Mood Tracker Card */}
            <div 
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveFeature('mood')}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-purple-600">Mood</h2>
              <p className="text-xs text-gray-500 text-center mt-1">Track how you feel</p>
            </div>

            {/* Daily Selfie Card */}
            <div 
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveFeature('selfie')}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-blue-600">Selfie</h2>
              <p className="text-xs text-gray-500 text-center mt-1">Take your daily photo</p>
            </div>

            {/* Quran Verse Card */}
            <div 
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveFeature('quran')}
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  <line x1="8" y1="7" x2="16" y2="7"></line>
                  <line x1="8" y1="11" x2="16" y2="11"></line>
                  <line x1="8" y1="15" x2="12" y2="15"></line>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-green-600">Quran</h2>
              <p className="text-xs text-gray-500 text-center mt-1">Daily verse</p>
            </div>

            {/* Link Sharing Card */}
            <div 
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveFeature('links')}
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-amber-600">Links</h2>
              <p className="text-xs text-gray-500 text-center mt-1">Share useful links</p>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-md mx-auto px-4 pb-6 text-center text-gray-600 text-sm">
        Made with love for my bunny 💜
      </footer>
      
      {/* iOS installation prompt */}
      <InstallPrompt />
    </div>
  );
}