import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', type: '' });

  // Fetch products from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/login', { email, password })
      .then(response => {
        setToken(response.data.token);
        setRole(response.data.role);
        alert('Login successful!');
      })
      .catch(error => alert('Login failed!'));
  };

  // Handle adding a new product (admin only)
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (role !== 'admin') return alert('Only admins can add products!');
    axios.post('http://localhost:5000/api/products', newProduct, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ name: '', price: '', type: '' });
        alert('Product added!');
      })
      .catch(error => alert('Failed to add product!'));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-4">GB Harvest Organic</h1>

      {/* Login Form */}
      {!token && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <button type="submit" className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
              Login
            </button>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {products.map(product => (
          <div key={product._id} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Type: {product.type}</p>
          </div>
        ))}
      </div>

      {/* Add Product Form (Admin Only) */}
      {token && role === 'admin' && (
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Add Product</h2>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <select
              value={newProduct.type}
              onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
              className="p-2 border rounded"
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="Fruit">Fruit</option>
              <option value="Dry Fruit">Dry Fruit</option>
              <option value="Shilajit">Shilajit</option>
            </select>
            <button type="submit" className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
              Add Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;