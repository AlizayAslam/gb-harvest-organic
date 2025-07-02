
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from './Input.js';
import { useAuth } from '../AuthContext.js';
import backgroundImage from '../assets/organic-background.jpg';

function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();

  console.log('Landing component rendered, user:', user);

  // Redirect authenticated users
  React.useEffect(() => {
    if (user) {
      console.log('Redirecting authenticated user:', user);
      navigate(user.role === 'admin' || user.role === 'headAdmin' ? '/admin' : '/products');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Invalid email format');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Login successful!');
      } else {
        const res = await signup(email, password, 'user');
        if (res.success) {
          toast.success('Signup successful! Please login.');
          setIsLogin(true);
        } else {
          toast.error(res.message || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error.response?.data || error);
      toast.error(error.response?.data?.message || (isLogin ? 'Login failed' : 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }

  if (user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          {isLogin ? 'Login' : 'Signup'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:underline"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;