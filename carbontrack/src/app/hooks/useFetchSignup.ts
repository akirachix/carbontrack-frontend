import { useState } from 'react';
import { fetchSignup } from '../utils/fetchSignup';

export const useFetchSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    user_type: "factory" | "manager";
    factory?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await fetchSignup(payload);
      setLoading(false);
      return userData;
    } catch (error) {
  
      setError((error as Error).message);
      setLoading(false);
      return null;
    }
  };
  return { signup, loading, error };
};