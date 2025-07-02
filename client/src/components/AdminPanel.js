import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      if (response.data.success) {
        setProducts(response.data.products);
        setError('');
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or edit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editId) {
        // Edit product
        const response = await axios.put(`/api/products/${editId}`, formData);
        if (response.data.success) {
          setSuccess('Product updated successfully');
          setProducts(products.map((p) => (p._id === editId ? response.data.product : p)));
          setEditId(null);
        } else {
          setError(response.data.message || 'Failed to edit product');
        }
      } else {
        // Add product
        const response = await axios.post('/api/products', formData);
        if (response.data.success) {
          setSuccess('Product added successfully');
          setProducts([...products, response.data.product]);
        } else {
          setError(response.data.message || 'Failed to add product');
        }
      }
      setFormData({ name: '', price: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Set form for editing
  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, description: product.description || '' });
    setEditId(product._id);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editId ? 'Update Product' : 'Add Product'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ name: '', price: '', description: '' });
            }}
            className="ml-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-t">
              <td className="p-2">{product.name}</td>
              <td className="p-2">${product.price}</td>
              <td className="p-2">{product.description || '-'}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductDashboard;