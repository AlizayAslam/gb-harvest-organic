import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function EditProduct({ token, role, setProducts }) {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: '',
  });
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
      } catch (error) {
        toast.error('Failed to load product');
      }
    };
    if (role === 'admin') fetchProduct();
    else {
      toast.error('Only admins can edit products!');
      history.push('/products');
    }
  }, [id, token, role, history]);

  const handleUpdate = async (e) => {
    e.preventDefault();
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
      history.push('/products');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update product');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>
      <form onSubmit={handleUpdate} className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="w-full p-2 border rounded"
          required
          min="0"
        />
        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
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
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          className="w-full p-2 border rounded"
          required
          min="0"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={product.image}
          onChange={(e) => setProduct({ ...product, image: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Update Product
        </button>
      </form>
    </div>
  );
}

EditProduct.propTypes = {
  token: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  setProducts: PropTypes.func.isRequired,
};

export default EditProduct;