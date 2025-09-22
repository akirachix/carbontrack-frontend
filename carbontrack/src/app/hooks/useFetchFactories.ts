"use client";
import { useEffect, useState } from "react";
import { fetchFactories } from "../utils/fetchFactories";

interface Factory {
  factory_id: string;
  factory_name: string;
}

export function useFetchFactories() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loadingFactories, setLoadingFactories] = useState(false);
  const [factoryError, setFactoryError] = useState<string | null>(null);

  useEffect(() => {
    const loadFactories = async () => {
      setLoadingFactories(true);
      setFactoryError(null);
      try {
        const data = await fetchFactories();
        setFactories(data);
      } catch (error) {
        
          setFactoryError((error as Error).message);
        
      } finally {
        setLoadingFactories(false);
      }
    };
      loadFactories();
  }, []);

  return { factories, loadingFactories, factoryError };
}