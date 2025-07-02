
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        console.log('User verified:', decoded);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Token verification error:', err);
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
      console.log('Token verification complete');
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (err) {
      console.error('Login failed:', err.response?.data || err);
      throw err;
    }
  };

  const signup = async (email, password, role = 'user') => {
    try {
      console.log('Attempting signup with email:', email);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password, role });
      return res.data;
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && user) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart/clear`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Cart cleared on logout');
      }
    } catch (err) {
      console.error('Error clearing cart on logout:', err);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}