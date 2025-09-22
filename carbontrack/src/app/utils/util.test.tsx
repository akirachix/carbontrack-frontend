import { mapFactories, calculateAlerts, calculateEmissionTrend, calculateEnergySummary, calculateTotalEmissions, filterByDate}  from '../utils/util';

describe('Utility Functions', () => {
  describe('mapFactories', () => {
    it('maps factory_id to factory_name correctly', () => {
      const factories = [
        { factory_id: 1, factory_name: 'Maramba' },
        { factory_id: 2, factory_name: 'Boito'},
      ];
      expect(mapFactories(factories)).toEqual({
        1: 'Maramba',
        2: 'Boito',
      });
    });
  });
  describe('calculateAlerts', () => {
    it('detects factories exceeding compliance target', () => {
      const compliance = [{ factory: 1, compliance_target: '0.1' }]; 
      const energy = [
        { factory: 1, co2_equivalent: '3', tea_processed_amount: '10' },
        { factory: 1, co2_equivalent: '1', tea_processed_amount: '10' },
      ];
      const emissions = [{ factory: 1, emission_rate: '3' }]; 
      const factoryMap = { 1: 'Alpha' };

      const alerts = calculateAlerts(compliance, energy, emissions, factoryMap);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].factoryId).toBe(1);
      expect(alerts[0].factoryName).toBe('Alpha');
      expect(alerts[0].emissionPerKg).toBeCloseTo((3 + 1 + 3) / 20);
    });

    it('ignores factories with zero tea processed', () => {
      const compliance = [{ factory: 1, compliance_target: '0.1' }];
      const energy = [{ factory: 1, co2_equivalent: '3', tea_processed_amount: '0' }];
      const emissions = [{ factory: 1, emission_rate: '3' }];
      const factoryMap = { 1: 'Alpha' };

      const alerts = calculateAlerts(compliance, energy, emissions, factoryMap);
      expect(alerts).toEqual([]);
    });
  });

  describe('calculateEmissionTrend', () => {
    it('returns emissions grouped by month with zeros for missing months', () => {
      const data = [
        { updated_at: '2025-01-15T00:00:00Z', emission_rate: '5' },
        { updated_at: '2025-03-15T00:00:00Z', emission_rate: '10' },
      ];
      const trend = calculateEmissionTrend(data);
      expect(trend.find((t) => t.month === 'Jan')?.rate).toBe(5);
      expect(trend.find((t) => t.month === 'Feb')?.rate).toBe(0);
      expect(trend.find((t) => t.month === 'Mar')?.rate).toBe(10);
    });
  });

  describe('calculateEnergySummary', () => {
    it('correctly sums different energy types and total', () => {
      const energyData = [
        { energy_type: 'firewood', energy_amount: '10 kg' },
        { energy_type: 'electricity', energy_amount: 20 },
        { energy_type: 'diesel', energy_amount: '5 liters' },
        { energy_type: 'unknown', energy_amount: '3' },
      ];
      const summary = calculateEnergySummary(energyData);
      expect(summary.firewood).toBe(10);
      expect(summary.electricity).toBe(20);
      expect(summary.diesel).toBe(5);
      expect(summary.total).toBe(38);
    });
  });

  describe('calculateTotalEmissions', () => {
    it('correctly sums total emission rates and CO2 equivalents', () => {
      const emissions = [{ emission_rate: '7' }, { emission_rate: '3' }];
      const energy = [{ co2_equivalent: '4' }, { co2_equivalent: '1' }];
      expect(calculateTotalEmissions(emissions, energy)).toBe(15);
    });
  });

  describe('filterByDate', () => {
    const dataset = [
      { created_at: '2025-09-19T05:00:00Z' },
      { updated_at: '2025-09-18T05:00:00Z' },
      { created_at: '2025-09-19T15:00:00Z' },
      { created_at: undefined },
    ];

    it('filters by exact date string', () => {
      const result = filterByDate(dataset, '2025-09-19');
      expect(result).toHaveLength(2);
    });

    it('returns all data if date filter is empty', () => {
      const result = filterByDate(dataset, '');
      expect(result).toHaveLength(dataset.length);
    });
  });
});
