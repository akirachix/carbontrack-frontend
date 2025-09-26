'use client';
import { useState, useEffect } from 'react';
import { fetchEmissions } from '../utils/fetchEmissions';
import { fetchFactories } from '../utils/fetchFactories';
import { fetchMcus } from '../utils/fetchMcu';
import { fetchEnergy } from '../utils/fetchEnergyEntries';
import { processEmissionData, FactoryEmission } from '../utils/fetchEmissionData';

import type {
  EmissionData,
  FactoryData,
  McuData,
  EnergyEntryData,
} from '../types';

export function useEmissionsData() {
  const [factoryEmissions, setFactoryEmissions] = useState<FactoryEmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [selectedDate, setSelectedDate] = useState('');
  const [noDataForDate, setNoDataForDate] = useState(false);
  const [emissions, setEmissions] = useState<EmissionData[]>([]);
  const [energyEntries, setEnergyEntries] = useState<EnergyEntryData[]>([]);
  const [factories, setFactories] = useState<FactoryData[]>([]);
  const [mcus, setMcus] = useState<McuData[]>([]);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError(null);
      try {
        const [emissionsData, factoriesData, mcusData, energyEntriesData] = await Promise.all([
          fetchEmissions(),
          fetchFactories(),
          fetchMcus(),
          fetchEnergy(),
        ]);
        
        setEmissions(emissionsData);
        setEnergyEntries(energyEntriesData);
        setFactories(factoriesData);
        setMcus(mcusData);
      } catch(error) {
        setError((error as Error).message); 
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    if (emissions.length === 0 || energyEntries.length === 0 || factories.length === 0 || mcus.length === 0) return;

    let filteredEmissions = emissions;
    let filteredEnergyEntries = energyEntries;

    if (selectedDate) {
      filteredEmissions = emissions.filter(
        (item) => item.created_at && item.created_at.startsWith(selectedDate)
      );
      filteredEnergyEntries = energyEntries.filter(
        (item) => item.created_at && item.created_at.startsWith(selectedDate)
      );
      
      if (filteredEmissions.length === 0 && filteredEnergyEntries.length === 0) {
        setNoDataForDate(true);
        setFactoryEmissions([]);
        return;
      }
    }
    
    setNoDataForDate(false);
    const processedData = processEmissionData(
      filteredEmissions,
      factories,
      mcus,
      filteredEnergyEntries
    );
    setFactoryEmissions(processedData);
  }, [selectedDate, emissions, energyEntries, factories, mcus]);

  return {
    factoryEmissions,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    noDataForDate,
  };
}