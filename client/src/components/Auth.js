import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js'; // Path: up one directory
import { toast } from 'react-toastify';
import axios from 'axios';
import Input from './Input.js';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', { isLogin, email, name });

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

    try {
      if (isLogin) {
        console.log('Attempting login...');
        await login(email, password);
        toast.success('Login successful!');
        navigate('/products', { replace: true });
      } else {
        console.log('Attempting signup...');
        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
          name,
          email,
          password,
        });
        toast.success('Sign-up successful! Please log in.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Sign-up'} error:`, error.response?.data || error.message);
      toast.error(error.response?.data?.message || `${isLogin ? 'Login' : 'Sign-up'} failed`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/background.jpg)' }}
    >
      <div className="container mx-auto p-6 max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
    </div>
  );
}

export default Auth;