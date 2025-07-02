import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.js'; // Correct path: up one directory
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from './Input.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

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
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/products');
    } catch (error) {
      console.error('Login error:', error.response || error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Login</h2>
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
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;