"use client";
import { useState, useMemo } from "react";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchFactories from "../hooks/useFetchFactories";
import Pagination from "../sharedComponents/Pagination";
import ComplianceTargetModal from "./component";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";

export default function ComplianceDashboard() {
  const { compliance, loading: complianceLoading, error: complianceError, postCompliance } = useFetchCompliance();
  const { factories, loading: factoriesLoading, error: factoriesError } = useFetchFactories();
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);

  const currentTarget = compliance.length > 0 && compliance[0].compliance_target ? compliance[0].compliance_target : "1.08";
  const factoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    factories.forEach((f) => { map[f.factory_id] = f.factory_name; });
    return map;
  }, [factories]);

  const filteredCompliance = useMemo(() => {
    let filtered = compliance;
    if (selectedDate) {
      filtered = filtered.filter(item => (item.updated_at || item.created_at || "").slice(0, 10) === selectedDate);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const factoryName = factoryMap[item.factory] || "";
        const status = item.compliance_status?.toLowerCase() || "";
        const date = (item.updated_at || item.created_at || "").slice(0, 10);
        return factoryName.toLowerCase().includes(lowerTerm) || status.includes(lowerTerm) || date.includes(lowerTerm);
      });
    }
    return filtered;
  }, [compliance, selectedDate, searchTerm, factoryMap]);

  const totalPages = Math.ceil(filteredCompliance.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCompliance.slice(start, start + itemsPerPage);
  }, [currentPage, filteredCompliance]);

  const complianceTarget = "1.08 kg CO2/kg tea";
  const totalBreach = filteredCompliance.filter(c => c.compliance_status.toLowerCase() !== "compliant").length;
  const compliantPercent = filteredCompliance.length
    ? Math.round((filteredCompliance.filter(c => c.compliance_status.toLowerCase() === "compliant").length / filteredCompliance.length) * 100)
    : 0;

  const formatDate = (dateString?: string) => dateString ? dateString.slice(0, 10) : "";

  if (complianceLoading || factoriesLoading) return <div className="p-4 text-white">Loading compliance data...</div>;
  if (complianceError) return <div className="p-4 text-red-500">Compliance Error: {complianceError}</div>;
  if (factoriesError) return <div className="p-4 text-red-500">Factories Error: {factoriesError}</div>;

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSaveTarget = async (newTarget: string, factory: string) => {
    try {
      await postCompliance(newTarget, factory);
      closeModal();
    } catch (error) {
      alert('Error saving compliance target: ' + (error as Error).message);
    }
  };
  return (
    <div className="p-4  mx-auto min-h-screen text-white w-[80vw] ml-15">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-[2rem] font-bold">Compliance</h2>
          <div className="flex  space-x-2">
            <label htmlFor="datePicker" className="block mb-1 font-semibold">Select Date</label>
            <input
              type="date"
              id="datePicker"
              max={new Date().toISOString().slice(0, 10)}
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded bg-gray-700 text-white focus:outline-none" />
            {selectedDate && (
              <button onClick={() => setSelectedDate("")} className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500">Clear</button>
            )}
          </div>
        </div>
        <div className="flex space-x-4 items-center">
          <IoSettingsOutline className="w-7 h-7 text-[#F79B72] hover:text-[#2A4759] cursor-pointer" />
          <IoPersonOutline className="w-7 h-7 text-[#F79B72] hover:text-[#2A4759] cursor-pointer" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-800 rounded ">
          <p className="text-lg mb-1">Compliance Target</p>
          <p className="font-bold text-xl">{complianceTarget}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded text-center">
          <p className="text-sm mb-1">Total compliance breach</p>
          <p className="font-bold text-xl">{totalBreach} total</p>
        </div>
        <div className="p-4 bg-gray-800 rounded text-center">
          <p className="text-sm mb-1">Compliant Factories In Percent</p>
          <p className="font-bold text-xl">{compliantPercent}%</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-4 justify-between">
        <input
          type="text"
          placeholder="Search by factory name, status, date"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className=" px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-[30%]" />
        <button
          onClick={openModal}
          className="bg-[#2A4759] px-4 py-2 rounded font-semibold hover:bg-[#C76C4C] transition">
          Update Target
        </button>
      </div>
      <div className="overflow-x-auto border border-gray-700 rounded">
        <table className="min-w-full text-left border-collapse border border-gray-700">
          <thead className="bg-[#2A4759] text-white">
            <tr>
              <th className="p-3 border border-gray-700 w-1/3">Factory</th>
              <th className="p-3 border border-gray-700 w-1/3">Compliant status</th>
              <th className="p-3 border border-gray-700 w-1/3">Last Status Change</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">No data found for this date</td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.compliance_id} className="bg-gray-800 even:bg-gray-900 border border-gray-700">
                  <td className="p-3 font-semibold border border-gray-700">
                    {factoryMap[item.factory] || `Factory ${item.factory}`}
                  </td>
                  <td className={`p-3 border border-gray-700 ${item.compliance_status.toLowerCase() === "compliant" ? "text-white" : "text-orange-600"}`}>
                    {item.compliance_status}
                  </td>
                  <td className="p-3 border border-gray-700 italic text-gray-400">
                    {formatDate(item.updated_at) || formatDate(item.created_at)}
                  </td>
                </tr>)))}
          </tbody>
        </table>
      </div>
    
    </div>
  );
}
