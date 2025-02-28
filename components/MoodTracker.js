import { useState, useEffect } from 'react';

export default function MoodTracker({ name }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastMood, setLastMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [db, setDb] = useState(null);
  
  // We don't set a default selected mood - it will be derived from lastMood

  // Initialize on client side only
  useEffect(() => {
    setIsMounted(true);
    // Import Firebase modules only on client side
    const initFirebase = async () => {
      try {
        const { db } = await import('../firebase/firebase');
        setDb(db);
      } catch (error) {
        console.error("Failed to initialize Firebase:", error);
      }
    };
    
    initFirebase();
  }, []);

  const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'meh', emoji: '😐', label: 'Meh' },
    { value: 'dominant', emoji: '👠', label: 'Dominant' },
    { value: 'jealous', emoji: '😒', label: 'Jealous' },
    { value: 'content', emoji: '😌', label: 'Content' },
    { value: 'annoyed', emoji: '😤', label: 'Annoyed' },
    { value: 'stressed', emoji: '😰', label: 'Stressed' },
    { value: 'upset', emoji: '😠', label: 'Upset' },
    { value: 'relaxed', emoji: '😎', label: 'Relaxed' },
  ];

  // Fetch mood history once mounted and DB is available
  useEffect(() => {
    if (!isMounted || !db || !name) return;

    const fetchLastMood = async () => {
      try {
        const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');
        
        const moodsRef = collection(db, 'moods');
        const q = query(
          moodsRef,
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          // Find the latest mood for the current name
          const userMoods = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(mood => mood.name === name);
            
          if (userMoods.length > 0) {
            setLastMood(userMoods[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching mood:', error);
      }
    };

    fetchLastMood();
  }, [isMounted, db, name]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMoodSelect = async (mood) => {
    if (!isMounted || !db) return;
    
    setIsOpen(false);
    setIsSubmitting(true);
    
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      
      // Save mood to Firebase
      await addDoc(collection(db, 'moods'), {
        name,
        mood: mood.value,
        emoji: mood.emoji,
        timestamp: serverTimestamp(),
      });
      
      // Update last mood
      setLastMood({
        name,
        mood: mood.value,
        emoji: mood.emoji,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find the mood object by value
  const findMoodByValue = (value) => {
    return moods.find(mood => mood.value === value) || null;
  };
  
  // Instead of tracking a separate selected mood state,
  // we use the last mood for the current person
  const lastMoodObj = lastMood ? findMoodByValue(lastMood.mood) : null;

  // Show a placeholder during server-side rendering
  if (!isMounted) {
    return (
      <div className="text-center">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling today?
        </label>
        <div className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left sm:text-sm">
          <span className="block truncate text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        How are you feeling today?
      </label>
      
      <div className="relative">
        <button
          type="button"
          className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          onClick={toggleDropdown}
          disabled={isSubmitting}
        >
          {lastMoodObj ? (
            <span className="flex items-center">
              <span className="mr-2 text-xl">{lastMoodObj.emoji}</span>
              <span className="block truncate">{lastMoodObj.label}</span>
            </span>
          ) : (
            <span className="block truncate text-gray-500">Select your mood</span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {moods.map((mood) => (
              <li
                key={mood.value}
                className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-purple-100"
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
        <div className="mt-3 text-xs text-gray-500">
          <span>Updated: {new Date(lastMood.timestamp?.seconds ? lastMood.timestamp.toDate() : lastMood.timestamp).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}