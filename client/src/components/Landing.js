import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from './Input';

function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      toast.success('Login successful!');
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <img
        src="/images/organic-banner.jpg"
        alt="Organic Products"
        className="w-full max-w-2xl mx-auto mb-6 rounded-lg"
      />
      <h1 className="text-4xl font-bold mb-6 text-green-600">Welcome to GB Harvest Organic</h1>
      <p className="text-lg mb-6 text-gray-600">Please log in to explore our organic products.</p>
      <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
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
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4 text-gray-600">
        New user? <a href="/auth" className="text-blue-500 hover:underline">Sign Up</a>
      </p>
    </div>
  );
}

export default Landing;