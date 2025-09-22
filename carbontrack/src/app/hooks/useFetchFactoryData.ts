import { useState, useEffect } from "react";
import { fetchEmissions } from '../utils/fetchEmissions';
import { fetchFactories } from '../utils/fetchFactories';
import { fetchMcus } from '../utils/fetchMcu';
import { fetchEnergy } from '../utils/fetchEnergyEntries';

import {
  EmissionData,
  FactoryData,
  McuData,
  EnergyEntryData,
  FactoryEmission,
} from "../types";

function processEmissionData(
  emissions: EmissionData[],
  factories: FactoryData[],
  mcus: McuData[],
  energyEntries: EnergyEntryData[],
  filterDate?: string
): FactoryEmission[] {
  
  const filteredEmissions = filterDate
    ? emissions.filter(
        (item) =>
          typeof item.created_at === "string" &&
          item.created_at.startsWith(filterDate)
      )
    : emissions;

  const mcuByFactory = new Map<number, McuData>();
  mcus.forEach((mcu) => mcuByFactory.set(mcu.factory, mcu));

  const emissionByMcuId = new Map<string, EmissionData>();
  filteredEmissions.forEach((emission) => {
    if (emission.mcu) emissionByMcuId.set(emission.mcu, emission);
    if (emission.mcu_device_id)
      emissionByMcuId.set(emission.mcu_device_id, emission);
  });

  const energyByFactory = new Map<number, number>();
  energyEntries.forEach((entry) => {
    const current = energyByFactory.get(entry.factory) || 0;
    energyByFactory.set(entry.factory, current + parseFloat(entry.co2_equivalent));
  });

  return factories
    .map((factory) => {
      let totalEmission = 0;

      const mcu = mcuByFactory.get(factory.factory_id);
      if (mcu) {
        const emission = emissionByMcuId.get(mcu.mcu_id);
        if (emission) totalEmission += parseFloat(emission.emission_rate);
      }

      totalEmission += energyByFactory.get(factory.factory_id) || 0;

      const changePercent = Math.floor(Math.random() * 40) - 20;

      return {
        factoryId: factory.factory_id,
        factoryName: factory.factory_name,
        totalEmission,
        changePercent,
        
      };
    })
    .sort((a, b) => b.totalEmission - a.totalEmission);
}

export default function useFactoryEmissions(selectedDate?: string) {
  const [factoryEmissions, setFactoryEmissions] = useState<FactoryEmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [emissions, factories, mcus, energyEntries] = await Promise.all([
          fetchEmissions(),
          fetchFactories(),
          fetchMcus(),
          fetchEnergy(),
        ]);

        const processed = processEmissionData(
          emissions,
          factories,
          mcus,
          energyEntries,
          selectedDate
        );
        setFactoryEmissions(processed);
      } catch(error) {
        setError((error as Error).message); 
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedDate]);

  return { factoryEmissions, loading, error };
}
