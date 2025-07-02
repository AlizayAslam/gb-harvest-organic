import React, { useState } from 'react';
import Login from './Login.js';
import Signup from './Signup.js';
import backgroundImage from '../assets/organic-background.jpg';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          {isLogin ? 'Login' : 'Signup'}
        </h2>
        {isLogin ? <Login /> : <Signup />}
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

export default Auth;