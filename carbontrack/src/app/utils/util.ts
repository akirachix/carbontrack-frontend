import {
  EmissionData,
  FactoryData,
  EnergyEntryData,
  ComplianceType,
  McuData
} from '../types';
type EmissionWithFactory = EmissionData & {
  factory: number;
};
export function mapFactories(factories: FactoryData[]) {
  return factories.reduce((acc, factory) => {
    acc[factory.factory_id] = factory.factory_name;
    return acc;
  }, {} as Record<number, string>);
}
export function calculateAlerts(
  filteredCompliance: ComplianceType[],
  filteredEnergy: EnergyEntryData[],
  filteredEmissions: EmissionWithFactory[],
  factoryMap: Record<number, string>
) {
  return filteredCompliance
    .map((compliance) => {
      const factoryId = compliance.factory;
      const complianceTarget = parseFloat(compliance.compliance_target);
      const factoryEnergy = filteredEnergy.filter((energy) => energy.factory === factoryId);
      const co2EquivalentSum = factoryEnergy.reduce((sum, value) => sum + parseFloat(value.co2_equivalent || "0"), 0);
      const teaProcessedSum = factoryEnergy.reduce((sum, value) => sum + parseFloat(value.tea_processed_amount || "0"), 0);
      if (teaProcessedSum === 0) return null;
      const factoryEmissions = filteredEmissions.filter((emission) => emission.factory === factoryId);
      const directEmissionsSum = factoryEmissions.reduce((sum, emission) => sum + parseFloat(emission.emission_rate || "0"), 0);
      const totalEmissions = co2EquivalentSum + directEmissionsSum;
      const emissionPerKg = totalEmissions / teaProcessedSum;
      if (emissionPerKg > complianceTarget) {
        return {
          factoryId,
          factoryName: factoryMap[factoryId] || "Unknown Factory",
          emissionPerKg,
          complianceTarget,
          totalEmissions,
          teaProcessedKg: teaProcessedSum,
        };
      }
      return null;
    })
    .filter((element): element is NonNullable<typeof element> => element !== null);
}
export function calculateEmissionTrend(filteredEmissions: EmissionData[]) {
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const emissionRateByMonth: Record<string, number> = {};
  filteredEmissions.forEach((item) => {
    const date = new Date(item.updated_at);
    const month = date.toLocaleString("default", { month: "short" });
    emissionRateByMonth[month] = parseFloat(item.emission_rate || "0");
  });
  return allMonths.map((month) => ({ month, rate: emissionRateByMonth[month] || 0 }));
}
export function calculateEnergySummary(filteredEnergy: EnergyEntryData[]) {
  return filteredEnergy.reduce(
    (acc, item) => {
      const amount = parseFloat(typeof item.energy_amount === "string" ? item.energy_amount.split(" ")[0] : item.energy_amount || "0");
      if (item.energy_type?.toLowerCase() === "firewood") acc.firewood += amount;
      else if (item.energy_type?.toLowerCase() === "electricity") acc.electricity += amount;
      else if (item.energy_type?.toLowerCase() === "diesel") acc.diesel += amount;
      acc.total += amount;
      return acc;
    },
    { firewood: 0, electricity: 0, diesel: 0, total: 0 }
  );
}
export function calculateTotalEmissions(
  filteredEmissions: EmissionWithFactory[],
  filteredEnergy: EnergyEntryData[]
) {
  const totalEmissionRate = filteredEmissions.reduce((acc, item) => acc + parseFloat(item.emission_rate || "0"), 0);
  const totalEnergyCO2Equivalent = filteredEnergy.reduce((acc, item) => acc + parseFloat(item.co2_equivalent || "0"), 0);
  return totalEmissionRate + totalEnergyCO2Equivalent;
}
export function filterByDate<Type extends { created_at?: string; updated_at?: string }>(
  data: Type[],
  selectedDate: string
): Type[] {
  if (!selectedDate) return data;
  return data.filter((item) => {
    const dateStr = item.created_at || item.updated_at;
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const itemDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return itemDate === selectedDate;
  });
}
export function addFactoryToEmissions(
  emissions: EmissionData[],
  mcuData: McuData[]
): EmissionWithFactory[] {
  const mcuMap: Record<string, number> = {};
  mcuData.forEach(mcu => {
    mcuMap[mcu.mcu_id] = mcu.factory;
  });
  return emissions.map(emission => ({
    ...emission,
    factory: mcuMap[emission.mcu] || 0
  }));
}
