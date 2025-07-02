
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function AddProduct({ setProducts }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    if (image) {
      formData.append('image', image);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      console.log('Sending product data:', { name, description, price, category, stock, image: image ? image.name : null, imageUrl });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Add product response:', res.data);
      setProducts((prev) => [...prev, res.data]);
      toast.success('Product added successfully');
      navigate('/admin');
    } catch (err) {
      console.error('Add product error:', err.response || err);
      toast.error(err.response?.data?.message || 'Failed to add product. Check console for details.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL (optional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImage(null); // Clear file input if URL is used
            }}
            className="w-full p-2 border rounded"
            disabled={image !== null}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Image (optional)</label>
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setImageUrl(''); // Clear URL if file is uploaded
            }}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;