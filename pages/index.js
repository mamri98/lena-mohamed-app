// Redesigned index.js with improved layout
import Head from 'next/head';
import { useEffect, useState } from 'react';
import InstallPrompt from '../components/InstallPrompt';
import MoodTracker from '../components/MoodTracker';

export default function Home() {
  const [name, setName] = useState('Lena');
  const [greeting, setGreeting] = useState('');
  
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
  }, []);

  const toggleName = () => {
    setName(name === 'Lena' ? 'Mohamed' : 'Lena');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Head>
        <title>Lena & Mohamed</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      {/* Switch user button in top right */}
      <div className="fixed top-4 right-4 z-10">
        <button 
          onClick={toggleName} 
          className="bg-white shadow-md text-purple-600 text-sm font-medium rounded-full px-3 py-2 hover:bg-purple-100 transition duration-300"
        >
          Switch to {name === 'Lena' ? 'Mohamed' : 'Lena'}
        </button>
      </div>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Header with greeting only */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h1 className="text-2xl font-bold text-purple-600 text-center">
            {greeting} {name}!
          </h1>
        </div>
        
        {/* Mood tracker widget */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-purple-600 mb-3 text-center">Mood Tracker</h2>
          <MoodTracker name={name} />
        </div>
      </main>

      <footer className="max-w-md mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        Made with love for you bunny 💜
      </footer>
      
      {/* iOS installation prompt */}
      <InstallPrompt />
    </div>
  );
}