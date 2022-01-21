import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./demo/utils', () => ({
    getData: () => 'mocked message'
}));

describe('App', () => {
  test('renders header', () => {
    render(<App />);
    expect(screen.getByText(/My app/i)).toBeInTheDocument()
  });

  test('renders correct welcome message', () => {
    render(<App />)
    expect(screen.getByText(/mocked message/i)).toBeInTheDocument()
  });
})