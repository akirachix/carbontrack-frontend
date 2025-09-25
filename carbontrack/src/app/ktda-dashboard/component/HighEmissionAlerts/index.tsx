import React from "react";
type Alert = {
  factoryName: string;
  emissionPerKg: number;
  complianceTarget: number;
  totalEmissions: number;
  teaProcessedKg: number;
};
type Alertmodel = {
  onClose: () => void;
  alerts: Alert[];
};
export default function AlertModal({ onClose, alerts }: Alertmodel) {
  return (
    <div className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
        <button
          className="text-white text-xl font-bold float-right"
          onClick={onClose}
          aria-label="Close alert modal">
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-white">High Emission Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-white">No factories exceeding the emission threshold.</p>
        ) : (
          <ul className="space-y-3 text-white">
            {alerts.map((alert, index) => (
              <li key={index} className="p-3 bg-gray-700 rounded-md">
                <p className="font-semibold">{alert.factoryName}</p>
                <p>
                  Emission per kg tea: {alert.emissionPerKg.toFixed(4)} (Target: {alert.complianceTarget.toFixed(4)})
                </p>
                <p>Total emissions: {alert.totalEmissions.toFixed(2)} kg CO₂e</p>
                <p>Tea processed: {alert.teaProcessedKg.toFixed(2)} kg</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}