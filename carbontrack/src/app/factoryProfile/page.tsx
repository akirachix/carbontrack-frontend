"use client";

import React, { useState, useEffect } from "react";
import useFactoryProfile from "../hooks/useFetchFactoryProfile";
import Sidebar from "../sharedComponents/FactorySidebar";
import { UserType } from "../hooks/useFetchFactoryProfile";

export default function FactoryProfilePage() {
  const { user, factory, loading, error, saveUser } = useFactoryProfile();
  const [editMode, setEditMode] = useState(false);

  
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone_number: user.phone_number ?? "",
        password: "",
        user_type: user.user_type ?? "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const factoryId = localStorage.getItem("factoryId");
      const dataToSave: Partial<UserType> = {
        ...formData,
        factory: factoryId ? Number(factoryId) : user?.factory ?? null,
      };
      if (!dataToSave.password) {
        delete dataToSave.password;
      }
      await saveUser(dataToSave);
      setEditMode(false);
    } catch (error) {
      setSaveError((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-300 p-6">Loading...</p>;
  if (error) return <p className="text-red-400 p-6">Error: {error}</p>;

  return (
    <div className="flex space-x-20 bg-black min-h-screen w-screen text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto max-w-[55%] mt-10">
        <h2 className="text-4xl font-bold mb-4">Factory Profile</h2>

        {user && (
          <>
            <h3 className="text-xl mb-2">Manager Details</h3>

            <div className="mb-4 flex items-center space-x-6">
              <label htmlFor="first_name" className="font-bold w-36 text-left">
                First Name:
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                readOnly={!editMode}
                value={formData.first_name || ""}
                onChange={handleChange}
                className={`bg-gray-800 text-white flex-1 p-2 rounded ${
                  editMode ? "border border-blue-500" : ""
                }`}
              />
            </div>

            <div className="mb-4 flex items-center space-x-6">
              <label htmlFor="last_name" className="font-bold w-36 text-left">
                Last Name:
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                readOnly={!editMode}
                value={formData.last_name || ""}
                onChange={handleChange}
                className={`bg-gray-800 text-white flex-1 p-2 rounded ${
                  editMode ? "border border-blue-500" : ""
                }`}
              />
            </div>

            <div className="mb-4 flex items-center space-x-6">
              <label htmlFor="email" className="font-bold w-36 text-left">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                readOnly={!editMode}
                value={formData.email || ""}
                onChange={handleChange}
                className={`bg-gray-800 text-white flex-1 p-2 rounded ${
                  editMode ? "border border-blue-500" : ""
                }`}
              />
            </div>

            <div className="mb-4 flex items-center space-x-6">
              <label htmlFor="phone_number" className="font-bold w-36 text-left">
                Phone:
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                readOnly={!editMode}
                value={formData.phone_number || ""}
                onChange={handleChange}
                className={`bg-gray-800 text-white flex-1 p-2 rounded ${
                  editMode ? "border border-blue-500" : ""
                }`}
              />
            </div>

            {editMode && (
              <>
                <div className="mb-4 flex items-center space-x-6">
                  <label htmlFor="password" className="font-bold w-36 text-left">
                    Password:
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="bg-gray-800 text-white flex-1 p-2 rounded border border-blue-500"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="mb-4 flex items-center space-x-6">
                  <label htmlFor="user_type" className="font-bold w-36 text-left">
                    User Role:
                  </label>
                  <select
                    id="user_type"
                    name="user_type"
                    value={formData.user_type || ""}
                    onChange={handleChange}
                    className="bg-gray-800 text-white flex-1 p-2 rounded border border-blue-500"
                  >
                    <option value="">Select role</option>
                    <option value="manager">manager</option>
                    <option value="factory">factory</option>
                  </select>
                </div>
              </>
            )}

            {saveError && <p className="text-red-400 mb-2">Error saving: {saveError}</p>}

            {!editMode ? (
              <button
                className="bg-[#F79B72] px-4 py-2 rounded hover:bg-[#2A4759] ml-[91%]"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2 ml-[79%]">
                <button
                  className="bg-[#F79B72] px-4 py-2 rounded hover:bg-[#2A4759]"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                  disabled={saving}
                  onClick={() => {
                    setEditMode(false);
                    if (user) {
                      setFormData({
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone_number: user.phone_number,
                        password: "",
                        user_type: user.user_type ?? "",
                      });
                    }
                    setSaveError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

        {factory && (
          <div className="mt-8">
            <h3 className="text-xl mb-2">Factory Details</h3>
            <div className="mb-4 flex items-center space-x-6">
              <label htmlFor="factoryName" className="font-bold w-36 text-left">
                Factory Name:
              </label>
              <input
                id="factoryName"
                type="text"
                readOnly
                value={factory.factory_name}
                className="bg-gray-800 text-white flex-1 p-2 rounded"
              />
            </div>
            <div className="mb-4 flex items-center space-x-6">
              <label htmlFor="location" className="font-bold w-36 text-left">
                Location:
              </label>
              <input
                id="location"
                type="text"
                readOnly
                value={factory.factory_location}
                className="bg-gray-800 text-white flex-1 p-2 rounded"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
