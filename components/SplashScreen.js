import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsShown(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isShown) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Lena & Mohamed</h1>
        <p className="text-gray-700">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ...</p>
      </div>
    </div>
  );
}