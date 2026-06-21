import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

const loadSavedUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const loadSavedToken = () => {
  return localStorage.getItem('token') || null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadSavedUser);
  const [token, setToken] = useState(loadSavedToken);

  const login = (userData, authToken) => {
    if (authToken) {
      localStorage.setItem('token', authToken);
      setToken(authToken);
    }
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    setUser,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
