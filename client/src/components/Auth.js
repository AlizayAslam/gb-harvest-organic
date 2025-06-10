import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from './Input.js';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!isLogin && !name) {
      toast.error('Name is required for sign-up');
      return;
    }
    const url = isLogin ? '/login' : '/signup';
    const payload = isLogin ? { email, password } : { name, email, password };
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth${url}`, payload);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        toast.success('Login successful!');
        navigate('/products');
      } else {
        toast.success('Sign-up successful! Please log in.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Sign-up'} error:`, error.response?.data);
      toast.error(error.response?.data?.message || `${isLogin ? 'Login' : 'Sign-up'} failed`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {!isLogin && (
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
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
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4">
        {isLogin ? 'New user?' : 'Already have an account?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default Auth;