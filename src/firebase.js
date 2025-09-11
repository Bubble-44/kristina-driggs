// ...existing code...
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// safe env lookup for CRA (REACT_APP_), Vite (VITE_), or runtime window.__env
const _env = (key) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) return import.meta.env[key];
  if (typeof window !== 'undefined' && window.__env && window.__env[key]) return window.__env[key];
  if (typeof globalThis !== 'undefined' && globalThis.__env && globalThis.__env[key]) return globalThis.__env[key];
  return undefined;
};

const firebaseConfig = {
  apiKey: _env('REACT_APP_FIREBASE_API_KEY') || _env('VITE_FIREBASE_API_KEY') || _env('FIREBASE_API_KEY') || 'AIzaSyD5ePeRatuBAFXcDC1nkTbp1vKtW_dsSr4',
  authDomain: _env('REACT_APP_FIREBASE_AUTH_DOMAIN') || _env('VITE_FIREBASE_AUTH_DOMAIN') || 'kristina-driggs.firebaseapp.com',
  projectId: _env('REACT_APP_FIREBASE_PROJECT_ID') || _env('VITE_FIREBASE_PROJECT_ID') || 'kristina-driggs',
  storageBucket: _env('REACT_APP_FIREBASE_STORAGE_BUCKET') || _env('VITE_FIREBASE_STORAGE_BUCKET') || 'kristina-driggs.appspot.com',
  messagingSenderId: _env('REACT_APP_FIREBASE_MESSAGING_SENDER_ID') || _env('VITE_FIREBASE_MESSAGING_SENDER_ID') || '264485824451',
  appId: _env('REACT_APP_FIREBASE_APP_ID') || _env('VITE_FIREBASE_APP_ID') || '1:264485824451:web:e740b2d23b58d4d1a97f76',
  measurementId: _env('REACT_APP_FIREBASE_MEASUREMENT_ID') || _env('VITE_FIREBASE_MEASUREMENT_ID') || 'G-B4NRH1CLNF'
};

// debug: shows what will be used at runtime (remove in production)
if (typeof window !== 'undefined') {
  console.debug('firebaseConfig (runtime):', {
    apiKey: firebaseConfig.apiKey ? '***present***' : '***missing***',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    appId: firebaseConfig.appId
  });
  if (!firebaseConfig.apiKey) {
    console.error('Firebase API key missing at runtime. Ensure env vars or window.__env are set.');
  }
}

// initialize app (avoid double init during HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// DEBUG: show app options so we confirm the running bundle uses this firebase.js
if (typeof window !== 'undefined') {
  try {
    console.debug('getApps().length (runtime):', getApps().length);
    console.debug('firebase app options (runtime):', getApp().options || {});
  } catch (e) { /* noop */ }
}

// initialize Firestore with the actual database id seen in the Console
export const db = initializeFirestore(app, {
  databaseId: 'livepage',
  experimentalForceLongPolling: true,
  useFetchStreams: true
});

// DEBUG: confirm Firestore instance used at runtime (inspect internal id if present)
if (typeof window !== 'undefined') {
  try {
    const dbid = (db && (db._databaseId || db.__databaseId || (db._settings && db._settings.databaseId))) || null;
    console.debug('Firestore initialized (runtime) db internal id:', dbid);
    console.debug('Firestore initialized with databaseId=livepage (runtime).');
  } catch (e) { /* noop */ }
}

// init analytics only in browser and optionally
if (typeof window !== 'undefined') {
  try {
    import('firebase/analytics').then(({ getAnalytics }) => {
      try { getAnalytics(app); } catch (e) { /* ignore analytics init errors */ }
    }).catch(() => { /* analytics not available */ });
  } catch (e) { /* ignore */ }
}

// export auth for AdminLive and other components
export const auth = getAuth(app);

export default app;
// ...existing code...