"use client";
import { useState } from "react";

const energyTypes = [
  { id: "electricity", label: "Electricity (kWh)" },
  { id: "diesel", label: "Diesel (liters)" },
  { id: "firewood", label: "Firewood (kg)" },
];

interface EnergyRecord {
  energy_type: string;
  energy_amount: string;
  tea_processed_amount: string;
}

interface ModalFormProperties {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: EnergyRecord & { factory: number }
  ) => Promise<{ success: boolean; message?: string }>;
  userFactoryId: number;
}

function ModalForm({
  isOpen,
  onClose,
  onSave,
  userFactoryId,
}: ModalFormProperties) {
  const [energyType, setEnergyType] = useState(energyTypes[0].id);
  const [energyAmount, setEnergyAmount] = useState("");
  const [teaProcessedAmount, setTeaProcessedAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formFieldClasses =
    "mt-2 p-3 w-full border rounded bg-[#F3F3F3] text-[#214A5A] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]";
  const labelClasses = "block text-sm font-medium text-[#FFFFFF]";

  const resetForm = () => {
    setEnergyType(energyTypes[0].id);
    setEnergyAmount("");
    setTeaProcessedAmount("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userFactoryId) {
      setErrorMessage("Factory ID is missing.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await onSave({
        energy_type: energyType,
        energy_amount: energyAmount,
        tea_processed_amount: teaProcessedAmount,
        factory: userFactoryId,
      });

      if (result.success) {
        resetForm();
        setSuccessMessage("Record saved successfully.");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 3000);
      } else {
        setErrorMessage(result.message || "Failed to save record.");
      }
    } catch (error) {
      setErrorMessage("Failed to save record: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
      }}
    >
      <div className="bg-[#183040] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl md:text-2xl font-bold text-[#FFFFFF] mb-6">
          Add Record
        </h3>
        {successMessage && (
          <p className="mb-4 text-green-400 font-semibold">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mb-4 text-red-500 font-semibold">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <label className={labelClasses}>Energy Type</label>
            <div className="relative">
              <select
                value={energyType}
                onChange={(e) => setEnergyType(e.target.value)}
                className={`${formFieldClasses} appearance-none pr-10`}
                required
                disabled={isSaving}
              >
                {energyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#214A5A] mt-2">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClasses}>Energy Amount</label>
            <input
              type="number"
              value={energyAmount}
              onChange={(e) => setEnergyAmount(e.target.value)}
              className={formFieldClasses}
              placeholder="e.g., 500"
              required
              disabled={isSaving}
            />
          </div>

          <div className="mb-6">
            <label className={labelClasses}>Tea Processed Amount</label>
            <input
              type="number"
              value={teaProcessedAmount}
              onChange={(e) => setTeaProcessedAmount(e.target.value)}
              className={formFieldClasses}
              placeholder="e.g., 200"
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex justify-start gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-[#F79B72] text-[#FFFFFF] rounded hover:bg-[#C76C4C]"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 rounded text-[#FFFFFF] hover:text-[#F79B72]"
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalForm;
