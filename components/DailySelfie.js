// components/DailySelfie.js
// CHANGED: White card bg replaced with transparent styles; all text updated for dark purple theme

import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function DailySelfie({ name }) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todaysSelfie, setTodaysSelfie] = useState(null);
  const [hasUploadedToday, setHasUploadedToday] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted || !db || !name) return;
    setTodaysSelfie(null);
    setHasUploadedToday(false);

    const fetchTodaysSelfie = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selfiesRef = collection(db, 'selfies');

        const q = query(selfiesRef, where('name', '==', name), where('timestamp', '>=', today), orderBy('timestamp', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          if (data.name === name) { setTodaysSelfie(data); setHasUploadedToday(true); return; }
        }

        const recentQ = query(selfiesRef, where('name', '==', name), orderBy('timestamp', 'desc'), limit(1));
        const recentSnap = await getDocs(recentQ);
        if (!recentSnap.empty) {
          const data = recentSnap.docs[0].data();
          if (data.name === name) setTodaysSelfie(data);
        }
      } catch (error) {
        console.error('Error fetching selfie:', error);
      }
    };
    fetchTodaysSelfie();
  }, [isMounted, db, name]);

  const processImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let [w, h] = [img.width, img.height];
        const max = 800;
        if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
        else if (h > max) { w = Math.round(w * max / h); h = max; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    const isRetake = e.target.id === 'selfie-retake';
    setLoading(true);
    try {
      const base64Image = await processImage(file);
      const selfieDoc = { name, imageData: base64Image, timestamp: serverTimestamp(), isRetake };
      await addDoc(collection(db, 'selfies'), selfieDoc);
      selfieDoc.timestamp = new Date();
      setTodaysSelfie(selfieDoc);
      setHasUploadedToday(true);
    } catch (error) {
      console.error('Error uploading selfie:', error);
      alert('Failed to upload selfie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!isMounted) return (
    <div className="p-4 text-center text-purple-300">Loading selfie feature...</div>
  );

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-blue-300 mb-4 text-center">Daily Selfie</h2>

      {todaysSelfie && (todaysSelfie.imageUrl || todaysSelfie.imageData) ? (
        <div className="text-center flex-grow flex flex-col justify-center">
          <div className="relative rounded-lg overflow-hidden mb-4 flex justify-center bg-black/20">
            <img
              src={todaysSelfie.imageUrl || todaysSelfie.imageData}
              alt={`${name}'s selfie`}
              className="object-contain w-full h-auto max-h-96"
            />
          </div>
          <p className="text-sm text-purple-400 mb-2">{formatDate(todaysSelfie.timestamp)}</p>
        </div>
      ) : (
        <div className="text-center mb-4 flex-grow flex flex-col justify-center">
          <div className="bg-white/5 border border-white/10 rounded-lg py-16 px-4 mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-purple-300 text-base">No selfie yet</p>
        </div>
      )}

      <div className="w-full border-t border-white/10 pt-4">
        <div className="flex justify-center items-center space-x-3">
          {hasUploadedToday ? (
            <>
              <label className="inline-flex items-center justify-center bg-white/5 text-purple-400 rounded-lg px-4 py-3 text-base font-medium opacity-50 cursor-not-allowed flex-1">
                Already uploaded today
              </label>
              <label
                htmlFor="selfie-retake"
                className={`inline-flex items-center justify-center bg-blue-600/60 text-white rounded-lg px-4 py-3 text-base font-medium ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer'} transition`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake
              </label>
            </>
          ) : (
            <label
              htmlFor="selfie-upload"
              className={`inline-flex items-center justify-center bg-blue-600/60 text-white rounded-lg px-6 py-3 text-base font-medium ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer'} transition w-full max-w-xs`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take a Selfie
                </>
              )}
            </label>
          )}

          <input id="selfie-upload" type="file" accept="image/*" capture="user" onChange={handleFileUpload} disabled={loading || hasUploadedToday} className="sr-only" />
          <input id="selfie-retake" type="file" accept="image/*" capture="user" onChange={handleFileUpload} disabled={loading} className="sr-only" />
        </div>

        {!hasUploadedToday && (
          <p className="text-sm text-center text-purple-400 mt-3">One selfie per day</p>
        )}
      </div>
    </div>
  );
}