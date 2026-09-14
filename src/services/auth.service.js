import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Signup - Create new admin + team
export const signupAdmin = async (email, password, name, clinicName) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Create team
    const teamRef = await addDoc(collection(db, 'teams'), {
      name: clinicName,
      createdBy: userId,
      createdAt: new Date(),
      memberCount: 1,
    });

    const teamId = teamRef.id;

    // Create user profile
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      email,
      name,
      role: 'admin',
      status: 'active',
      teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
    });

    return { userId, teamId, role: 'admin' };
  } catch (error) {
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Get user profile
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) throw new Error('User profile not found');

    return userDoc.data();
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Get current user and profile
export const getCurrentUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw error;
  }
};

// Create member account (admin only)
export const createMemberAccount = async (email, password, name, teamId) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Create user profile
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      email,
      name,
      role: 'member',
      status: 'active',
      teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
    });

    return { userId, role: 'member' };
  } catch (error) {
    throw error;
  }
};

// Get all team members
export const getTeamMembers = async (teamId) => {
  try {
    const q = query(collection(db, 'users'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    throw error;
  }
};

// Setup auth state listener
export const setupAuthStateListener = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getCurrentUserProfile(user.uid);
      callback({ firebaseUser: user, profile });
    } else {
      callback(null);
    }
  });
};
