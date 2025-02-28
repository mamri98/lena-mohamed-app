// Import the next-pwa package using ES Module syntax
import NextPWA from 'next-pwa';

// Create the withPWA function
const withPWA = NextPWA({
  dest: 'public',
  register: false, // We register manually in _app.js
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

// Export the configuration using ES Module syntax
export default withPWA({
  reactStrictMode: true,
});