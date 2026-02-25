// components/MoodTracker.js
// CHANGED: Dropdown and input elements updated to dark purple theme;
// white backgrounds replaced with dark translucent styles, text updated to light colors

import { useState, useEffect } from 'react';

export default function MoodTracker({ name }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastMood, setLastMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [db, setDb] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const initFirebase = async () => {
      try {
        const { db } = await import('../firebase/firebase');
        setDb(db);
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
      }
    };
    initFirebase();
  }, []);

  const moods = [
    { value: 'happy',   emoji: '😊', label: 'Happy' },
    { value: 'sad',     emoji: '😢', label: 'Sad' },
    { value: 'meh',     emoji: '😐', label: 'Meh' },
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'anxious', emoji: '😟', label: 'Anxious' },
    { value: 'content', emoji: '😌', label: 'Content' },
    { value: 'annoyed', emoji: '😤', label: 'Annoyed' },
    { value: 'stressed',emoji: '😰', label: 'Stressed' },
    { value: 'upset',   emoji: '😠', label: 'Upset' },
    { value: 'relaxed', emoji: '😎', label: 'Relaxed' },
  ];

  useEffect(() => {
    if (!isMounted || !db || !name) return;
    const fetchLastMood = async () => {
      try {
        const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');
        const q = query(collection(db, 'moods'), orderBy('timestamp', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userMoods = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(mood => mood.name === name);
          if (userMoods.length > 0) setLastMood(userMoods[0]);
        }
      } catch (error) {
        console.error('Error fetching mood:', error);
      }
    };
    fetchLastMood();
  }, [isMounted, db, name]);

  const handleMoodSelect = async (mood) => {
    if (!isMounted || !db) return;
    setIsOpen(false);
    setIsSubmitting(true);
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'moods'), {
        name, mood: mood.value, emoji: mood.emoji, timestamp: serverTimestamp(),
      });
      setLastMood({ name, mood: mood.value, emoji: mood.emoji, timestamp: new Date() });
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const findMoodByValue = (value) => moods.find(m => m.value === value) || null;
  const lastMoodObj = lastMood ? findMoodByValue(lastMood.mood) : null;

  if (!isMounted) {
    return (
      <div className="text-center">
        <label className="block text-sm font-medium text-purple-200 mb-2">How are you feeling today?</label>
        <div className="bg-white/10 relative w-full border border-white/20 rounded-md shadow-sm pl-3 pr-10 py-2 text-left text-sm">
          <span className="block truncate text-purple-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <label className="block text-sm font-medium text-purple-200 mb-2">
        How are you feeling today?
      </label>

      <div className="relative">
        <button
          type="button"
          className="bg-white/10 border border-white/20 relative w-full rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 sm:text-sm text-white"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isSubmitting}
        >
          {lastMoodObj ? (
            <span className="flex items-center">
              <span className="mr-2 text-xl">{lastMoodObj.emoji}</span>
              <span className="block truncate text-white">{lastMoodObj.label}</span>
            </span>
          ) : (
            <span className="block truncate text-purple-300">Select your mood</span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-[#2d0a5e] border border-white/10 shadow-xl max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {moods.map((mood) => (
              <li
                key={mood.value}
                className="text-white cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-purple-700/50"
                onClick={() => handleMoodSelect(mood)}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{mood.emoji}</span>
                  <span className="block truncate">{mood.label}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {lastMood && lastMoodObj && (
        <div className="mt-3 text-xs text-purple-400">
          Updated: {new Date(lastMood.timestamp?.seconds ? lastMood.timestamp.toDate() : lastMood.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
}