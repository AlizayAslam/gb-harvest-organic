import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from './components/ProductList';

test('renders product list heading', () => {
  render(
    <BrowserRouter>
      <ProductList products={[]} setProducts={() => {}} />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/GB Harvest Organic Products/i);
  expect(headingElement).toBeInTheDocument();
});