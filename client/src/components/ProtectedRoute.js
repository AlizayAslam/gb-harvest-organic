import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProtectedRoute({ component: Component, setProducts, ...rest }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Route
      {...rest}
      render={(props) =>
        token && role === 'admin' ? (
          <Component {...props} token={token} role={role} setProducts={setProducts} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
}

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  setProducts: PropTypes.func.isRequired,
};

export default ProtectedRoute;