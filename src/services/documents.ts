import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Document } from '../types';

export const uploadDocument = async (
  userId: string,
  file: File,
  type: Document['type'],
  title: string,
  sessionId?: string
) => {
  try {
    // Upload file to Storage
    const storageRef = ref(storage, `documents/${userId}/${Date.now()}_${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    // Create document record in Firestore
    const docData: Omit<Document, 'id'> = {
      userId,
      sessionId,
      type,
      title,
      fileUrl: downloadUrl,
      timestamp: new Date().toISOString(),
      metadata: {
        size: file.size,
        mimeType: file.type,
        originalName: file.name
      }
    };

    const docRef = await addDoc(collection(db, 'documents'), {
      ...docData,
      timestamp: serverTimestamp()
    });

    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const fetchUserDocuments = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Document[];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const deleteDocument = async (document: Document) => {
  try {
    // Delete file from Storage
    const storageRef = ref(storage, document.fileUrl);
    await deleteObject(storageRef);

    // Delete document record from Firestore
    await deleteDoc(doc(db, 'documents', document.id));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};