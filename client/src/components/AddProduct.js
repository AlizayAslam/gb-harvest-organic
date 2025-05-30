import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

function AddProduct({ token, role, setProducts }) {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: '',
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (role !== 'admin') {
      toast.error('Only admins can add products!');
      return;
    }
    if (newProduct.price < 0 || newProduct.stock < 0) {
      toast.error('Price and stock cannot be negative!');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products`,
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
      <form onSubmit={handleAddProduct} className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="w-full p-2 border rounded"
          required
          min="0"
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="Fruit">Fruit</option>
          <option value="Dry Fruit">Dry Fruit</option>
          <option value="Shilajit">Shilajit</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          className="w-full p-2 border rounded"
          required
          min="0"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Product
        </button>
      </form>
    </div>
  );
}

AddProduct.propTypes = {
  token: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  setProducts: PropTypes.func.isRequired,
};

export default AddProduct;