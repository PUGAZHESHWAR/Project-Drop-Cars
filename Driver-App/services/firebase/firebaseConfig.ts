import { getApps, getApp } from '@react-native-firebase/app';

// Firebase will auto-initialize from google-services.json
// We just need to ensure it's available
let firebaseApp;
try {
  console.log('🔥 Checking Firebase initialization...');
  
  // Check if Firebase is already initialized
  const apps = getApps();
  if (apps.length === 0) {
    console.log('🔥 Firebase not initialized yet, waiting for auto-initialization...');
    // Firebase should auto-initialize from google-services.json
    // We'll wait a bit and then check again
    setTimeout(() => {
      const appsAfterWait = getApps();
      if (appsAfterWait.length > 0) {
        console.log('🔥 Firebase auto-initialized successfully');
      } else {
        console.error('❌ Firebase failed to auto-initialize');
      }
    }, 2000);
  } else {
    console.log('🔥 Firebase already initialized');
    firebaseApp = getApp();
  }
} catch (error) {
  console.error('❌ Error checking Firebase:', error);
}

export default firebaseApp;
