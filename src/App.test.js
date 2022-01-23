import { render, screen } from '@testing-library/react';

import App from './App';
import * as utils from "./demo/utils";

import { getDataSimple, getDataError} from "./demo/utils.mock"

beforeEach(() => {
  jest.spyOn(utils, "getData").mockImplementation(getDataSimple);
})

describe('App', () => {
  test('renders header', () => {
    render(<App />);
    expect(screen.getByText(/My app/i)).toBeInTheDocument()
  });

  test('mock default', async () => {
    render(<App />)
    await screen.findByText(/Mocked John!/i);
  });

  test('custom mock', async () => {
    jest.spyOn(utils, "getData").mockImplementation(async () => 'different data');

    render(<App />);
    await screen.findByText(/different data/i);
  });

  test('mock default again', async () => {
    render(<App />)
    await screen.findByText(/Mocked John!/i);
  });

  test('mock throws an error', async () => {
    jest.spyOn(utils, "getData").mockImplementation(getDataError);

    render(<App />)

    await screen.findByText(/Error: error in getData/i);
  });
})