"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchEnergy from "../hooks/useFetchEnergyEntries";
import useFetchEmissions from "../hooks/useFetchEmissions";
import useFetchFactories from "../hooks/useFetchFactories";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import SidebarLayout from "../components/SideBarLayout/layout";
import AlertModal from "./component/HighEmissionAlerts";
import { IoMdWarning } from "react-icons/io";
import Calendar from "../sharedComponents/Calendar";
import {mapFactories, calculateAlerts, calculateEmissionTrend,calculateEnergySummary,calculateTotalEmissions, filterByDate} from "../utils/util";

const COLORS = ["#F79B72", "#2A4564", "#a5a5a5"];

export default function DashboardPage() {
  const { energy, loading: energyLoading } = useFetchEnergy();
  const { emissions, loading: emissionLoading } = useFetchEmissions();
  const { compliance, loading: complianceLoading } = useFetchCompliance();
  const { factories, loading: factoryLoading } = useFetchFactories();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState(false);

  const filteredEnergy = filterByDate(energy, selectedDate);
  const filteredEmissions = filterByDate(emissions, selectedDate);
  const filteredCompliance = filterByDate(compliance, selectedDate);

  const factoryMap = mapFactories(factories);
  const alerts = calculateAlerts(filteredCompliance, filteredEnergy, filteredEmissions, factoryMap);
  const fullEmissionTrend = calculateEmissionTrend(filteredEmissions);
  const energySummary = calculateEnergySummary(filteredEnergy);
  const totalCombinedEmissions = calculateTotalEmissions(filteredEmissions, filteredEnergy);
  const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();
  const pieData = [
    { name: "Firewood", value: energySummary.total ? parseFloat(((energySummary.firewood / energySummary.total) * 100).toFixed(2)) : 0 },
    { name: "Electricity", value: energySummary.total ? parseFloat(((energySummary.electricity / energySummary.total) * 100).toFixed(2)) : 0 },
    { name: "Diesel", value: energySummary.total ? parseFloat(((energySummary.diesel / energySummary.total) * 100).toFixed(2)) : 0 },
  ];

  const isLoading = energyLoading || emissionLoading || complianceLoading || factoryLoading;

  return (
    <SidebarLayout>
      <div className="h-screen text-white w-[85vw]">
        <main className="flex-1 p-6 ">
          {isLoading ? (
            <div className="text-center text-white text-lg mt-20">Loading data...</div>
          ) : (
            <>
              <header className="items-center mb-6">
                <h1 className="text-[30px] font-bold">KTDA Dashboard</h1>
                <div className="flex justify-between mt-4">
                  <Calendar
                    selectedDate={selectedDateObj}
                    setSelectedDate={(date) => {
                      if (date) {
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const dd = String(date.getDate()).padStart(2, "0");
                        setSelectedDate(`${yyyy}-${mm}-${dd}`);
                      } else {
                        setSelectedDate("");
                      }
                    }}
                  />
                  <div className="flex justify-end w-16 space-x-4">
                    <IoSettingsOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
                    <IoPersonOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
                  </div>
                </div>
              </header>
              <div className="flex justify-between">
                <div className="bg-gray-800 p-4 rounded-lg w-90">
                  <p className="text-[20px]">Compliant Factories</p>
                  <h2 className="text-xl font-bold mt-5">{filteredCompliance.length}</h2>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg w-90">
                  <p className="text-[20px]">Compliant Factories In Percent</p>
                  <h2 className="text-xl font-bold mt-5">
                    {filteredCompliance.length > 0
                      ? ((filteredCompliance.filter((c) => c.compliance_status === "compliant").length / filteredCompliance.length) * 100).toFixed(1)
                      : 0}{" "}%
                  </h2>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg h-30 w-90">
                  <p className="text-[20px]">Average Emission per Year</p>
                  <h2 className="text-xl font-bold mt-5">
                    {filteredEmissions.length > 0
                      ? (filteredEmissions.reduce((acc, item) => acc + parseFloat(item.emission_rate || "0"), 0) / filteredEmissions.length).toFixed(2)
                      : 0}{" "}
                    kg CO₂e
                  </h2>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg w-90">
                  <p className="text-[20px]">Total Emissions</p>
                  <h2 className="text-xl font-bold mt-5">{totalCombinedEmissions.toFixed(2)} kg CO₂e</h2>
                </div>
              </div>
              <h1 className="mb-4 font-semibold text-white text-[1.5rem] mt-7">Emission Trend</h1>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-gray-800 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={500}>
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
                <div className="space-y-4">
                  <div
                    className="bg-[#444444] rounded-xl p-4 cursor-pointer"
                    onClick={() => setShowAlertModal(true)}
                    title="Click to view high emission alerts">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#293038] rounded-md h-10 w-10 flex items-center justify-center">
                        <IoMdWarning className="text-red-700 text-[30px]" />
                      </div>
                      <div className="flex gap-10">
                        <div>
                          <div className="font-bold text-white">High Emission Alert</div>
                          <div className="text-sm text-red-200">Emission exceeded threshold</div>
                        </div>
                        <div className="text-xl font-bold mt-1 text-red-600">
                          {alerts.length} Alert{alerts.length !== 1 && "s"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white text-[20px]">Consumed Energy</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} fill="#8884D8" label>
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="ml-10 text-[15px]">
                      <div>
                        <span className="text-[#F79B72] text-[30px]">■</span>
                        <span className="text-[20px]"> Firewood</span>
                      </div>
                      <div>
                        <span className="text-[#2A4759] text-[30px]">■</span>
                        <span className="text-[20px]">Electricity</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[30px]">■ </span>
                        <span className="text-[20px]">Diesel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showAlertModal && <AlertModal alerts={alerts} onClose={() => setShowAlertModal(false)} />}
            </>
          )}
        </main>
      </div>
    </SidebarLayout>
  );
}
