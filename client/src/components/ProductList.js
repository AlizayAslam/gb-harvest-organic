import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      {user && user.role === 'admin' && (
        <button onClick={() => navigate('/admin')} className="mb-4 p-2 bg-green-500 text-white rounded">
          Manage Products
        </button>
      )}
      <button onClick={logout} className="ml-4 p-2 bg-red-500 text-white rounded">
        Logout
      </button>
      <ul>
        {products.map(product => (
          <li key={product._id} className="mb-2">{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;