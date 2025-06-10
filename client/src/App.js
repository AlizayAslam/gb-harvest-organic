import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/SignUp';
import Login from './components/Login';
import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './components/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/products" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/products" />} />
        <Route path="/products" element={user ? <ProductList /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;