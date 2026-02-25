// components/MarriageTips.js
// CHANGED: Removed white card bg; updated all text colors, category badge, and borders for dark purple theme

import { useState, useEffect } from 'react';
import { marriageTips } from '../data/marriageTips';

export default function MarriageTips() {
  const [isMounted, setIsMounted] = useState(false);
  const [dailyTip, setDailyTip] = useState(null);
  const [countdownText, setCountdownText] = useState('');

  const getDailyTip = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const dateNumber = (year * 10000) + (month * 100) + day;
    const combinedValue = dateNumber + (day * 31) + (month * 37) + ((year % 100) * 41);
    return marriageTips[combinedValue % marriageTips.length];
  };

  const getTodayDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  };

  const calculateCountdown = () => {
    const difference = new Date('March 28, 2026') - new Date();
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      return `${days} days, ${hours} hours, ${minutes} minutes`;
    }
    return "It's our wedding day!";
  };

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const today = getTodayDateString();
      const storedTipData = localStorage.getItem('dailyMarriageTip');
      const storedTip = storedTipData ? JSON.parse(storedTipData) : null;

      if (storedTip && storedTip.date === today) {
        setDailyTip(storedTip.data);
      } else {
        const newTip = getDailyTip();
        setDailyTip(newTip);
        localStorage.setItem('dailyMarriageTip', JSON.stringify({ date: today, data: newTip }));
      }

      setCountdownText(calculateCountdown());
      const timer = setInterval(() => setCountdownText(calculateCountdown()), 60000);
      return () => clearInterval(timer);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="p-4 mb-6">
        <h2 className="text-lg font-semibold text-red-300 mb-2">Marriage Tip of the Day</h2>
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 mb-2">
      <h2 className="text-lg font-semibold text-red-300 mb-3">Marriage Tip of the Day</h2>

      {dailyTip && (
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded mb-2">
            {dailyTip.category}
          </span>
          <p className="text-purple-100">{dailyTip.tip}</p>
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-3">
        <h3 className="text-sm font-medium text-red-300 mb-1">Countdown to Our Nikkah:</h3>
        <p className="text-white font-medium">{countdownText}</p>
        <p className="text-xs text-red-300 mt-1 italic">Can't wait to marry you ❤️</p>
      </div>
    </div>
  );
}