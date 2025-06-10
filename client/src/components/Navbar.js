import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="bg-green-600 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-green-200">
            GB Harvest Organic
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/products" className="hover:text-green-200">Products</Link>
          {(token && (role === 'admin' || role === 'headAdmin')) && (
            <Link to="/add-product" className="hover:text-green-200">Add Product</Link>
          )}
          {token ? (
            <button onClick={handleLogout} className="hover:text-green-200">Logout</button>
          ) : (
            <Link to="/auth" className="hover:text-green-200">Login / Sign Up</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;