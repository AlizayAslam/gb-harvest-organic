
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext.js';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch products and user cart
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        console.log('API response (products):', productRes.data);
        if (!Array.isArray(productRes.data.products)) {
          throw new Error('Invalid data format: Expected an array of products');
        }
        setProducts(productRes.data.products);

        // Fetch cart for authenticated users
        if (user && user.role === 'user') {
          const token = localStorage.getItem('token');
          const cartRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('API response (cart):', cartRes.data);
          setCart(cartRes.data.items || []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch data error:', err.response || err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        setLoading(false);
        toast.error(err.response?.data?.message || err.message || 'Failed to fetch data');
      }
    };
    fetchData();
  }, [user]);

  const addToCart = async (product) => {
    if (!user || user.role === 'admin' || user.role === 'headAdmin') {
      toast.error('Only regular users can add products to the cart');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Add to cart response:', res.data);
      setCart(res.data.items);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error('Add to cart error:', err.response || err);
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      {products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              {product.image ? (
                <img
                  src={product.image.startsWith('http') ? product.image : `${process.env.REACT_APP_API_URL}/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                  onError={(e) => console.log(`Image failed to load: ${e.target.src}`)}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>{product.description}</p>
              <p className="font-bold">${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
              {user && user.role === 'user' && (
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {user && user.role === 'user' && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-xl font-bold">Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between mt-2">
                  <span>{item.productName} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <p className="mt-2 font-bold">
                Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductList;