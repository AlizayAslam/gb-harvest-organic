import { useState, useEffect } from 'react';
       import axios from 'axios';
       import { toast } from 'react-toastify';
       import { Link } from 'react-router-dom';
       import PropTypes from 'prop-types';

       function ProductList({ role, token, products, setProducts }) {
         const [error, setError] = useState(null);
         const [search, setSearch] = useState('');
         const [page, setPage] = useState(1);
         const productsPerPage = 6;

         useEffect(() => {
           const fetchProducts = async () => {
             try {
               const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
               setProducts(res.data);
               if (res.data.length === 0) {
                 setError('No products available. Add some products to get started!');
               } else {
                 setError(null);
               }
             } catch (error) {
               setError('Failed to load products. Please try again.');
               toast.error('Failed to load products');
             }
           };
           fetchProducts();
         }, [setProducts]);

         const handleDelete = async (id) => {
           if (role !== 'admin') {
             toast.error('Only admins can delete products!');
             return;
           }
           try {
             await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
               headers: { Authorization: `Bearer ${token}` },
             });
             setProducts(products.filter((product) => product._id !== id));
             toast.success('Product deleted successfully!');
           } catch (error) {
             toast.error('Failed to delete product');
           }
         };

         const filteredProducts = products.filter((product) =>
           product.name.toLowerCase().includes(search.toLowerCase())
         );

         const paginatedProducts = filteredProducts.slice(
           (page - 1) * productsPerPage,
           page * productsPerPage
         );

         return (
           <div className="container mx-auto p-4">
             <h2 className="text-2xl font-bold mb-4 text-center">GB Harvest Organic Products</h2>
             {error && <p className="text-red-500 text-center">{error}</p>}
             <input
               type="text"
               placeholder="Search products..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="mb-4 p-2 border rounded w-full max-w-md mx-auto"
             />
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {paginatedProducts.length > 0 ? (
                 paginatedProducts.map((product) => (
                   <div
                     key={product._id}
                     className="product-card border rounded-lg p-4 shadow-md hover:shadow-lg"
                   >
                     {product.image && (
                       <img
                         src={product.image}
                         alt={product.name}
                         className="w-full h-40 object-cover rounded mb-2"
                       />
                     )}
                     <h3 className="text-lg font-semibold">{product.name}</h3>
                     <p>Category: {product.category}</p>
                     <p>Price: ${product.price}</p>
                     <p>{product.description || 'No description available'}</p>
                     <p>Stock: {product.stock}</p>
                     {role === 'admin' && (
                       <div className="flex gap-2 mt-2">
                         <Link
                           to={`/edit-product/${product._id}`}
                           className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                         >
                           Edit
                         </Link>
                         <button
                           onClick={() => handleDelete(product._id)}
                           className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                         >
                           Delete
                         </button>
                       </div>
                     )}
                   </div>
                 ))
               ) : (
                 !error && <p className="text-center">No products found.</p>
               )}
             </div>
             <div className="flex justify-center gap-4 mt-4">
               <button
                 onClick={() => setPage(page - 1)}
                 disabled={page === 1}
                 className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
               >
                 Previous
               </button>
               <span>Page {page}</span>
               <button
                 onClick={() => setPage(page + 1)}
                 disabled={page * productsPerPage >= filteredProducts.length}
                 className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
               >
                 Next
               </button>
             </div>
           </div>
         );
       }

       ProductList.propTypes = {
         role: PropTypes.string,
         token: PropTypes.string,
         products: PropTypes.array.isRequired,
         setProducts: PropTypes.func.isRequired,
       };

       export default ProductList;