"use client";
import React, { useState, useEffect } from "react";

interface ComplianceTargetModalProps {
  currentTarget: string;
  onClose: () => void;
  onSave: (newTarget: string, factory: string) => void | Promise<void>;
}
export default function ComplianceTargetModal({ currentTarget, onClose, onSave }: ComplianceTargetModalProps) {
  const [newTarget, setNewTarget] = useState("");
  const [factory, setFactory] = useState("");

  useEffect(() => {
    setNewTarget("");
    setFactory("");
  }, [currentTarget]);

  const handleSave = async () => {
    if (
      !isNaN(parseFloat(newTarget)) &&
      parseFloat(newTarget) > 0 &&
      factory.trim() !== ""
    ) {
      try {
        await onSave(newTarget, factory);
      } catch (err) {
        alert("Error saving target: " + (err as Error).message)
      }
    } else {
      alert("Please enter a valid numeric target and factory name.");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative bg-gray-100 rounded-xl shadow-lg px-8 py-7 w-full max-w-sm mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-[#2A4759] text-2xl font-bold"
          aria-label="Close modal">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#2A4759] text-center">Compliance Target</h2>
        <p className="text-[#1a2936] mb-4 font-semibold">Current target {currentTarget}</p>
        
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
          autoFocus/>
        <label htmlFor="factory" className="block font-semibold text-[#2A4759] mb-2">
          Factory
        </label>
        <input 
          id="factory"
          type="text"
          value={factory}
          onChange={(e) => setFactory(e.target.value)}
          placeholder="Factory Name"
          className="w-full rounded border border-[#2A4759] px-3 py-2 mb-6 focus:outline-none text-black"/>
        <button
          onClick={handleSave}
          className="w-full bg-[#C76C4C] hover:bg-[#F79B72] text-white font-semibold py-2 rounded">
          Set target
        </button>
      </div>
    </div>
  );
}
