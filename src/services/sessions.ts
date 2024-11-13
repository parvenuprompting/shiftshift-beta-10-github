import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Session } from '../types';

export const fetchUserSessions = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Session[];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

export const createSession = async (userId: string, sessionData: Omit<Session, 'id' | 'userId'>) => {
  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      userId,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, ...sessionData, userId };
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const updateSession = async (sessionId: string, data: Partial<Session>) => {
  try {
    await updateDoc(doc(db, 'sessions', sessionId), data);
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

export const deleteSession = async (sessionId: string) => {
  try {
    await deleteDoc(doc(db, 'sessions', sessionId));
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};