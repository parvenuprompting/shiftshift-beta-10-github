import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CommunityPost, Comment } from '../types';

export const fetchPosts = async (category?: string) => {
  try {
    let q = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc')
    );
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CommunityPost[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (post: Omit<CommunityPost, 'id' | 'likes' | 'comments'>) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...post,
      likes: 0,
      comments: [],
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, ...post, likes: 0, comments: [] };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const addComment = async (postId: string, comment: Omit<Comment, 'id'>) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const commentWithId = { ...comment, id: Date.now().toString() };
    await updateDoc(postRef, {
      comments: arrayUnion(commentWithId)
    });
    return commentWithId;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const likePost = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};