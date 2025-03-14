// components/MarriageTips.js
// Fixed marriage tip selection algorithm to ensure better distribution
import { useState, useEffect } from 'react';
import { marriageTips } from '../data/marriageTips';

export default function MarriageTips() {
  const [isMounted, setIsMounted] = useState(false);
  const [dailyTip, setDailyTip] = useState(null);
  const [countdownText, setCountdownText] = useState('');
  
  // Get a pseudorandom but consistent tip for each day with improved distribution
  const getDailyTip = () => {
    // Get date components individually to ensure consistency across locales
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // +1 because getMonth() is 0-indexed
    const year = now.getFullYear();
    
    // Create a numeric value based on the date (year * 10000 + month * 100 + day)
    // This ensures each date has a unique number
    const dateNumber = (year * 10000) + (month * 100) + day;
    
    // Use prime multipliers to create better distribution
    const dayFactor = day * 31;
    const monthFactor = month * 37;
    const yearFactor = (year % 100) * 41; // Use just the last two digits of year for consistency
    
    // Combine all factors for better distribution
    const combinedValue = dateNumber + dayFactor + monthFactor + yearFactor;
    const index = combinedValue % marriageTips.length;
    
    return marriageTips[index];
  };
  
  // Get today's date in a consistent format for storage comparison
  const getTodayDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  };
  
  // Calculate countdown to nikkah
  const calculateCountdown = () => {
    const now = new Date();
    const nikkahDate = new Date('March 1, 2026');
    
    // Calculate difference in milliseconds
    const difference = nikkahDate - now;
    
    // Convert to days, hours, minutes
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days} days, ${hours} hours, ${minutes} minutes`;
    } else {
      return "It's our wedding day!";
    }
  };
  
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      // Get today's date in a consistent format (YYYY-MM-DD)
      const today = getTodayDateString();
      
      // Check if we already have a tip for today
      const storedTipData = localStorage.getItem('dailyMarriageTip');
      const storedTip = storedTipData ? JSON.parse(storedTipData) : null;
      
      // If we have a stored tip from today, use it
      if (storedTip && storedTip.date === today) {
        setDailyTip(storedTip.data);
      } else {
        // Otherwise get a new tip for today
        const newTip = getDailyTip();
        setDailyTip(newTip);
        
        // Cache in localStorage with consistent date format
        localStorage.setItem('dailyMarriageTip', JSON.stringify({
          date: today,
          data: newTip
        }));
      }
      
      // Initial countdown calculation
      setCountdownText(calculateCountdown());
      
      // Update countdown every minute
      const timer = setInterval(() => {
        setCountdownText(calculateCountdown());
      }, 60000);
      
      return () => clearInterval(timer);
    }
  }, []);
  
  // Show a placeholder during server-side rendering
  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Marriage Tip of the Day</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-red-600 mb-2">Marriage Tip of the Day</h2>
      
      {dailyTip && (
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded mb-2">
            {dailyTip.category}
          </span>
          <p className="text-gray-800">{dailyTip.tip}</p>
        </div>
      )}
      
      <div className="mt-4 border-t border-gray-100 pt-3">
        <h3 className="text-sm font-medium text-red-600 mb-1">Countdown to Our Nikkah:</h3>
        <p className="text-gray-700 font-medium">{countdownText}</p>
        <p className="text-xs text-red-500 mt-1 italic">Can't wait to marry you ❤️</p>
      </div>
    </div>
  );
}