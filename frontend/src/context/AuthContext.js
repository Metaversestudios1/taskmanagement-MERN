

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  const fetchAuth = async () => {
    try {
      const response = await fetch(`http://localhost:3000/protected`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.success) { // Ensure checking the success field correctly
          console.log("You haven't access for the Dashboard");
          setAuth({ isAuthenticated: false, user: null }); // Reset auth state
          return;
        }
        setAuth({ isAuthenticated: true, user: data.user }); // Set auth data
      } else {
        setAuth({ isAuthenticated: false, user: null }); // Token invalid or not present
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setAuth({ isAuthenticated: false, user: null });
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    fetchAuth();
}, []);


  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
