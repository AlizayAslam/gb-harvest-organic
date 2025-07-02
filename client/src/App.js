// File: client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.js';
import ProductList from './components/ProductList.js';
import AdminProductDashboard from './components/AdminProductDashboard.js';
import AddProduct from './components/AddProduct.js';
import EditProduct from './components/EditProduct.js';
import Landing from './components/Landing.js';
import Navbar from './components/Navbar.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute.js';

function App() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  console.log('App rendered, user:', user);

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={user ? <ProductList /> : <Navigate to="/" />} />
        <Route
          path="/admin"
          element={
            user && (user.role === 'admin' || user.role === 'headAdmin') ? (
              <AdminProductDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct setProducts={setProducts} /></ProtectedRoute>} />
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