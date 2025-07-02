import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Verifying token...');
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log('User verified:', res.data);
          setUser(res.data);
        })
        .catch((error) => {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
          console.log('Token verification complete');
        });
    } else {
      setLoading(false);
      console.log('No token found');
    }
  }, []);

  const login = async (email, password) => {
    console.log('Attempting login with email:', email);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setUser({ email, role: res.data.role || 'user' });
      console.log('Login successful:', email);
      return res.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    console.log('Logged out');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}