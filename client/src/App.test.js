import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from './components/ProductList';

test('renders product list heading', () => {
  render(
    <BrowserRouter>
      <ProductList />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/Products/i);
  expect(headingElement).toBeInTheDocument();
});