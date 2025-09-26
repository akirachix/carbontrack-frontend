import { renderHook, act } from '@testing-library/react';
import useFetchUsers from '../hooks/useFetchProfile';
import { useRouter } from 'next/navigation';


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useFetchUsers', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  
  test('fetches user data successfully', async () => {
    const mockUser = {
      email: 'mercy.jude@example.com',
      first_name: 'Mercy',
      last_name: 'Jude',
      profile_image: 'profile.jpg',
      user_type: 'manager',
      phone_number: '9876543210',
    };

    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    );

    const { result } = renderHook(() => useFetchUsers());
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);

    
    await act(async () => {
      
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(null);
    expect(result.current.error).toBe("No token found in localStorage.");
  });


  test('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useFetchUsers());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe('No token found in localStorage.');
  });
});