import { render, screen } from '@testing-library/react';
import App from './App';

it('renders hello message', () => {
  render(<App />);
  expect(screen.getByText(/Hello, Task Manager!/i)).toBeInTheDocument();
});


