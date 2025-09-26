import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditProfilePage from './page';
import { useRouter } from 'next/navigation';
import useFetchUsers from '../hooks/useFetchProfile';
import { updateUser } from '../utils/fetchProfile';


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../hooks/useFetchProfile');
jest.mock('../utils/fetchProfile');
jest.mock('../sharedComponents/Button', () => ({
  __esModule: true,
  default: ({ variant, type, buttonText, onClick }: { variant: string; type: 'button' | 'submit' | 'reset' | undefined; buttonText: string; onClick: () => void; }) => (
    <button type={type} onClick={onClick} data-variant={variant}>
      {buttonText}
    </button>
  ),
}));

jest.mock('../components/FactoryLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));


global.URL.createObjectURL = jest.fn(() => 'mocked-url');


jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'> & { priority?: boolean; fill?: boolean }) => {
   
    const { priority, fill, ...rest } = props;
    return <img {...rest} />;
  },
}));


jest.mock('lucide-react', () => ({
  CameraIcon: () => <div data-testid="camera-icon">CameraIcon</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
}));


beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('EditProfilePage', () => {
  const mockPush = jest.fn();
  const mockProfile = {
    email: 'mercy.jude@example.com',
    first_name: 'Mercy',
    last_name: 'Jude',
    profile_image: 'profile.jpg',
    user_type: 'manager',
    phone_number: '9876543210',
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useFetchUsers as jest.Mock).mockReturnValue({ user: null, error: null });
    (updateUser as jest.Mock).mockResolvedValue({});
    jest.clearAllMocks();
  });

  test('renders loading state when profile is null', () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: null, error: null });
    render(<EditProfilePage />);
    expect(screen.queryByText('Edit Profile')).toBeNull();
  });

  test('renders error message when there is an error', () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: null, error: 'Failed to load profile' });
    render(<EditProfilePage />);
    expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
  });

  test('renders profile form when data is loaded', () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    render(<EditProfilePage />);
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mercy')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jude')).toBeInTheDocument();
    expect(screen.getByDisplayValue('mercy.jude@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('9876543210')).toBeInTheDocument();
    expect(screen.getByDisplayValue('manager')).toBeInTheDocument();
  });

  test('updates form fields on change', () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    render(<EditProfilePage />);
    
    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { name: 'first_name', value: 'Mercy' } });
    expect(firstNameInput).toHaveValue('Mercy');
    
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lastNameInput, { target: { name: 'last_name', value: 'Jude' } });
    expect(lastNameInput).toHaveValue('Jude');
  });

  test('submits form successfully and redirects', async () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    render(<EditProfilePage />);
    
    fireEvent.click(screen.getByText('Update Profile'));
    
    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({
        email: 'mercy.jude@example.com',
        first_name: 'Mercy',
        last_name: 'Jude',
        role: 'manager',
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    }, { timeout: 3000 });
  });

  test('submits form with password when provided', async () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    render(<EditProfilePage />);
    
   
    const passwordInput = screen.getByPlaceholderText('Enter new password');
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'newpassword123' } });
    
    fireEvent.click(screen.getByText('Update Profile'));
    
    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({
        email: 'mercy.jude@example.com',
        first_name: 'Mercy',
        last_name: 'Jude',
        password: 'newpassword123',
        role: 'manager',
      });
    });
  });

  

  test('handles update error', async () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    (updateUser as jest.Mock).mockRejectedValue(new Error('Update failed'));
    
    render(<EditProfilePage />);
    
    fireEvent.click(screen.getByText('Update Profile'));
    
    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    render(<EditProfilePage />);
    
    const passwordInput = screen.getByPlaceholderText('Enter new password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByLabelText('Show password');
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  test('navigates back to profile on cancel', () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    render(<EditProfilePage />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });

  test('displays user name and role when available', () => {
    (useFetchUsers as jest.Mock).mockReturnValue({ user: mockProfile, error: null });
    render(<EditProfilePage />);
    
    expect(screen.getByText('Mercy Jude')).toBeInTheDocument();
    expect(screen.getByText('manager')).toBeInTheDocument();
  });
});