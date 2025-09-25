import type {
  EmissionData,
  FactoryData,
  McuData,
  EnergyEntryData,
} from '../types';

export interface FactoryEmission {
  factoryId: number;
  factoryName: string;
  totalEmission: number;
}

export function processEmissionData(
  emissions: EmissionData[],
  factories: FactoryData[],
  mcus: McuData[],
  energyEntries: EnergyEntryData[]
): FactoryEmission[] {

  const energyTotals = energyEntries.reduce((acc: { factoryId: number; total: number }[], entry: EnergyEntryData) => {
    const factoryId = entry.factory;
    const existing = acc.find(item => item.factoryId === factoryId);
    
    if (existing) {
      existing.total += parseFloat(entry.co2_equivalent);
    } else {
      acc.push({
        factoryId,
        total: parseFloat(entry.co2_equivalent)
      });
    }
    return acc;
  }, [] as { factoryId: number; total: number }[]);

  return factories.map((factory: FactoryData) => {

    const mcu = mcus.find((m: McuData) => m.factory === factory.factory_id);

    let emissionRate = 0;
    if (mcu) {
      const emission = emissions.find((item: EmissionData) => 
        item.mcu === mcu.mcu_id || item.mcu_device_id === mcu.mcu_id
      );
      if (emission) {
        emissionRate = parseFloat(emission.emission_rate);
      }
    }

    const energyEntry = energyTotals.find((item: { factoryId: number; total: number }) => item.factoryId === factory.factory_id);
    const energyTotal = energyEntry ? energyEntry.total : 0;

    return {
      factoryId: factory.factory_id,
      factoryName: factory.factory_name,
      totalEmission: emissionRate + energyTotal
    };
  })
  .sort((a, b) => b.totalEmission - a.totalEmission);
}

export function blendColors(color1: string, color2: string, percent: number): string {
  percent = Math.min(1, Math.max(0, percent));
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  const r = Math.round(r1 + (r2 - r1) * percent);
  const g = Math.round(g1 + (g2 - g1) * percent);
  const b = Math.round(b1 + (b2 - b1) * percent);

  return `rgb(${r},${g},${b})`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const expandedHex = cleanHex.length === 3 
    ? cleanHex.split('').map(c => c + c).join('') 
    : cleanHex;
  
  const num = parseInt(expandedHex, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}