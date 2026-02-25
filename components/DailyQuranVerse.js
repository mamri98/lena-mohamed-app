// components/DailyQuranVerse.js
// CHANGED: Removed white card bg; updated all text, buttons, and borders for dark purple theme

import { useState, useEffect } from 'react';
import { quranVerses } from '../data/quranVerses';

export default function DailyQuranVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeSelected, setThemeSelected] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const availableThemes = [
    'mercy', 'forgiveness', 'faith', 'heaven', 'hellfire',
    'love', 'steadfastness', 'morality', 'signs of Allah'
  ];

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedVerse = localStorage.getItem('dailyQuranVerse');
    const parsed = storedVerse ? JSON.parse(storedVerse) : null;

    if (parsed && parsed.date === today) {
      setVerse(parsed.data);
      setCurrentTheme(parsed.theme);
      setThemeSelected(true);
      setLoading(false);
    } else {
      setShowThemeSelector(true);
      setLoading(false);
    }
  }, []);

  const selectTheme = (theme) => {
    setLoading(true);
    setCurrentTheme(theme);
    const themeVerses = quranVerses[theme] || quranVerses.mercy;
    const selected = themeVerses[Math.floor(Math.random() * themeVerses.length)];
    const [surahNumber, ayahNumber] = selected.reference.split(':');

    const verseData = {
      arabic: selected.arabic,
      translation: selected.translation,
      surahName: surahNumber,
      verseNumber: ayahNumber,
      reference: selected.reference
    };

    const today = new Date().toLocaleDateString();
    setVerse(verseData);
    setThemeSelected(true);
    setShowThemeSelector(false);
    localStorage.setItem('dailyQuranVerse', JSON.stringify({ date: today, theme, data: verseData }));
    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const parsed = JSON.parse(localStorage.getItem('dailyQuranVerse') || 'null');
      if (!parsed || parsed.date !== new Date().toLocaleDateString()) {
        setVerse(null);
        setThemeSelected(false);
        setShowThemeSelector(true);
      }
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-2 mb-4 text-center">
        <h2 className="text-xl font-semibold text-green-300 mb-2">Daily Quran Verse</h2>
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-10 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (showThemeSelector) {
    return (
      <div className="p-1 mb-4">
        <h2 className="text-xl font-semibold text-green-300 mb-3 text-center">Choose Today's Verse Theme</h2>
        <p className="text-purple-300 text-sm mb-4 text-center">
          Select a theme to receive your daily Quran verse. Locked for today.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {availableThemes.map((theme) => (
            <button
              key={theme}
              onClick={() => selectTheme(theme)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/20 transition duration-200"
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 mb-4">
      <h2 className="text-xl font-semibold text-green-300 mb-4 text-center">Daily Quran Verse</h2>

      {verse && (
        <>
          <div className="mb-4 text-center">
            <p className="text-2xl font-arabic leading-loose text-white" dir="rtl">{verse.arabic}</p>
          </div>
          <div className="mb-4">
            <p className="text-purple-200 italic">{verse.translation}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-400">Surah {verse.surahName}, Verse {verse.verseNumber}</p>
          </div>
          <div className="mt-3 text-xs text-center text-purple-400 pt-2 border-t border-white/10">
            Today's Theme: {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
          </div>
        </>
      )}
    </div>
  );
}