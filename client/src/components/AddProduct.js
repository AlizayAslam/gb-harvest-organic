import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Input from './Input';

function AddProduct({ setProducts }) {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: '',
  });
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (role !== 'admin' && role !== 'headAdmin') {
      toast.error('Only admins can add products!');
      return;
    }
    if (newProduct.price < 0 || newProduct.stock < 0) {
      toast.error('Price and stock cannot be negative!');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/products`,
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => [...prev, response.data]);
      setNewProduct({ name: '', price: '', category: '', description: '', stock: '', image: '' });
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add product');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Add New Product</h2>
      <form onSubmit={handleAddProduct} className="max-w-md mx-auto space-y-4">
        <Input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
          min="0"
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          required
          min="0"
        />
        <Input
          type="text"
          placeholder="Image URL (optional)"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
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