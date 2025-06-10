import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.js';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Products</h2>
      <div className="flex gap-4 mb-4">
        {user && (user.role === 'admin' || user.role === 'headAdmin') && (
          <button
            onClick={() => navigate('/admin')}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Manage Products
          </button>
        )}
        <button
          onClick={logout}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product._id} className="p-4 border rounded-lg shadow-sm">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>{product.description || 'No description'}</p>
              <p>Stock: {product.stock}</p>
              {(user?.role === 'admin' || user?.role === 'headAdmin') && (
                <button
                  onClick={() => navigate(`/edit-product/${product._id}`)}
                  className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;