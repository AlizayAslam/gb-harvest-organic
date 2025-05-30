import { Link, useHistory } from 'react-router-dom';

function Navbar() {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    history.push('/'); // Redirect to landing page after logout
  };

  return (
    <nav className="bg-green-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-xl font-bold">GB Harvest Organic</Link>
        </div>
        <div className="flex gap-4 items-center">
          {token && <Link to="/products" className="hover:underline">Products</Link>}
          {token && role === 'admin' && (
            <Link to="/add-product" className="hover:underline">Add Product</Link>
          )}
          {token ? (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          ) : (
            <Link to="/" className="hover:underline">Login / Sign Up</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;