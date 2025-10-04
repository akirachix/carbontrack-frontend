"use client";
import React, { useState, useEffect } from "react";
interface Factory {
  factory_id: number;
  factory_name: string;
}
interface ComplianceTargetModalProps {
  complianceId: number;
  currentTarget: string;
  factoryId: number;
  factories: Factory[];
  onClose: () => void;
  onSave: (
    complianceId: number,
    newTarget: string,
    factoryId: number
  ) => Promise<void>;
}
export default function ComplianceTargetModal({
  complianceId,
  currentTarget,
  factoryId,
  factories,
  onClose,
  onSave,
}: ComplianceTargetModalProps) {
  const [newTarget, setNewTarget] = useState(currentTarget);
  const [selectedFactory, setSelectedFactory] = useState(factoryId);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  useEffect(() => {
    setNewTarget(currentTarget);
    setSelectedFactory(factoryId);
    setMessage(null);
    setMessageType(null);
  }, [currentTarget, factoryId]);
  const handleSave = async () => {
    const numValue = parseFloat(newTarget);
    if (isNaN(numValue) || numValue <= 0) {
      setMessage("Please enter a valid numeric target greater than 0.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    setMessage(null);
    setMessageType(null);
    try {
      await onSave(complianceId, newTarget, selectedFactory);
      setMessage("Compliance target updated successfully!");
      setMessageType("success");
      setTimeout(onClose, 1500);
    } catch (err) {
      setMessage("Error saving target: " + (err as Error).message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={handleOverlayClick}>
      <div className="relative bg-gray-100 rounded-xl shadow-lg px-8 py-7 w-full max-w-sm mx-auto">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-5 text-[#2A4759] text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#2A4759] text-center">
          Compliance Target
        </h2>
        <p className="text-[#1A2936] mb-4 font-semibold">
          Current target: {currentTarget}
        </p>
        <label htmlFor="newTarget" className="block font-semibold text-[#2A4759] mb-2">
          New Target
        </label>
        <input
          id="newTarget"
          type="text"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder="kg CO2 per 1 kg of tea"
          className="w-full rounded border border-[#2A4759] px-3 py-2 mb-6 focus:outline-none text-black"
        />
        <label htmlFor="factorySelect" className="block font-semibold text-[#2A4759] mb-2">
          Factory
        </label>
        <select
          id="factorySelect"
          value={selectedFactory}
          onChange={(e) => setSelectedFactory(Number(e.target.value))}
          className="w-full rounded border border-[#2A4759] px-3 py-2 mb-6 focus:outline-none text-black"
        >
          {factories.map((f) => (
            <option key={f.factory_id} value={f.factory_id}>
              {f.factory_name}
            </option>
          ))}
        </select>
        {message && (
          <div
            className={`mb-4 text-center text-sm font-medium ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full cursor-pointer font-semibold py-2 rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#C76C4C] hover:bg-[#F79B72] text-white"
          }`}
        >
          {loading ? "Saving..." : "Set target"}
        </button>
      </div>
    </div>
  );
}