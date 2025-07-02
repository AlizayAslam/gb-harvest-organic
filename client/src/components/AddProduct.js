import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Input from './Input.js';
import { useAuth } from '../AuthContext.js'; // Path: up one directory

function AddProduct({ setProducts }) {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setNewProduct({ ...newProduct, imageUrl: '' });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (user?.role !== 'admin' && user?.role !== 'headAdmin') {
      toast.error('Only admins can add products!');
      return;
    }
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      toast.error('Name, price, category, and stock are required!');
      return;
    }
    if (newProduct.price < 0 || newProduct.stock < 0) {
      toast.error('Price and stock cannot be negative!');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (newProduct.imageUrl) {
      formData.append('imageUrl', newProduct.imageUrl);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.success) {
        setProducts((prev) => [...prev, response.data.product]);
        setNewProduct({ name: '', price: '', category: '', description: '', stock: '', imageUrl: '' });
        setImageFile(null);
        toast.success('Product added successfully!');
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add product error:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Add New Product</h2>
      <form onSubmit={handleAddProduct} className="max-w-md mx-auto space-y-4">
        <Input
          type="text"
          placeholder="Product Name"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
        />
        <select
          name="category"
          value={newProduct.category}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="Fruit">Fruit</option>
          <option value="Dry Fruit">Dry Fruit</option>
          <option value="Shilajit">Shilajit</option>
        </select>
        <Input
          type="text"
          placeholder="Description"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          placeholder="Stock"
          name="stock"
          value={newProduct.stock}
          onChange={handleInputChange}
          required
          min="0"
        />
        <Input
          type="text"
          placeholder="Image URL (optional)"
          name="imageUrl"
          value={newProduct.imageUrl}
          onChange={handleInputChange}
          disabled={imageFile !== null}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

AddProduct.propTypes = {
  setProducts: PropTypes.func.isRequired,
};

export default AddProduct;