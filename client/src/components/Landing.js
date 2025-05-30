import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      toast.success('Login successful!');
      history.push('/products');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4 text-green-600">Welcome to GB Harvest Organic</h1>
      <p className="text-lg mb-6">Please log in to explore our organic products.</p>
      <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
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
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        New user? <a href="/auth" className="text-blue-500 hover:underline">Sign Up</a>
      </p>
    </div>
  );
}

export default Landing;