import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { useLogin } from '../hooks/useFetchLogin';
import { useRouter } from 'next/navigation';

jest.mock('../hooks/useFetchLogin');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    h1: (props: any) => <h1 {...props} />,
    p: (props: any) => <p {...props} />,
  },
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders email, password inputs and sign in button', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/eg, mark@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/eg, 0@HGY4/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls login and redirects on success for factory users', async () => {
    mockLogin.mockResolvedValueOnce({ user_type: 'factory' });
    render(<LoginPage />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/eg, mark@gmail.com/i), 'girmaayemebet@gmail.com');
    await user.type(screen.getByPlaceholderText(/eg, 0@HGY4/i), 'girmaayemebet');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('girmaayemebet@gmail.com', 'girmaayemebet'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/factory-dashboard'));
  });

  it('calls login and redirects to ktda-dashboard for ktda users', async () => {
    mockLogin.mockResolvedValueOnce({ user_type: 'ktda' });
    render(<LoginPage />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/eg, mark@gmail.com/i), 'girmaayemebet@gmail.com');
    await user.type(screen.getByPlaceholderText(/eg, 0@HGY4/i), 'girmaayemebet');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('girmaayemebet@gmail.com', 'girmaayemebet'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/ktda-dashboard'));
  });

  it('displays error message on login failure', () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: 'Invalid credentials',
    });

    render(<LoginPage />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
