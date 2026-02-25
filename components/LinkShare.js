// components/LinkShare.js
// CHANGED: All white backgrounds, borders, and text updated to match dark purple theme

import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

export default function LinkShare({ name }) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [inputUrl, setInputUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted || !db || !name) return;
    const fetchCurrentLink = async () => {
      try {
        const q = query(
          collection(db, 'sharedLinks'),
          where('name', '==', name),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const linkData = snapshot.docs[0].data();
          if (linkData.name === name) setCurrentLink(linkData);
        }
      } catch (error) {
        console.error('Error fetching link:', error);
        setError('Failed to load your shared link');
      }
    };
    fetchCurrentLink();
  }, [isMounted, db, name]);

  const formatUrl = (url) => {
    let f = url.trim();
    if (f && !f.match(/^https?:\/\//i)) f = 'https://' + f;
    return f;
  };

  const submitLink = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) { setError('Please enter a valid URL'); return; }
    setIsSubmitting(true);
    setError('');
    try {
      const formattedUrl = formatUrl(inputUrl);
      await addDoc(collection(db, 'sharedLinks'), { name, url: formattedUrl, timestamp: serverTimestamp() });
      setCurrentLink({ name, url: formattedUrl, timestamp: new Date() });
      setInputUrl('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving link:', error);
      setError('Failed to save your link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisplayUrl = (url) => {
    try { return new URL(url).hostname; } catch { return url; }
  };

  if (!isMounted) {
    return (
      <div className="p-1 mb-4">
        <h2 className="text-lg font-semibold text-amber-300 mb-2">Link Sharing</h2>
        <div className="animate-pulse h-8 bg-white/10 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="p-1 mb-4">
      <h2 className="text-lg font-semibold text-amber-300 mb-3">Link Sharing</h2>

      {isEditing ? (
        <form onSubmit={submitLink} className="mt-2 space-y-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter URL to share"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-purple-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 border border-white/20 rounded-md text-sm text-purple-200 hover:bg-white/10 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 border border-transparent rounded-md text-sm text-white bg-amber-600/70 hover:bg-amber-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Link'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          {currentLink ? (
            <div className="mt-2">
              <a
                href={currentLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/20 transition duration-150"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm font-medium text-white truncate">{getDisplayUrl(currentLink.url)}</span>
                </div>
                <p className="mt-1 text-xs text-purple-400 ml-7">Click to open link</p>
              </a>
              <div className="mt-3 flex justify-end">
                <button onClick={() => setIsEditing(true)} className="text-sm text-amber-400 hover:text-amber-300">
                  Change link
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-center py-6 px-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-purple-300 mb-4">No link shared yet</p>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm text-white bg-amber-600/70 hover:bg-amber-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Share a link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}