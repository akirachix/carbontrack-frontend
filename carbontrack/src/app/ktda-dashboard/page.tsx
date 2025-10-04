"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchEnergy from "../hooks/useFetchEnergyEntries";
import useFetchEmissions from "../hooks/useFetchEmissions";
import useFetchFactories from "../hooks/useFetchFactories";
import { IoPersonOutline } from "react-icons/io5";
import SidebarLayout from "../components/SideBarLayout";
import AlertModal from "./component/HighEmissionAlerts";
import { IoMdWarning } from "react-icons/io";
import { Alert } from "../types";
import Calendar from "../sharedComponents/Calendar";
import { mapFactories, calculateAlerts, calculateEmissionTrend, calculateEnergySummary, calculateTotalEmissions } from "../utils/util";
import { ComplianceType, EmissionData, EnergyEntryData, FactoryData, McuData } from "../types";
const COLORS = ["#F79B72", "#2A4564", "#A5A5A5"];
import Link from "next/link";

interface HookComplianceData {
  compliance_target: string;
  compliance_status: string;
  created_at: string;
  updated_at: string | undefined;
  factory: number;
}
interface HookEmissionData {
  emissions_id: number;
  emission_rate: string;
  mcu: string;
  mcu_device_id: string;
  updated_at: string;
}
const VIEWED_FACTORIES_KEY = "viewedFactories";
const transformComplianceData = (compliance: HookComplianceData[]): ComplianceType[] => {
  return compliance.map(item => ({
    ...item,
    updated_at: item.updated_at || ""
  }));
};
const transformEmissionData = (emissions: HookEmissionData[]): EmissionData[] => {
  return emissions.map(item => ({
    ...item,
    created_at: item.updated_at
  }));
};
const addFactoryToEmissionsData = (emissions: EmissionData[], mcuData: McuData[]) => {
  const mcuMap: Record<string, number> = {};
  mcuData.forEach(mcu => {
    mcuMap[mcu.mcu_id] = mcu.factory;
  });
  return emissions.map(emission => ({
    ...emission,
    factory: mcuMap[emission.mcu] || 0
  }));
};

function filterByDateType<T extends { created_at?: string; updated_at?: string }>(
  data: T[],
  selectedDate: Date | null,
  filterType: "day" | "month" | "year"
): T[] {
  if (!selectedDate) return data;
  const selected = selectedDate;
  return data.filter(item => {
    const dateStr = item.created_at || item.updated_at;
    if (!dateStr) return false;
    const itemDate = new Date(dateStr);
    if (filterType === "day") {
      return (
        itemDate.getFullYear() === selected.getFullYear() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getDate() === selected.getDate()
      );
    } else if (filterType === "month") {
      return (
        itemDate.getFullYear() === selected.getFullYear() &&
        itemDate.getMonth() === selected.getMonth()
      );
    } else if (filterType === "year") {
      return itemDate.getFullYear() === selected.getFullYear();
    }
    return true;
  });
}

