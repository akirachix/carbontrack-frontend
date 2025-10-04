"use client";
import { useState, useEffect} from "react";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchFactories from "../hooks/useFetchFactories";
import Pagination from "../sharedComponents/Pagination";
import ComplianceTargetModal from "./component/AddTarget";
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
interface FactoryWithCompliance {
  factory: Factory;
  compliance: Compliance | null;
}
export default function ComplianceDashboard() {
const {
  compliance,
  loading: complianceLoading,
  error: complianceError,
  refetch: refetchCompliance
} = useFetchCompliance();
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
  const itemsPerPage = 8;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCompliance, setSelectedCompliance] = useState<Compliance | null>(null);
  const isLoading = complianceLoading || factoriesLoading;
const factoryToLatestCompliance: Record<number, Compliance> = {};
compliance.forEach((item) => {
  const existing = factoryToLatestCompliance[item.factory];
  const currentItemDate = new Date(item.updated_at || item.created_at || 0);
  const existingDate = existing
    ? new Date(existing.updated_at || existing.created_at || 0)
    : new Date(0);
  if (!existing || currentItemDate > existingDate) {
    factoryToLatestCompliance[item.factory] = item;
  }
});
const factoryComplianceList: FactoryWithCompliance[] = factories.map((factory) => ({
  factory,
  compliance: factoryToLatestCompliance[factory.factory_id] || null,
}));
  let filteredFactoryCompliance = factoryComplianceList;
  if (searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    filteredFactoryCompliance = filteredFactoryCompliance.filter(({ factory, compliance }) => {
      const matchesFactory = factory.factory_name.toLowerCase().includes(lowerTerm);
      const matchesStatus = compliance?.compliance_status?.toLowerCase().includes(lowerTerm) || false;
      return matchesFactory || matchesStatus;
    });
  }
  const totalPages = Math.ceil(filteredFactoryCompliance.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredFactoryCompliance.slice(start, start + itemsPerPage);
  const totalBreach = filteredFactoryCompliance.filter(
    ({ compliance }) => compliance?.compliance_status?.toLowerCase() !== "compliant"
  ).length;
  const compliantCount = filteredFactoryCompliance.filter(
    ({ compliance }) => compliance?.compliance_status?.toLowerCase() === "compliant"
  ).length;
  const compliantPercent = filteredFactoryCompliance.length
    ? Math.round((compliantCount / filteredFactoryCompliance.length) * 100)
    : 0;
  const complianceTarget = compliance.length > 0 ? compliance[0].compliance_target : "1.08";
  const formatDate = (dateString?: string | null) =>
    dateString ? dateString.split("T")[0] : "";
  const openModal = () => {
    if (compliance.length > 0) {
      setSelectedCompliance(compliance[0]);
    } else if (factories.length > 0) {
      setSelectedCompliance({
        compliance_id: 0,
        compliance_target: "1.08",
        factory: factories[0].factory_id,
      } as Compliance);
    }
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
const handleSaveTarget = async (
  complianceId: number,
  newTarget: string,
  factory: number
) => {
  await updateCompliance(complianceId, newTarget, factory);
  await refetchCompliance();
};
  return (
    <SidebarLayout>
      {isLoading ? (
      <div className="p-2 min-h-screen text-white mx-auto px-10 pt-9">
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
        <div className="p-2 min-h-screen text-white  mx-10 pt-9">
          <h1 className="font-500 2xl:text-[48px] xl:text-[35px] lg:text-[25px] ">
            Compliance
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-800 rounded text-center">
              <p className="2xl:text-[18px] xl:text-[16px] lg:text-[14px] mb-1">Compliance Target</p>
              <p className="font-bold 2xl:text-[20px] xl:text-[18px] lg:text-[16px]">{complianceTarget}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded text-center">
              <p className="2xl:text-[18px] xl:text-[16px] lg:text-[14px] mb-1">Total compliance breach</p>
              <p className="font-bold 2xl:text-[20px] xl:text-[18px] lg:text-[16px]">{totalBreach}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded text-center">
              <p className="2xl:text-[18px] xl:text-[16px] lg:text-[14px] mb-1">Compliant Factories (%)</p>
              <p className="font-bold 2xl:text-[20px] xl:text-[18px] lg:text-[16px]">{compliantPercent}%</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-4 justify-between">
            <input
              type="text"
              placeholder="Search by factory name or status"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="2xl:p-3 xl:p-3 lg:p-2 w-full sm:w-[25vw] border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A4759]"
            />
            <button
              onClick={openModal}
              className="bg-[#2A4759] cursor-pointer px-4 py-2 rounded font-semibold hover:bg-[#C76C4C] transition"
            >
              Update Target
            </button>
          </div>
          <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse border border-gray-700 text-left">
              <thead>
                <tr className="bg-[#2A4759] text-white border border-gray-700 2xl:text-[16px] xl:text-[16px] lg:text-[13px]">
                  <th className="2xl:p-5 xl:p-4 lg:p-3 w-1/3 border border-gray-700">Factory</th>
                  <th className="2xl:p-5 xl:p-4 lg:p-3 w-1/3 border border-gray-700">Compliant Status</th>
                  <th className="2xl:p-5 xl:p-4 lg:p-3 w-1/3 border border-gray-700">Last Status Change</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="2xl:p-5 xl:p-4 lg:p-3 text-center border border-gray-700">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map(({ factory, compliance }, index) => (
                    <tr
                      key={factory.factory_id}
                      className={`border border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}
                    >
                      <td className="2xl:p-5 xl:p-4 lg:p-2 font-semibold border border-gray-700 2xl:text-[15px] xl:text-[15px] lg:text-[12px]">
                        {factory.factory_name}
                      </td>
               <td>
  {compliance?.compliance_status ? (
    compliance.compliance_status.toLowerCase() === "compliant" ? (
      <span className="text-green-400">{compliance.compliance_status}</span>
    ) : (
      <span className="text-red-500">{compliance.compliance_status}</span>
    )
  ) : (
    <span className="text-orange-400">No status</span>
  )}
</td>
                      <td className="2xl:p-5 xl:p-4 lg:p-2 italic text-gray-400 border border-gray-700 2xl:text-[15px] xl:text-[15px] lg:text-[12px]">
                        {compliance
                          ? formatDate(compliance.updated_at) || formatDate(compliance.created_at)
                          : "No status changed"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              isDark
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
            />
          </div>
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