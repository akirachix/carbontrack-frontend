import {
  mapFactories,
  calculateAlerts,
  calculateEmissionTrend,
  calculateEnergySummary,
  calculateTotalEmissions,
  filterByDate,
} from "../utils/util";

import { ComplianceType, FactoryData, EnergyEntryData, EmissionData } from "../types";

describe("utils functions", () => {
  const factories: FactoryData[] = [
    {
      factory_id: 1,
      factory_name: "Factory A",
      factory_location: "Test Location 1",
      created_at: "2025-09-01T00:00:00Z",
    },
    {
      factory_id: 2,
      factory_name: "Factory B",
      factory_location: "Test Location 2",
      created_at: "2025-09-02T00:00:00Z",
    },
  ];

  const factoryMap = mapFactories(factories);

  const complianceData: ComplianceType[] = [
    {
      factory: 1,
      compliance_target: "0.01", // Lower target to trigger alert
      compliance_status: "active",
      created_at: "2025-09-01T00:00:00Z",
      updated_at: "2025-09-10T00:00:00Z",
    },
    {
      factory: 2,
      compliance_target: "100", // Very high to avoid alert
      compliance_status: "inactive",
      created_at: "2025-09-03T00:00:00Z",
      updated_at: "2025-09-11T00:00:00Z",
    },
  ];

  const energyData: EnergyEntryData[] = [
    {
      data_id: 1,
      factory: 1,
      co2_equivalent: "1",
      tea_processed_amount: "10",
      energy_amount: "5",
      energy_type: "Firewood",
      created_at: "2025-09-01T00:00:00Z",
      updated_at: "2025-09-01T00:00:00Z",
    },
    {
      data_id: 2,
      factory: 1,
      co2_equivalent: "2",
      tea_processed_amount: "20",
      energy_amount: "7",
      energy_type: "Diesel", // Included exact casing and positive value
      created_at: "2025-09-02T00:00:00Z",
      updated_at: "2025-09-02T00:00:00Z",
    },
    {
      data_id: 3,
      factory: 2,
      co2_equivalent: "3",
      tea_processed_amount: "15",
      energy_amount: "10",
      energy_type: "Electricity",
      created_at: "2025-09-03T00:00:00Z",
      updated_at: "2025-09-03T00:00:00Z",
    },
  ];

  const emissionData: EmissionData[] = [
    {
      emissions_id: 1,
      mcu_device_id: "device1",
      mcu: "mcu1",
      emission_rate: "10", // Increased to ensure alert
      created_at: "2025-09-01T00:00:00Z",
      updated_at: "2025-09-25T12:00:00Z",
    },
    {
      emissions_id: 2,
      mcu_device_id: "device2",
      mcu: "mcu2",
      emission_rate: "0.4",
      created_at: "2025-09-02T00:00:00Z",
      updated_at: "2025-09-25T12:00:00Z",
    },
  ];

  const mcuFactoryMap: Record<string, number> = {
    mcu1: 1,
    mcu2: 2,
  };

  describe("mapFactories", () => {
    it("returns a map of factory_id to factory_name", () => {
      expect(mapFactories(factories)).toEqual({
        1: "Factory A",
        2: "Factory B",
      });
    });
  });

  describe("calculateAlerts", () => {
    it("returns alerts for factories exceeding compliance targets", () => {
      const alerts = calculateAlerts(
        complianceData,
        energyData,
        emissionData,
        factoryMap,
        mcuFactoryMap
      );
      expect(alerts.length).toBeGreaterThan(0);
      alerts.forEach((alert) => {
        expect(alert.emissionPerKg).toBeGreaterThan(alert.complianceTarget);
        expect(alert.factoryName).toBeDefined();
      });
    });

    it("returns empty array if no factory exceeds target", () => {
      const lowCompliance = complianceData.map((c) => ({
        ...c,
        compliance_target: "100",
      }));
      const alerts = calculateAlerts(
        lowCompliance,
        energyData,
        emissionData,
        factoryMap,
        mcuFactoryMap
      );
      expect(alerts).toEqual([]);
    });

    it("returns null and filtered out if teaProcessedSum is 0", () => {
      const energyEmptyTea = [{ ...energyData[0], tea_processed_amount: "0" }];
      const alerts = calculateAlerts(
        complianceData,
        energyEmptyTea,
        emissionData,
        factoryMap,
        mcuFactoryMap
      );
      expect(alerts.every((a) => a !== null)).toBe(true);
    });
  });

  describe("calculateEmissionTrend", () => {
    it("maps emissions rates per month correctly", () => {
      const trend = calculateEmissionTrend(emissionData);
      expect(trend).toHaveLength(12);
      const sept = trend.find((t) => t.month === "Sep");
      expect(sept?.rate).toBeCloseTo(0.4, 1);
      trend.forEach((t) => {
        expect(typeof t.month).toBe("string");
        expect(typeof t.rate).toBe("number");
      });
    });

    it("returns zeros for months with no data", () => {
      const emptyTrend = calculateEmissionTrend([]);
      expect(emptyTrend.every((t) => t.rate === 0)).toBe(true);
    });
  });

  describe("calculateEnergySummary", () => {
    it("correctly sums energy amounts by type", () => {
      const summary = calculateEnergySummary(energyData);
      expect(summary.firewood).toBeCloseTo(5);
      expect(summary.electricity).toBeCloseTo(10);
      expect(summary.diesel).toBeCloseTo(7);
      expect(summary.total).toBeCloseTo(5 + 10 + 7);
    });
  });

  describe("calculateTotalEmissions", () => {
    it("returns sum of emission rates and co2 equivalents", () => {
      const total = calculateTotalEmissions(emissionData, energyData);
      const expected =
        emissionData.reduce(
          (acc, v) => acc + parseFloat(v.emission_rate || "0"),
          0
        ) +
        energyData.reduce((acc, v) => acc + parseFloat(v.co2_equivalent || "0"), 0);
      expect(total).toBeCloseTo(expected);
    });
  });

  describe("filterByDate", () => {
    const dataWithDates = [
      { created_at: "2025-09-25T10:00:00Z" },
      { created_at: "2025-09-24T10:00:00Z" },
      { updated_at: "2025-09-25T10:00:00Z" },
    ];

    it("filters entries by exact selectedDate", () => {
      const filtered = filterByDate(dataWithDates, "2025-09-25");
      expect(filtered.length).toBe(2);
    });

    it("returns all data if selectedDate is empty string", () => {
      const filtered = filterByDate(dataWithDates, "");
      expect(filtered.length).toBe(dataWithDates.length);
    });

  });
});
