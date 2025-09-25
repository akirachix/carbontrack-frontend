import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin } from './useFetchLogin';
import {fetchLogin} from '../utils/fetchLogin';

jest.mock('../utils/fetchLogin');

describe('useLogin hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('logs in successfully and stores tokens', async () => {
    const mockUser = { user_type: 'ktda' };
    (fetchLogin as jest.Mock).mockResolvedValue({ access: 'fake-token', user: mockUser });

    const { result } = renderHook(() => useLogin());

    let user;
    await act(async () => {
      user = await result.current.login('girmaayemebet@gmail.com', 'girmaayemebet');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(user).toEqual(mockUser);
    expect(localStorage.getItem('accessToken')).toBe('fake-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(result.current.error).toBeNull();
  });

  it('sets error state on login failure', async () => {
    (fetchLogin as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useLogin());

    let user;
    await act(async () => {
      user = await result.current.login('girmaayemebet@gmail.com', 'wronggirmaayemebet');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(user).toBeNull();
    expect(result.current.error).toBe('Invalid credentials');
  });
});
