import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Expense } from '../types';

export const fetchUserExpenses = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate().toISOString()
          : data.timestamp
      } as Expense;
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expense,
      timestamp: serverTimestamp()
    });
    
    return { 
      id: docRef.id, 
      ...expense,
      timestamp: new Date().toISOString() // Use current time for immediate display
    };
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId: string, data: Partial<Expense>) => {
  try {
    const docRef = doc(db, 'expenses', expenseId);
    await updateDoc(docRef, {
      ...data,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};