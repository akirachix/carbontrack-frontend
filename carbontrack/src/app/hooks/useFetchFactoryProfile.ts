import { useState, useEffect } from "react";
import { fetchUser, fetchFactory, updateUser } from "../utils/fetchFactoryProfile";

export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  factory?: number;
  user_type: string;
  password: string;
}

export interface FactoryType {
  id: number;
  factory_name: string;
  factory_location: string;
}

const useFactoryProfile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [factory, setFactory] = useState<FactoryType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", "2"); // default user id example
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("No userId in localStorage");
        const userData = await fetchUser(userId);
        setUser(userData);

        if (!userData.factory) throw new Error("User has no linked factory");
        const factoryData = await fetchFactory(userData.factory);
        setFactory(factoryData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveUser = async (updatedData: Partial<UserType>) => {
    if (!user) throw new Error("No user loaded to update");
    try {
      const updatedUser = await updateUser(user.id.toString(), updatedData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  return { user, factory, loading, error, saveUser };
};

export default useFactoryProfile;