export default function DashboardPage() {
  const { energy, loading: energyLoading } = useFetchEnergy();
  const { emissions, loading: emissionLoading } = useFetchEmissions();
  const { compliance, loading: complianceLoading } = useFetchCompliance();
  const { factories, loading: factoryLoading } = useFetchFactories();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [viewedFactories, setViewedFactories] = useState<string[]>([]);
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(VIEWED_FACTORIES_KEY) : null;
    if (stored) {
      setViewedFactories(JSON.parse(stored));
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEWED_FACTORIES_KEY, JSON.stringify(viewedFactories));
    }
  }, [viewedFactories]);

  const complianceData = transformComplianceData(compliance as HookComplianceData[]);
  const emissionData = transformEmissionData(emissions as HookEmissionData[]);
  const filteredEnergy = filterByDateType(energy as EnergyEntryData[], selectedDate, filterType);
  const filteredEmissions = transformEmissionData(
    filterByDateType(emissions as HookEmissionData[], selectedDate, filterType)
  );
  const filteredCompliance = transformComplianceData(
    filterByDateType(compliance as HookComplianceData[], selectedDate, filterType)
  );

  const mockMcuData: McuData[] = filteredEmissions.map(emission => ({
    id: 1,
    mcu_id: emission.mcu,
    status: "active",
    created_at: emission.created_at,
    factory: 1
  }));
  const emissionsWithFactory = addFactoryToEmissionsData(filteredEmissions, mockMcuData);
  const factoryMap = mapFactories(factories as FactoryData[]);

  const alerts = calculateAlerts(filteredCompliance, filteredEnergy, emissionsWithFactory, factoryMap);
  const uniqueAlerts = alerts.reduce<Alert[]>((acc, alert) => {
    if (!acc.find(a => a.factoryName === alert.factoryName)) {
      acc.push(alert);
    }
    return acc;
  }, []);
  const activeAlerts = uniqueAlerts.filter((a: Alert) => !viewedFactories.includes(a.factoryName));
  const handleAlertViewed = (alert: Alert) => {
    setViewedFactories(prev =>
      prev.includes(alert.factoryName) ? prev : [...prev, alert.factoryName]
    );
  };
  const fullEmissionTrend = calculateEmissionTrend(filteredEmissions);
  const energySummary = calculateEnergySummary(filteredEnergy);
  const totalCombinedEmissions = calculateTotalEmissions(emissionsWithFactory, filteredEnergy);

  const compliantCount = filteredCompliance.filter((c) => c.compliance_status === "compliant").length;
  const totalFactoryCount = (factories as FactoryData[]).length;
  const percentCompliant =
    totalFactoryCount > 0 ? ((compliantCount / totalFactoryCount) * 100).toFixed(1) : "0";

  const pieData = [
    { name: "Firewood", value: energySummary.total ? parseFloat(((energySummary.firewood / energySummary.total) * 100).toFixed(2)) : 0 },
    { name: "Electricity", value: energySummary.total ? parseFloat(((energySummary.electricity / energySummary.total) * 100).toFixed(2)) : 0 },
    { name: "Diesel", value: energySummary.total ? parseFloat(((energySummary.diesel / energySummary.total) * 100).toFixed(2)) : 0 },
  ];
  const isLoading = energyLoading || emissionLoading || complianceLoading || factoryLoading;

  return (
    <SidebarLayout>
      <div className="h-screen text-white 2xl:w-[83vw] 2xl:ml-5 xl:w-[80vw] overflow-hidden">
        <main className="flex-1 2xl:p-6 xl:p-5 lg:p-3 md:overflow-y-auto md:max-h-screen 2xl:overflow-y-hidden xl:overflow-y-hidden">
          {isLoading ? (
            <div className="text-center text-white text-lg mt-20">Loading data...</div>
          ) : (
            <>
              <header className="items-center 2xl:mb-6 xl:mb-0">
                <h1 className="2xl:text-[30px] xl:text-[20px] lg:text-[15px] font-bold">KTDA Dashboard</h1>
                <div className="flex justify-between 2xl:mt-4 xl:mt-3">
                  <Calendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    filterType={filterType}
                    setFilterType={setFilterType}
                  />
                  <div className="flex justify-end w-16 space-x-4">
                    <Link href="/ktda-profile">
                      <IoPersonOutline className="text-[#F79B72] 2xl:w-7 2xl:h-7 xl:w-7 xl:h-7 lg:w-5 lg:h-5 cursor-pointer hover:text-[#2A4759]" />
                    </Link>
                  </div>
                </div>
              </header>

              <div className="flex justify-between xl:gap-2">
                <div className="bg-gray-800 2xl:p-4 xl:p-3 rounded-lg 2xl:w-90 xl:w-68 xl:h-[13vh] md:w-50 md:h-[13vh] md:p-3">
                  <p className="2xl:text-[20px] xl:text-[17px] md:text-[12px] ">Compliant Factories (filtered)</p>
                  <h2 className=" font-bold 2xl:mt-5 xl:mt-2 md:text-[15px] md:mt-3 2xl:text-[25px] xl:text-[20px] ">
                    {compliantCount} / {totalFactoryCount}
                  </h2>
                </div>
                <div className="bg-gray-800 2xl:p-4 xl:p-3 rounded-lg 2xl:w-90 xl:w-68 xl:h-[13vh] md:w-50 md:h-[13vh] md:p-3">
                  <p className="2xl:text-[20px] xl:text-[17px] md:text-[12px]">Compliant Factories In Percent</p>
                  <h2 className="text-xl font-bold 2xl:mt-5 xl:mt-2 md:text-[15px] md:mt-3 2xl:text-[25px] xl:text-[20px]">
                    {percentCompliant} %
                  </h2>
                </div>
                <div className="bg-gray-800 2xl:p-4 xl:p-3 rounded-lg 2xl:w-90 xl:w-68 xl:h-[13vh] md:w-50 md:h-[13vh] md:p-3">
                  <p className="2xl:text-[20px] xl:text-[17px] md:text-[12px]">Average Emission per Year</p>
                  <h2 className="text-xl font-bold 2xl:mt-5 xl:mt-2 md:text-[15px] md:mt-3 2xl:text-[25px] xl:text-[20px]">
                    {filteredEmissions.length > 0
                      ? (filteredEmissions.reduce((acc, item) => acc + parseFloat(item.emission_rate || "0"), 0) / filteredEmissions.length).toFixed(2)
                      : 0}{" "}
                    kg CO₂e
                  </h2>
                </div>
                <div className="bg-gray-800 2xl:p-4 xl:p-3 rounded-lg 2xl:w-90 xl:w-68 xl:h-[13vh] md:w-50 md:h-[13vh] md:p-3">
                  <p className="2xl:text-[20px] xl:text-[17px] md:text-[12px]">Total Emissions</p>
                  <h2 className="text-xl font-bold 2xl:mt-5 xl:mt-2 md:text-[15px] md:mt-3 2xl:text-[25px] xl:text-[20px]">{totalCombinedEmissions.toFixed(2)} kg CO₂e</h2>
                </div>
              </div>
              <h1 className="mb-4 font-semibold text-white 2xl:text-[1.5rem] 2xl:mt-5 xl:text-[1.3rem] xl:mt-3">Emission Trend</h1>
              <div className="grid grid-cols-3 2xl:gap-6 xl:gap-0">
                <div className="col-span-2 bg-gray-800 p-4 rounded-lg 2xl:w-[100%] 2xl:h-[85%] xl:w-[95%] xl:h-[90%] md:w-[95%]">
                  <ResponsiveContainer width="100%" height={460}>
                    <LineChart data={fullEmissionTrend}>
                      <XAxis dataKey="month" stroke="#ccc" label={{ value: "Months", position: "insideBottom", offset: -5, fill: "#ccc" }} />
                      <YAxis
                        stroke="#ccc"
                        label={{ value: "CO₂eq (kg)", angle: -90, position: "insideBottom", fill: "#ccc", offset: 20 }}
                        style={{ fill: "#ccc", fontSize: "14px", fontWeight: "bold", paddingTop: 10, paddingLeft: 5 }}
                      />
                      <Tooltip formatter={(value: number) => [`${value} kg CO₂e`, "Carbon Value"]} />
                      <Line type="monotone" dataKey="rate" stroke="#FF6B6B" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="2xl:space-y-4 lg:h-[70vh] md:space-y-2 md:h-[70vh]">
                  <div
                    className="bg-[#444444] rounded-xl 2xl:p-4 xl:p-2 cursor-pointer lg:h-[10vh] md:w-[27vw xl:w-[26vw]]"
                    onClick={() => setShowAlertModal(true)}
                    title="Click to view high emission alerts">
                    <div className="flex items-center 2xl:gap-3 xl:gap-3 md:gap-3 md:p-2 md:h-16">
                      <div className="bg-[#293038] rounded-md 2xl:h-10 2xl:w-10 xl:h-8 xl:w-8 flex items-center justify-center md:w-8 md:h-10">
                        <IoMdWarning className="text-red-700 2xl:text-[30px] xl:text-[20px]"/>
                      </div>
                      <div className="flex 2xl:gap-5 md:gap-2">
                        <div>
                          <div className="font-bold text-white xl:text-[20px] md:text-[13px] ">High Emission Alert</div>
                          <div className="2xl:text-sm text-red-200 xl:text-[15px] md:text-[12px] " >Emission exceeded threshold</div>
                        </div>
                        <div className="2xl:text-xl xl:text-lg font-bold mt-1 text-red-600 md:text-[12px]">
                          {activeAlerts.length} Alert{activeAlerts.length !== 1 && "s"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-[20px] xl:mt-4 xl:text-[25px]">Consumed Energy</h3>
                  <div className="bg-gray-800 p-4 rounded-lg  xl:mt-2 xl:h-[65%] 2xl:h-[60%] md:h-[92%]">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} fill="#8884D8" label>
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="ml-10 xl:mb-6">
                      <div>
                        <span className="text-[#F79B72] text-[30px] xl:text-[18px] md:text-[18px]">■</span>
                        <span className="text-[20px] xl:text-[20px] md:text-[20px]"> Firewood</span>
                      </div>
                      <div>
                        <span className="text-[#2A4759] text-[30px] xl:text-[18px] md:text-[18px]">■</span>
                        <span className="text-[20px] xl:text-[20px] md:text-[20px]">Electricity</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[30px] xl:text-[18px] md:text-[18px]">■ </span>
                        <span className="text-[20px] xl:text-[20px] md:text-[20px]">Diesel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showAlertModal && (
                <AlertModal
                  alerts={uniqueAlerts}
                  onClose={() => setShowAlertModal(false)}
                  onAlertViewed={handleAlertViewed}
                  viewedFactories={viewedFactories}
                />
              )}
            </>
          )}
        </main>
      </div>
    </SidebarLayout>
  );
}