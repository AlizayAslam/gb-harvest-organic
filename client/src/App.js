import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Auth from './components/Auth';
import Landing from './components/Landing';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/products" />} />
          <Route path="/products" element={user ? <ProductList /> : <Navigate to="/auth" />} />
          <Route
            path="/admin"
            element={
              user && (user.role === 'admin' || user.role === 'headAdmin') ? (
                <AdminPanel />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/add-product"
            element={<ProtectedRoute><AddProduct /></ProtectedRoute>}
          />
          <Route
            path="/edit-product/:id"
            element={<ProtectedRoute><EditProduct /></ProtectedRoute>}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;