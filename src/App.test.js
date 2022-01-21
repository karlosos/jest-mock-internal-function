import { render, screen } from '@testing-library/react';

import App from './App';
import * as utils from "./demo/utils";

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(utils, "getData").mockReturnValue("mocked message");
  })

  test('renders header', () => {
    render(<App />);
    expect(screen.getByText(/My app/i)).toBeInTheDocument()
  });

  test('renders correct welcome message', () => {
    render(<App />)
    expect(screen.getByText(/mocked message/i)).toBeInTheDocument()
  });
})