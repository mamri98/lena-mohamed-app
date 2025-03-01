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

  // Initialize on client side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch the current link for this user
  useEffect(() => {
    if (!isMounted || !db || !name) return;

    const fetchCurrentLink = async () => {
      try {
        const linksRef = collection(db, 'sharedLinks');
        const q = query(
          linksRef,
          where('name', '==', name),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const linkData = snapshot.docs[0].data();
          // Ensure we're getting the current user's link
          if (linkData.name === name) {
            setCurrentLink(linkData);
          }
        }
      } catch (error) {
        console.error('Error fetching link:', error);
        setError('Failed to load your shared link');
      }
    };

    fetchCurrentLink();
  }, [isMounted, db, name]);

  // Function to validate and format URL
  const formatUrl = (url) => {
    let formattedUrl = url.trim();
    
    // Check if URL has protocol, add https:// if missing
    if (formattedUrl && !formattedUrl.match(/^https?:\/\//i)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    return formattedUrl;
  };

  // Submit new link
  const submitLink = async (e) => {
    e.preventDefault();
    
    if (!inputUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const formattedUrl = formatUrl(inputUrl);
      
      // Save to Firebase
      await addDoc(collection(db, 'sharedLinks'), {
        name,
        url: formattedUrl,
        timestamp: serverTimestamp(),
      });
      
      // Update local state
      setCurrentLink({
        name,
        url: formattedUrl,
        timestamp: new Date() // Use local date until server date is available
      });
      
      // Reset form
      setInputUrl('');
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error saving link:', error);
      setError('Failed to save your link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract hostname from URL for display
  const getDisplayUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  // Show a placeholder during server-side rendering
  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Link Sharing</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-purple-600 mb-2">Link Sharing</h2>
      
      {isEditing ? (
        <form onSubmit={submitLink} className="mt-3">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL to share"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              disabled={isSubmitting}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Link'}
              </button>
            </div>
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
                className="block py-3 px-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-150 ease-in-out border border-purple-100"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {getDisplayUrl(currentLink.url)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 ml-7">
                  Click to open link
                </p>
              </a>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Change link
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-center py-6 px-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No link shared yet</p>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
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