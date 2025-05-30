import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          email,
          password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        toast.success('Login successful!');
        history.push('/products');
      } else {
        // Signup
        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
          name,
          email,
          password,
        });
        toast.success('Sign-up successful! Please log in.');
        setIsLogin(true); // Switch to login form after signup
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || (isLogin ? 'Login failed' : 'Sign-up failed'));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline ml-1"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default Auth;