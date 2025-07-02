import React, { useState } from 'react';
import Input from './Input.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.log('Sending signup request to:', `${process.env.REACT_APP_API_URL}/api/auth/signup`, { email });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      console.log('Signup response:', res.data);
      if (res.data.success) {
        toast.success('Signup successful! Please login.');
        navigate('/auth');
      } else {
        toast.error(res.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700">
        Signup
      </button>
    </form>
  );
}

export default Signup;