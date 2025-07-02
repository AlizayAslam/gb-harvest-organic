import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching products from:', `${process.env.REACT_APP_API_URL}/api/products`);
        console.log('Token:', localStorage.getItem('token'));
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('API Response:', res.data);
        if (res.data.products) {
          setProducts(res.data.products || []);
          if (!res.data.products || res.data.products.length === 0) {
            setError('No products found');
          }
        } else {
          setError(res.data.message || 'Failed to fetch products');
          toast.error(res.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error);
        setError(error.response?.data?.message || 'Error fetching products');
        toast.error(error.response?.data?.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProducts();
    } else {
      setLoading(false);
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setProducts(products.filter((p) => p._id !== id));
        toast.success('Product deleted successfully');
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Products</h2>
      <div className="flex gap-4 mb-4">
        {user && (user.role === 'admin' || user.role === 'headAdmin') && (
          <button
            onClick={() => navigate('/admin')}
            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Manage Products
          </button>
        )}
        <button
          onClick={() => { logout(); navigate('/auth'); }}
          className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="p-4 border rounded-lg shadow-md bg-white">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-600">Category: {product.category}</p>
              <p className="text-gray-600">{product.description || 'No description'}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
              {(user?.role === 'admin' || user?.role === 'headAdmin') && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;