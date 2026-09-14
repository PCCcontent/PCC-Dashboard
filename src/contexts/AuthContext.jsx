import React, { createContext, useState, useEffect } from 'react';
import { setupAuthStateListener, getCurrentUserProfile } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    const unsubscribe = setupAuthStateListener(async (authData) => {
      if (authData) {
        setCurrentUser(authData.firebaseUser);
        setUserProfile(authData.profile);
        setUserRole(authData.profile?.role);
        setTeamId(authData.profile?.teamId);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setUserRole(null);
        setTeamId(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    userRole,
    teamId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
