import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAmEKZY3XXhJaBqcJrL3hi4PSZKseY5oW8",
  authDomain: "shiftshift-bde28.firebaseapp.com",
  projectId: "shiftshift-bde28",
  storageBucket: "shiftshift-bde28.firebasestorage.app",
  messagingSenderId: "862330860596",
  appId: "1:862330860596:web:0b32a2dbcd083f03584661"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);