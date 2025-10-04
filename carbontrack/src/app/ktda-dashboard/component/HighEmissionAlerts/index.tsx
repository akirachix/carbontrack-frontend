import React from "react";
type Alert = {
  factoryName: string;
  emissionPerKg: number;
  complianceTarget: number;
  totalEmissions: number;
  teaProcessedKg: number;
  timestamp?: string | Date;
};
type Alertmodel = {
  onClose: () => void;
  alerts: Alert[];
  onAlertViewed?: (viewedAlert: Alert) => void;
  viewedFactories: string[];
};
export default function AlertModal({
  onClose,
  alerts,
  onAlertViewed = () => {},
  viewedFactories,
}: Alertmodel) {
  return (
    <div className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button
          className="text-white text-xl font-bold float-right cursor-pointer"
          onClick={onClose}
          aria-label="Close alert modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-white">High Emission Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-white">No factories are exceeding the emission threshold.</p>
        ) : (
          <ul className="space-y-3 text-white">
            {alerts.map((alert, index) => {
              const isViewed = viewedFactories.includes(alert.factoryName);
              const date =
                alert.timestamp instanceof Date
                  ? alert.timestamp
                  : alert.timestamp
                  ? new Date(alert.timestamp)
                  : null;
              return (
                <li
                  key={index}
                  className={`p-3 rounded-md relative cursor-pointer min-h-[100px] transition-colors duration-200 ${
                    isViewed ? "bg-gray-700" : "bg-gray-500"
                  }`}
                  onClick={() => onAlertViewed(alert)}
                >
                  <p className="font-semibold">{alert.factoryName}</p>
                  <p>
                    Emission per kg of tea: {alert.emissionPerKg.toFixed(4)} (Target: {alert.complianceTarget.toFixed(4)})
                  </p>
                  <p>Total emissions: {alert.totalEmissions.toFixed(2)} kg CO₂e</p>
                  <p>Tea processed: {alert.teaProcessedKg.toFixed(2)} kg</p>
                  <span className="absolute right-2 bottom-2 text-xs text-red-500 italic select-none z-10">
                    {date ? date.toLocaleString() : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
