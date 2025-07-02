import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext.js'; // Correct path: up one directory

const AdminProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', `${process.env.REACT_APP_API_URL}/api/products`);
      console.log('Token:', localStorage.getItem('token'));
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('API Response:', response.data);
      if (response.data.success) {
        setProducts(response.data.products || []);
        setError('');
        if (!response.data.products || response.data.products.length === 0) {
          setError('No products found');
        }
      } else {
        setError(response.data.message || 'Failed to load products');
        toast.error(response.data.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Fetch products error:', err.response || err);
      setError(err.response?.data?.message || 'Failed to load products');
      toast.error(err.response?.data?.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      setError('Name, price, category, and stock are required');
      toast.error('Name, price, category, and stock are required');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('stock', formData.stock);
    if (imageFile) {
      data.append('image', imageFile);
    } else if (formData.imageUrl) {
      data.append('imageUrl', formData.imageUrl);
    }

    try {
      if (editId) {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${editId}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data.success) {
          setSuccess('Product updated successfully');
          setProducts(products.map((p) => (p._id === editId ? response.data.product : p)));
          setEditId(null);
          setFormData({ name: '', price: '', category: '', description: '', stock: '', imageUrl: '' });
          setImageFile(null);
          toast.success('Product updated successfully');
          fetchProducts(); // Refresh product list
        } else {
          setError(response.data.message || 'Failed to edit product');
          toast.error(response.data.message || 'Failed to edit product');
        }
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data.success) {
          setSuccess('Product added successfully');
          setProducts([...products, response.data.product]);
          setFormData({ name: '', price: '', category: '', description: '', stock: '', imageUrl: '' });
          setImageFile(null);
          toast.success('Product added successfully');
          fetchProducts(); // Refresh product list
        } else {
          setError(response.data.message || 'Failed to add product');
          toast.error(response.data.message || 'Failed to add product');
        }
      }
    } catch (err) {
      console.error('Submit error:', err.response || err);
      setError(err.response?.data?.message || 'An error occurred');
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      stock: product.stock,
      imageUrl: product.image || '',
    });
    setImageFile(null);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setProducts(products.filter((p) => p._id !== id));
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh product list
      } else {
        setError(response.data.message || 'Failed to delete product');
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err.response || err);
      setError(err.response?.data?.message || 'Error deleting product');
      toast.error(err.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
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
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="Fruit">Fruit</option>
            <option value="Dry Fruit">Dry Fruit</option>
            <option value="Shilajit">Shilajit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL (optional)</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            disabled={imageFile !== null}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            {editId ? 'Update Product' : 'Add Product'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormData({ name: '', price: '', category: '', description: '', stock: '', imageUrl: '' });
                setImageFile(null);
              }}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Products</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Description</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">${product.price}</td>
                <td className="p-2">{product.category}</td>
                <td className="p-2">{product.description || '-'}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProductDashboard;