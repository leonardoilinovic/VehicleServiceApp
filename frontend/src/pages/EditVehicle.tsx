import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<{
    id: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    clientId: number;
    client: { id: number; name: string; email: string; phoneNumber: string } | null;
  } | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/Vehicle/${id}`);
        console.log("🚀 API Response:", data);

        if (data.clientId) {
          const clientResponse = await api.get(`/Client/${data.clientId}`);
          setVehicle({ ...data, client: clientResponse.data });
        } else {
          setVehicle({ ...data, client: null });
        }
      } catch (error) {
        console.error("❌ Error fetching vehicle details:", error);
        toast.error("❌ Failed to fetch vehicle details");
        navigate("/vehicle-list");
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicle((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSaveChanges = async () => {
    if (!vehicle) {
      toast.error("Vehicle data is missing!");
      return;
    }

    if (!vehicle.clientId || vehicle.clientId <= 0 || !vehicle.client) {
      toast.error("Client information is missing or invalid!");
      return;
    }

    const vehicleData = {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: parseInt(vehicle.year.toString(), 10),
      licensePlate: vehicle.licensePlate,
      clientId: vehicle.clientId,
      client: { ...vehicle.client },
    };

    try {
      await api.put(`/Vehicle/${vehicle.id}`, vehicleData);
      toast.success("✅ Vehicle updated successfully!");
      navigate("/vehicle-list");
    } catch (error: any) {
      console.error("❌ Error updating vehicle:", error.response?.data);
      toast.error("❌ Error updating vehicle: " + (error.response?.data || "Unknown error"));
    }
  };

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Vehicle</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="block font-medium text-gray-700">Make:</label>
          <input
            type="text"
            name="make"
            value={vehicle.make}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none"
          />
        </div>
        <div className="col-span-1">
          <label className="block font-medium text-gray-700">Model:</label>
          <input
            type="text"
            name="model"
            value={vehicle.model}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none"
          />
        </div>
        <div className="col-span-1">
          <label className="block font-medium text-gray-700">Year:</label>
          <input
            type="number"
            name="year"
            value={vehicle.year}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none"
          />
        </div>
        <div className="col-span-1">
          <label className="block font-medium text-gray-700">License Plate:</label>
          <input
            type="text"
            name="licensePlate"
            value={vehicle.licensePlate}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none"
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">Client Information</h2>
      {vehicle.client ? (
        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <p><strong>Name:</strong> {vehicle.client.name}</p>
          <p><strong>Email:</strong> {vehicle.client.email}</p>
          <p><strong>Phone:</strong> {vehicle.client.phoneNumber}</p>
        </div>
      ) : (
        <p>🚨 No client assigned to this vehicle.</p>
      )}

      <button
        onClick={handleSaveChanges}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditVehicle;
