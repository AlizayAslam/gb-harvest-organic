import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    await axios.post('http://localhost:5000/api/products', newProduct, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProducts([...products, newProduct]);
    setNewProduct({ name: '', price: '' });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <button onClick={() => navigate('/products')} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Back to Products
      </button>
      <div className="mb-4">
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Product Name"
          className="p-2 border rounded mr-2"
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          placeholder="Price"
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleAdd} className="p-2 bg-green-500 text-white rounded">
          Add Product
        </button>
      </div>
      <ul>
        {products.map(product => (
          <li key={product._id} className="mb-2">
            {product.name} - ${product.price}
            <button onClick={() => handleDelete(product._id)} className="ml-4 p-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;