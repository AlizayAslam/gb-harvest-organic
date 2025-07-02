import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          const { name, price, category, description, stock, image } = response.data.product;
          setFormData({ name, price, category, description: description || '', stock, imageUrl: image || '' });
          setError('');
        } else {
          setError(response.data.message || 'Failed to load product');
          toast.error(response.data.message || 'Failed to load product');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading product');
        toast.error(err.response?.data?.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setFormData({ ...formData, imageUrl: '' }); // Clear URL if file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      setError('Name, price, category, and stock are required');
      toast.error('Name, price, category, and stock are required');
      setLoading(false);
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
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Product updated successfully');
        navigate('/admin');
      } else {
        setError(response.data.message || 'Failed to update product');
        toast.error(response.data.message || 'Failed to update product');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
      toast.error(err.response?.data?.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
            className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;