// components/DailyQuranVerse.js
import { useState, useEffect } from 'react';
import { quranVerses } from '../data/quranVerses';

export default function DailyQuranVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeSelected, setThemeSelected] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // List of available themes
  const availableThemes = [
    'mercy',
    'forgiveness',
    'faith',
    'heaven',
    'hellfire',
    'love',
    'steadfastness',
    'morality',
    'signs of Allah'
  ];
  
  useEffect(() => {
    // Get today's date in a simple string format
    const today = new Date().toLocaleDateString();
    
    // Check if we already have a verse for today
    const storedVerseData = localStorage.getItem('dailyQuranVerse');
    const storedVerse = storedVerseData ? JSON.parse(storedVerseData) : null;
    
    // If we have a stored verse from today, use it
    if (storedVerse && storedVerse.date === today) {
      setVerse(storedVerse.data);
      setCurrentTheme(storedVerse.theme);
      setThemeSelected(true);
      setLoading(false);
    } else {
      // Show theme selector if we don't have a verse for today
      setShowThemeSelector(true);
      setLoading(false);
    }
  }, []);
  
  // Function to select theme and get verse for the day
  const selectTheme = (theme) => {
    setLoading(true);
    setCurrentTheme(theme);
    
    // Get a random verse from our embedded data
    const themeVerses = quranVerses[theme] || quranVerses.mercy;
    const randomIndex = Math.floor(Math.random() * themeVerses.length);
    const selectedVerse = themeVerses[randomIndex];
    
    // Parse the reference to get surah and ayah numbers
    const [surahNumber, ayahNumber] = selectedVerse.reference.split(':');
    
    // Format verse data
    const verseData = {
      arabic: selectedVerse.arabic,
      translation: selectedVerse.translation,
      surahName: surahNumber,
      verseNumber: ayahNumber,
      reference: selectedVerse.reference
    };
    
    // Get today's date
    const today = new Date().toLocaleDateString();
    
    // Store in state
    setVerse(verseData);
    setThemeSelected(true);
    setShowThemeSelector(false);
    
    // Cache in localStorage
    localStorage.setItem('dailyQuranVerse', JSON.stringify({
      date: today,
      theme,
      data: verseData
    }));
    
    setLoading(false);
  };
  
  // Check for date change every hour
  useEffect(() => {
    const checkDateChange = () => {
      const storedVerseData = localStorage.getItem('dailyQuranVerse');
      const storedVerse = storedVerseData ? JSON.parse(storedVerseData) : null;
      const today = new Date().toLocaleDateString();
      
      if (!storedVerse || storedVerse.date !== today) {
        // New day, let the user select a theme again
        setVerse(null);
        setThemeSelected(false);
        setShowThemeSelector(true);
      }
    };
    
    const interval = setInterval(checkDateChange, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
        <h2 className="text-xl font-semibold text-purple-600 mb-2">Daily Quran Verse</h2>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  
  if (showThemeSelector) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-purple-600 mb-4 text-center">Choose Today's Verse Theme</h2>
        <p className="text-gray-600 text-sm mb-4 text-center">
          Select a theme below to receive your daily Quran verse. Your selection will be locked for today.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2">
          {availableThemes.map((theme) => (
            <button
              key={theme}
              onClick={() => selectTheme(theme)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition duration-300"
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 text-center">Daily Quran Verse</h2>
      
      {verse && (
        <>
          <div className="mb-4 text-center">
            <p className="text-2xl font-arabic leading-loose" dir="rtl">{verse.arabic}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700 italic">{verse.translation}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Surah {verse.surahName}, Verse {verse.verseNumber}</p>
          </div>
          
          <div className="mt-3 text-xs text-center text-gray-500 pt-2 border-t border-gray-100">
            <span>Today's Theme: {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</span>
          </div>
        </>
      )}
    </div>
  );
}