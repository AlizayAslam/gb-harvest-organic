
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
import { toast } from 'react-toastify';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Navbar rendered, user:', user);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-green-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          GB Harvest
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              {user.role === 'admin' || user.role === 'headAdmin' ? (
                <Link to="/admin" className="hover:underline">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/products" className="hover:underline">
                  Products
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="hover:underline">
              Login/Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;