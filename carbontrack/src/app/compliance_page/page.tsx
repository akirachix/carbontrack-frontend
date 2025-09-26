"use client";
import { useState } from "react";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchFactories from "../hooks/useFetchFactories";
import Pagination from "../sharedComponents/Pagination";
import ComplianceTargetModal from "./component/AddTarget";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { updateCompliance } from "../utils/fetchCompliance";
import SidebarLayout from "../components/SideBarLayout";

interface Factory {
  factory_id: number;
  factory_name: string;
}

interface Compliance {
  compliance_id: number;
  compliance_target: string;
  compliance_status?: string | null;
  factory: number;
  updated_at?: string | null;
  created_at?: string | null;
}

export default function ComplianceDashboard() {
  const {
    compliance,
    loading: complianceLoading,
    error: complianceError,
  } = useFetchCompliance() as {
    compliance: Compliance[];
    loading: boolean;
    error: string | null;
  };

  const {
    factories,
    loading: factoriesLoading,
    error: factoriesError,
  } = useFetchFactories() as {
    factories: Factory[];
    loading: boolean;
    error: string | null;
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 11;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCompliance, setSelectedCompliance] = useState<Compliance | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const isLoading = complianceLoading || factoriesLoading;

  const factoryMap: Record<number, string> = {};
  factories.forEach((f) => {
    factoryMap[f.factory_id] = f.factory_name;
  });

  let filteredCompliance = compliance;

  if (searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    filteredCompliance = filteredCompliance.filter((item) => {
      const factoryName = factoryMap[item.factory] || "";
      const status = item.compliance_status?.toLowerCase() || "";
      return (
        factoryName.toLowerCase().includes(lowerTerm) ||
        status.includes(lowerTerm)
      );
    });
  }

  const totalPages = Math.ceil(filteredCompliance.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredCompliance.slice(start, start + itemsPerPage);

  const complianceTarget =
    compliance.length > 0 ? compliance[0].compliance_target : "1.08";

  const totalBreach = filteredCompliance.filter(
    (c) => c.compliance_status?.toLowerCase() !== "compliant"
  ).length;

  const compliantPercent = filteredCompliance.length
    ? Math.round(
        (filteredCompliance.filter(
          (c) => c.compliance_status?.toLowerCase() === "compliant"
        ).length /
          filteredCompliance.length) *
          100
      )
    : 0;

  const formatDate = (dateString?: string | null) =>
    dateString ? dateString.slice(0, 10) : "";

  const openModal = () => {
    if (compliance.length > 0) {
      setSelectedCompliance(compliance[0]);
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSaveTarget = async (
    complianceId: number,
    newTarget: string,
    factory: number
  ) => {
    try {
      await updateCompliance(complianceId, newTarget, factory);
      setMessage("Compliance target updated successfully!");
      setMessageType("success");
      closeModal();
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 2000);
    } catch (error) {
      setMessage(
        "Error saving compliance target: " + (error as Error).message
      );
      setMessageType("error");
    }
  };

  return (
    <SidebarLayout>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-white text-lg">Loading compliance data...</p>
        </div>
      ) : complianceError ? (
        <div className="p-4 text-red-500">
          Compliance Error: {complianceError}
        </div>
      ) : factoriesError ? (
        <div className="p-4 text-red-500">
          Factories Error: {factoriesError}
        </div>
      ) : (
        <div className="p-4 mx-auto min-h-screen text-white w-[80vw] ml-15 xl:w-[72vw]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-[2rem] font-bold">Compliance</h2>
            </div>
            <div className="flex space-x-4 items-center">
              <IoSettingsOutline className="w-7 h-7 text-[#F79B72] hover:text-[#2A4759] cursor-pointer" />
              <IoPersonOutline className="w-7 h-7 text-[#F79B72] hover:text-[#2A4759] cursor-pointer" />
            </div>
          </div>
          {message && (
            <div
              className={`mb-4 p-3 rounded text-center max-w-lg mx-auto ${
                messageType === "success" ? "text-green-600" : "bg-red-600"
              }`}
            >
              {message}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-800 rounded h-30 text-center">
              <p className="text-[1.5em] mb-1">Compliance Target</p>
              <p className="font-bold text-[2em]">{complianceTarget}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded text-center xl:h-30">
              <p className="text-sm mb-1 text-[1.5em]">
                Total compliance breach
              </p>
              <p className="font-bold text-[2em]">{totalBreach} total</p>
            </div>
            <div className="p-4 bg-gray-800 rounded text-center xl:h-30">
              <p className="text-sm mb-1 text-[1.5em] xl:text-[1em]">
                Compliant Factories In Percent
              </p>
              <p className="font-bold text-[2em]">{compliantPercent}%</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-4 justify-between">
            <input
              type="text"
              placeholder="Search by factory name, status"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-[30%]"
            />
            <button
              onClick={openModal}
              className="bg-[#2A4759] px-4 py-2 rounded font-semibold hover:bg-[#C76C4C] transition"
            >
              Update Target
            </button>
          </div>
          <div className="overflow-x-auto border border-gray-700 rounded">
            <table className="min-w-full text-left border-collapse border border-gray-700">
              <thead className="bg-[#2A4759] text-white">
                <tr>
                  <th className="p-3 border border-gray-700 w-1/3">Factory</th>
                  <th className="p-3 border border-gray-700 w-1/3">
                    Compliant status
                  </th>
                  <th className="p-3 border border-gray-700 w-1/3">
                    Last Status Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr
                      key={item.compliance_id}
                      className="bg-gray-800 even:bg-gray-900 border border-gray-700"
                    >
                      <td className="p-3 font-semibold border border-gray-700">
                        {factoryMap[item.factory] || `Factory ${item.factory}`}
                      </td>
                      <td
                        className={`p-3 border border-gray-700 ${
                          item.compliance_status?.toLowerCase() === "compliant"
                            ? "text-white"
                            : "text-orange-600"
                        }`}
                      >
                        {item.compliance_status}
                      </td>
                      <td className="p-3 border border-gray-700 italic text-gray-400">
                        {formatDate(item.updated_at) ||
                          formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page >= 1 && page <= totalPages) setCurrentPage(page);
            }}
            isDark
          />
          {modalOpen && selectedCompliance && (
            <ComplianceTargetModal
              complianceId={selectedCompliance.compliance_id}
              currentTarget={selectedCompliance.compliance_target}
              factoryId={selectedCompliance.factory}
              factories={factories}
              onClose={closeModal}
              onSave={handleSaveTarget}
            />
          )}
        </div>
      )}
    </SidebarLayout>
  );
}
