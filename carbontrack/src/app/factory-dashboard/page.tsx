"use client";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,Tooltip, LineChart, Line, ResponsiveContainer,} from "recharts";
import { IoSettingsOutline, IoPersonOutline } from "react-icons/io5";
import { useFetchEmission } from "../hooks/useFetchEmissions";
import { useFetchEnergyEntries } from "../hooks/useFetchEnergyEntries";
import Link from "next/link";
import FactoryLayout from "../components/FactoryLayout";
import Calendar from "../sharedComponents/Calendar";
import MqttSubscriber from "../hivemq/mqtt_client";
export default function DashboardPage() {
  const {
    selectedDate,
    setSelectedDate,
    barData,
    lineData,
    loading: emissionsLoading,
    todayTotal,
    monthTotal,
  } = useFetchEmission();
  const { totalCO2, error: energyLoading } = useFetchEnergyEntries(selectedDate);
  return (
    <FactoryLayout>
      <div className="bg-black text-white w-full min-h-screen flex flex-col">
        <MqttSubscriber />
        <main className="flex-1 p-4 md:p-8 overflow-auto w-full max-w-7xl mx-auto">
          <div className="flex justify-end space-x-4 mb-4">
            <Link href="">
              <IoSettingsOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
            </Link>
            <Link href="/factory-profile">
              <IoPersonOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
            </Link>
          </div>
          <h2 className="text-2xl font-bold mb-2 truncate">Factory Dashboard</h2>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            Real-time monitoring for individual factory operations
          </p>
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={(selectedDate) => {
              if (selectedDate) {
                selectedDate.getFullYear();
                String(selectedDate.getMonth() + 1).padStart(2, "0");
                String(selectedDate.getDate()).padStart(2, "0");
                setSelectedDate(selectedDate);
              }
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-300">Today’s total CO2 emissions</p>
              <p className="text-2xl font-bold mt-2 truncate">
                {emissionsLoading
                  ? "Loading..."
                  : todayTotal !== null
                  ? `${todayTotal.toFixed(6)} kgs`
                  : "No data"}
              </p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-300">This month total CO2 emissions</p>
              <p className="text-2xl font-bold mt-2 truncate">
                {monthTotal !== null
                  ? `${monthTotal.toFixed(6)} kgs`
                  : emissionsLoading
                  ? "Loading..."
                  : "No data"}
              </p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-300">Indirect Emissions</p>
              <p className="text-2xl font-bold mt-2 truncate">
                {totalCO2 !== null
                  ? `${totalCO2.toFixed(6)} kgs`
                  : energyLoading
                  ? "Loading..."
                  : "No data"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-full h-56 sm:h-72 md:h-96">
              <h3 className="text-xl font-semibold mb-4 text-white truncate">
                CO2 Levels Over Time
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="month"
                    stroke="#aaa"
                    height={60}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F79B72" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-full h-56 sm:h-72 md:h-96">
              <h3 className="text-xl font-semibold mb-4 text-white truncate">
                Current CO2 Emissions
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 43 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="time" stroke="#aaa" height={40} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#F79B72" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </FactoryLayout>
  );
}