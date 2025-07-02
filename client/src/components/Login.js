import React, { useState } from 'react';
import Input from './Input.js';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || email.length < 5) {
      console.log('Invalid email format:', email);
      toast.error('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      console.log('Password too short:', password.length);
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      console.log('Sending login request to:', `${process.env.REACT_APP_API_URL}/api/auth/login`, { email });
      const response = await login(email, password);
      console.log('Login response:', response);
      navigate('/products');
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700">
        Login
      </button>
    </form>
  );
}

export default Login;