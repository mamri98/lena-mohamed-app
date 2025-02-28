// Updated index.js file with MoodTracker component added (without mood history)
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
      <Head>
        <title>Lena & Mohamed</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-5 text-center">
        <div className="rounded-xl bg-white p-8 shadow-xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-purple-600 mb-6">
            {greeting} {name}!
          </h1>
          
          {/* Mood Tracker */}
          <MoodTracker name={name} />
          
          <button 
            onClick={toggleName} 
            className="rounded-full bg-purple-500 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition duration-300"
          >
            Switch to {name === 'Lena' ? 'Mohamed' : 'Lena'}
          </button>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <p className="text-gray-600">Made with love for my bunny</p>
      </footer>
      
      {/* iOS installation prompt */}
      <InstallPrompt />
    </div>
  );
}