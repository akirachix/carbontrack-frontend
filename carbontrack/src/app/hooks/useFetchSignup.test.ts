import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetchSignup } from './useFetchSignup';
import {fetchSignup} from '../utils/fetchSignup';

jest.mock('../utils/fetchSignup');

describe('useFetchSignup hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful signup', async () => {
    const mockUserData = { user: { id: 1, first_name: 'Emebet' } };
    (fetchSignup as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useFetchSignup());

    let userData;
    await act(async () => {
      userData = await result.current.signup({
        first_name: 'Emebet',
        last_name: 'Girmay',
        email: 'girmaayemebet@gmail.com',
        phone_number: '+251939235242',
        password: 'girmaayemebet',
        user_type: 'manager',
      });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(userData).toEqual(mockUserData);
    expect(result.current.error).toBeNull();
  });

  it('handles signup failure', async () => {
    (fetchSignup as jest.Mock).mockRejectedValue(new Error('Signup failed'));

    const { result } = renderHook(() => useFetchSignup());

    let userData;
    await act(async () => {
      userData = await result.current.signup({
        first_name: 'Emebet',
        last_name: 'Girmay',
        email: 'girmaayemebet@gmail.com',
        phone_number: '+251939235242',
        password: 'girmaayemebet',
        user_type: 'manager',
      });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(userData).toBeNull();
    expect(result.current.error).toBe('Signup failed');
  });
});
