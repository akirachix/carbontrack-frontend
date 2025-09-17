import { useEffect, useState } from "react";
import { fetchEmissions } from "../utils/fetchEmissions";

interface EmissionType  {
  emissions_id: number;
  emission_rate: string;
  updated_at: string;
};

const useFetchEmissions = () => {
  const [emissions, setEmissions] = useState<EmissionType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [barData, setBarData] = useState<{ month: string; value: number }[]>([]);
  const [lineData, setLineData] = useState<{ time: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayTotal, setTodayTotal] = useState<number | null>(null);
  const [monthTotal, setMonthTotal] = useState<number | null>(null);

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEmissions();
        setEmissions(data || []);
      } catch(error) {
        setError("Failed to load data");
        setEmissions([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  
  useEffect(() => {
    if (emissions.length === 0) {
      setTodayTotal(null);
      setMonthTotal(null);
      setBarData([]);
      setLineData([]);
      return;
    }

    const now = new Date();
    const checkDate = selectedDate || now;

    
    const totalDay = emissions.reduce((total, item) => {
      const date = new Date(item.updated_at);
      if (
        date.getFullYear() === checkDate.getFullYear() &&
        date.getMonth() === checkDate.getMonth() &&
        date.getDate() === checkDate.getDate()
      ) {
        return total + parseFloat(item.emission_rate);
      }
      return total;
    }, 0);
    setTodayTotal(totalDay);

    
    const totalMonth = emissions.reduce((total, item) => {
      const date = new Date(item.updated_at);
      if (date.getFullYear() === now.getFullYear() && date.getMonth() === checkDate.getMonth()) {
        return total + parseFloat(item.emission_rate);
      }
      return total;
    }, 0);
    setMonthTotal(totalMonth);

    
    const monthlySums: { [key: string]: number } = {};
    emissions.forEach((item) => {
      const month = new Date(item.updated_at).toLocaleString("default", { month: "short" });
      monthlySums[month] = (monthlySums[month] || 0) + parseFloat(item.emission_rate);
    });
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    setBarData(months.map(month => ({month, value: monthlySums[month] || 0})));

    
    const intervals = [];
    for (let h = 0; h < 24; h++) {
      intervals.push(h.toString().padStart(2, "0") + ":00");
    }
    
    const intervalSums: { [key: string]: number } = {};
    emissions.forEach((item) => {
      const date = new Date(item.updated_at);
      if (
        date.getFullYear() === checkDate.getFullYear() &&
        date.getMonth() === checkDate.getMonth() &&
        date.getDate() === checkDate.getDate()
      ) {
        const hourKey = date.getHours().toString().padStart(2, "0") + ":00";
        intervalSums[hourKey] = (intervalSums[hourKey] || 0) + parseFloat(item.emission_rate);
      }
    });
    setLineData(intervals.map(time => ({ time, value: intervalSums[time] || 0 })));
  }, [emissions, selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    barData,
    lineData,
    error,
    loading,
    todayTotal,
    monthTotal,
  };
};

export default useFetchEmissions;
