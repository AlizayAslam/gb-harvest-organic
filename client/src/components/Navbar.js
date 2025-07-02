import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js'; // Path: up one directory

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-green-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">GB Harvest Organic</Link>
        <div className="space-x-4">
          <Link to="/products" className="hover:underline">Products</Link>
          {user && (user.role === 'admin' || user.role === 'headAdmin') && (
            <Link to="/admin" className="hover:underline">Admin Panel</Link>
          )}
          {user ? (
            <button onClick={() => { logout(); navigate('/auth'); }} className="hover:underline">
              Logout
            </button>
          ) : (
            <Link to="/auth" className="hover:underline">Login/Signup</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;