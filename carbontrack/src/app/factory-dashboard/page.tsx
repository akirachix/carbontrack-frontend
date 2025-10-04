'use client';
import React, { useEffect, useState } from "react";
import FactoryLayout from "../components/FactoryLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { IoPersonOutline } from "react-icons/io5";
import { useFetchEmission } from "../hooks/useFetchEmissions";
import { useFetchEnergyEntries } from "../hooks/useFetchEnergyEntries";
import Link from "next/link";
import CalendarFactory from "../sharedComponents/CalendarFactory";
import MqttSubscriber from "../hivemq/mqtt_client";
import mqtt from "mqtt";

export default function DashboardPage() {
  const [liveData, setLiveData] = useState<{ time: string; value: number }[]>([]);
  useEffect(() => {
    const MQTT_BROKER = process.env.NEXT_PUBLIC_MQTT_BROKER || "wss://broker.hivemq.com:8000/mqtt";
    const MQTT_TOPIC = "esp32/hello";
    const options = {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    };
    const client = mqtt.connect(MQTT_BROKER, options);
    client.on("connect", () => {
      client.subscribe(MQTT_TOPIC);
    });
    client.on("message", (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        setLiveData((prev) => [
          ...prev,
          {
            time: mqttData.timestamp || new Date().toISOString(),
            value: parseFloat(mqttData.co2_emission_kgs),
          },
        ]);
      } catch (err) {
      }
    });
    return () => {
      client.end();
    };
  }, []);
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
        <div className="flex-1 w-full max-w-9xl mx-auto overflow-y-auto max-h-screen">
          <main className="p-4 md:p-8">
            <div className="flex justify-end space-x-4 mb-4">
              <Link href="/factory-profile">
                <IoPersonOutline className="text-[#F79B72] 2xl:w-7 2xl:h-7 xl:w-7 xl:h-7 lg:w-5 lg:h-5 cursor-pointer hover:text-[#2A4759]" />
              </Link>
            </div>
            <h2 className="text-2xl font-bold mb-2 truncate">Factory Dashboard</h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Real-time monitoring for individual factory operations
            </p>
            <CalendarFactory
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 2xl:mb-8 xl:mb-8 lg:mb-4">
              <div className="bg-slate-700 xl:p-6 lg:p-3 p-6 2xl:p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-300">Today’s total CO2 emissions</p>
                <p className="text-2xl font-bold mt-2 truncate">
                  {emissionsLoading
                    ? "Loading..."
                    : todayTotal !== null
                      ? `${todayTotal.toFixed(6)} kgs`
                      : "No data"}
                </p>
              </div>
              <div className="bg-slate-700 xl:p-6 lg:p-3 p-6 2xl:p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-300">This month total CO2 emissions</p>
                <p className="text-2xl font-bold mt-2 truncate">
                  {monthTotal !== null
                    ? `${monthTotal.toFixed(6)} kgs`
                    : emissionsLoading
                      ? "Loading..."
                      : "No data"}
                </p>
              </div>
              <div className="bg-slate-700 xl:p-6 lg:p-3 p-6 2xl:p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
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
              <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-full
                h-56 sm:h-72 2xl:h-126 xl:h-94
                lg:h-60 md:h-54">
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
              <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-full
                h-56 sm:h-72 2xl:h-126 xl:h-94
                lg:h-60 md:h-54">
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
            <div className="bg-slate-700 p-6 rounded-lg shadow w-full  h-[32vw] mt-10">
              <h3 className="text-xl font-semibold mb-4 text-white">Live CO₂ Emissions </h3>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={liveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="time"
                    stroke="#aaa"
                    tick={{ fontSize: 12 }}
                    tickFormatter={tick => new Date(tick).toLocaleTimeString()}
                    label={{ value: "Time", position: "insideBottom", offset: -5, fill: "#aaa" }}/>
                  <YAxis
                    stroke="#aaa"
                    label={{ value: "CO₂ (kg)", angle: -90, position: "insideLeft", fill: "#aaa" }}/>
                  <Tooltip wrapperStyle={{ backgroundColor: "blue" }}/>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#F79B72"
                    fill="#F79B72"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </main>
        </div>
      </div>
    </FactoryLayout>
  );
}