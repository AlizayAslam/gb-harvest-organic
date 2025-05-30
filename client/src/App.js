import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/Landing';
import Auth from './components/Auth';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useState } from 'react';

function App() {
  const [products, setProducts] = useState([]); // Centralized product state

  return (
    <Router>
      <div className="App">
        <Navbar />
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route
            path="/products"
            render={(props) => <ProductList {...props} products={products} setProducts={setProducts} />}
          />
          <ProtectedRoute
            path="/add-product"
            component={(props) => <AddProduct {...props} setProducts={setProducts} />}
          />
          <ProtectedRoute
            path="/edit-product/:id"
            component={(props) => <EditProduct {...props} setProducts={setProducts} />}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;