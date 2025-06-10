import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Input from './Input.js';

function EditProduct({ setProducts }) {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/products');
      }
    };
    if (role === 'admin' || role === 'headAdmin') fetchProduct();
    else {
      toast.error('Only admins can edit products!');
      navigate('/products');
    }
  }, [id, token, role, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category || !product.stock) {
      toast.error('Name, price, category, and stock are required!');
      return;
    }
    if (product.price < 0 || product.stock < 0) {
      toast.error('Price and stock cannot be negative!');
      return;
    }
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${id}`,
        product,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => prev.map((p) => (p._id === id ? response.data : p)));
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Edit Product</h2>
      <form onSubmit={handleUpdate} className="max-w-md mx-auto space-y-4">
        <Input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          required
          min="0"
        />
        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
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
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          required
          min="0"
        />
        <Input
          type="text"
          placeholder="Image URL (optional)"
          value={product.image}
          onChange={(e) => setProduct({ ...product, image: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

EditProduct.propTypes = {
  setProducts: PropTypes.func.isRequired,
};

export default EditProduct;