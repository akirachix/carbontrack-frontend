"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchEnergy from "../hooks/useFetchEnergyEntries";
import useFetchEmissions from "../hooks/useFetchEmissions";
import { IoMdWarning } from "react-icons/io"; 
import { IoPersonOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";


const COLORS = ["#FF6B6B", "#4d96ff", "#a5a5a5"];

export default function DashboardPage() {
  const { energy, loading: energyLoading } = useFetchEnergy();
  const { emissions, loading: emissionsLoading } = useFetchEmissions();
  const { compliance, loading: complianceLoading } = useFetchCompliance();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filterByDate = <T extends { created_at?: string; updated_at?: string }>(data: T[]): T[] => {
    if (!selectedDate) return data;
    return data.filter((item) => {
      const dateStr = item.created_at || item.updated_at;
      if (!dateStr) return false;
      const itemDate = new Date(dateStr).toISOString().split("T")[0];
      return itemDate === selectedDate;
    });
  };

  const filteredEnergy = filterByDate(energy);
  const filteredEmissions = filterByDate(emissions);
  const filteredCompliance = filterByDate(compliance);


  const emissionTrend = filteredEmissions.map((item) => {
    const date = new Date(item.updated_at);
    return {
      month: date.toLocaleString("default", { month: "short" }),
      rate: parseFloat(item.emission_rate || "0"),
    };
  });

  const energySummary = filteredEnergy.reduce(
    (acc, item) => {
      const amount = parseFloat(
        typeof item.energy_amount === "string"
          ? item.energy_amount.split(" ")[0]
          : item.energy_amount || "0"
      );
      if (item.energy_type?.toLowerCase() === "firewood") {
        acc.firewood += amount;
      } else if (item.energy_type?.toLowerCase() === "electricity") {
        acc.electricity += amount;
      } else if (item.energy_type?.toLowerCase() === "diesel") {
        acc.diesel += amount;
      }
      return acc;
    },
    { firewood: 0, electricity: 0, diesel: 0 }
  );

  const pieData = [
    { name: "Firewood", value: energySummary.firewood },
    { name: "Electricity", value: energySummary.electricity },
    { name: "Diesel", value: energySummary.diesel },
  ];

  const totalEmissionRate = filteredEmissions.reduce(
    (acc, item) => acc + parseFloat(item.emission_rate || "0"),
    0
  );

  const totalEnergyCO2Equivalent = filteredEnergy.reduce((acc, item) => {
    const value = parseFloat(item.co2_equivalent || "0");
    return acc + value;
  }, 0);

  const totalCombinedEmissions = totalEmissionRate + totalEnergyCO2Equivalent;

  if (energyLoading || emissionsLoading || complianceLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-gray-900">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className=" h-screen  text-white w-[85vw]">
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="items-center mb-6">
          <h1 className="text-2xl font-bold">KTDA Dashboard</h1>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2 mt-4">
              <Calendar className="w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-800 text-white px-2 py-1 rounded"
              />
            </div>
            <div className="flex justify-end  w-16  space-x-4 ">
              <IoSettingsOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
              <IoPersonOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
            </div>
          </div>
        </header>
        <div className="flex justify-between">
          <div className="bg-gray-800 p-4 rounded-lg w-90">
            <p>Compliant Factories</p>
            <h2 className="text-xl font-bold  mt-5">{filteredCompliance.length}</h2>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg w-90">
            <p>Compliant Factories In Percent</p>
            <h2 className="text-xl font-bold  mt-5">
              {filteredCompliance.length > 0
                ? (
                  (filteredCompliance.filter(
                    (c) => c.compliance_status === "compliant"
                  ).length /filteredCompliance.length) *100
                ).toFixed(1)
                : 0}
              %
            </h2>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg h-30 w-90">
            <p className="text-[20px]">Average Emission per Year</p>
            <h2 className="text-xl font-bold mt-5">
              {filteredEmissions.length > 0
                ? (
                  filteredEmissions.reduce(
                    (acc, item) => acc + parseFloat(item.emission_rate || "0"),
                    0
                  ) / filteredEmissions.length
                ).toFixed(2)
                : 0}{" "}
              kg CO₂e
            </h2>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg w-90">
            <p>Total Emissions</p>
            <h2 className="text-xl font-bold  mt-5">{totalCombinedEmissions.toFixed(2)} kg CO₂e</h2>
          </div>
        </div>
        <h1 className="mt-20 mb-4 font-semibold text-white">Emission Trend</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-800 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={emissionTrend}>
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#FF6B6B" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-200 rounded-md h-8 w-8 flex items-center justify-center">
                  <IoMdWarning className="text-red-700 w-3xl" />
                </div>
                <div>
                  <div className="font-bold text-white">High Emission Alert</div>
                  <div className="text-sm text-red-200">Emission exceeded threshold</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Consumed Energy</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    fill="#8884D8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-around mt-2 text-sm">
                <span className="text-red-400">■ Firewood</span>
                <span className="text-blue-400">■ Electricity</span>
                <span className="text-gray-400">■ Diesel</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
