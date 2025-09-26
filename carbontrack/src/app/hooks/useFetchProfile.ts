'use client';
import { useState, useEffect } from "react";
import { fetchProfile } from "../utils/fetchProfile";
export type User = {
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  profile_image: string;
  user_type: string;
  phone_number:string;
  password: string;
};
const useFetchUsers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() =>{
        (async() =>{
            try{
                const users = await fetchProfile();
                setUser(users);
            }catch(error){
                setError((error as Error).message);
            }finally{
                setLoading(false);
            }
        })()
    },[]);
    return {user, loading, error,}
};
export default useFetchUsers;