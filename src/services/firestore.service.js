import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// Posts
export const createPost = async (teamId, postData) => {
  try {
    const postsRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      teamId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return postsRef.id;
  } catch (error) {
    throw error;
  }
};

export const getTeamPosts = async (teamId) => {
  try {
    const q = query(collection(db, 'posts'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    throw error;
  }
};

export const getUserPosts = async (teamId, userId) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('teamId', '==', teamId),
      where('createdBy', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    throw error;
  }
};

export const getUserAssignedPosts = async (teamId, userId) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('teamId', '==', teamId),
      where('assignedTo', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      ...postData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    throw error;
  }
};

// Analytics/Metrics
export const createMetric = async (teamId, metricData) => {
  try {
    const metricsRef = await addDoc(collection(db, 'metrics'), {
      ...metricData,
      teamId,
      createdAt: Timestamp.now(),
    });
    return metricsRef.id;
  } catch (error) {
    throw error;
  }
};

export const getTeamMetrics = async (teamId) => {
  try {
    const q = query(collection(db, 'metrics'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    throw error;
  }
};

// Team info
export const getTeamInfo = async (teamId) => {
  try {
    const teamDoc = await getDoc(doc(db, 'teams', teamId));
    return teamDoc.exists() ? teamDoc.data() : null;
  } catch (error) {
    throw error;
  }
};

export const updateTeamInfo = async (teamId, teamData) => {
  try {
    await updateDoc(doc(db, 'teams', teamId), teamData);
  } catch (error) {
    throw error;
  }
};
