
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext.js';

function AdminProductDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API response:', res.data);
        if (!Array.isArray(res.data.products)) {
          throw new Error('Invalid data format: Expected an array of products');
        }
        setProducts(res.data.products);
        setLoading(false);
      } catch (err) {
        console.error('Fetch products error:', err.response || err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch products');
        setLoading(false);
        toast.error(err.response?.data?.message || err.message || 'Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }
        console.log('Deleting product with ID:', id);
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Delete response:', res.data);
        setProducts(products.filter((product) => product._id !== id));
        toast.success('Product deleted successfully');
      } catch (err) {
        console.error('Delete product error:', err.response || err);
        toast.error(err.response?.data?.message || 'Failed to delete product. Check console for details.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Product Dashboard</h2>
      <Link
        to="/add-product"
        className="mb-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Product
      </Link>
      {products.length === 0 ? (
        <p className="text-center">No products found. Add some products!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              {product.image ? (
                <img
                  src={product.image.startsWith('http') ? product.image : `${process.env.REACT_APP_API_URL}/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                  onError={(e) => console.log(`Image failed to load: ${e.target.src}`)}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>{product.description}</p>
              <p className="font-bold">${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
              <div className="mt-4 space-x-2">
                <Link
                  to={`/edit-product/${product._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProductDashboard;