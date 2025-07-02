import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.js';
import ProductList from './components/ProductList.js';
import AdminProductDashboard from './components/AdminProductDashboard.js';
import AddProduct from './components/AddProduct.js';
import EditProduct from './components/EditProduct.js';
import Auth from './components/Auth.js';
import Landing from './components/Landing.js';
import Navbar from './components/Navbar.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute.js';

function App() {
  const { user } = useAuth();
  console.log('App rendering, user:', user);

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/products" />} />
        <Route path="/products" element={user ? <ProductList /> : <Navigate to="/auth" />} />
        <Route
          path="/admin"
          element={
            user && (user.role === 'admin' || user.role === 'headAdmin') ? (
              <AdminProductDashboard />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;