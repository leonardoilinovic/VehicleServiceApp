import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Vehicle, Client, ServiceTask } from '../types';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface ServiceRecord {
  id: number;
  serviceStart: string;
  serviceEnd: string;
  totalCost: number;
  vehicleId: number;
  tasks: ServiceTask[];
}

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: vehicleData } = await api.get(`/Vehicle/${id}`);
        setVehicle(vehicleData);
  
        if (vehicleData.clientId) {
          const { data: clientData } = await api.get(`/Client/${vehicleData.clientId}`);
          setClient(clientData);
        }
  
        const { data: allServices } = await api.get('/ServiceRecord');
        const filteredServices = allServices.filter((s: any) => s.vehicleId === Number(id));
        setServiceRecords(filteredServices);
      } catch (error) {
        console.error('Error loading vehicle details:', error);
        toast.error("Failed to load vehicle details.");
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleDelete = async () => {
      try {
        await api.delete(`/Vehicle/${id}`);
        toast.success("Vehicle deleted successfully.");
        navigate('/vehicle-list');
      } catch (error) {
        console.error('Error deleting vehicle', error);
        toast.error("Failed to delete vehicle.");
      }
  };
  

  const deleteServiceRecord = async (serviceId: number) => {
  
    try {
      await api.delete(`/ServiceRecord/${serviceId}`);
      setServiceRecords((prev) => prev.filter((s) => s.id !== serviceId));
      toast.success("Service deleted successfully.");
    } catch (error) {
      console.error("Error deleting service", error);
      toast.error("Failed to delete service.");
    }
  };
  
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      {vehicle ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Vehicle Details</h1>

          <p className="text-lg mb-4">
            <strong>Make & Model:</strong> {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
          <p className="mb-4"><strong>License Plate:</strong> {vehicle.licensePlate}</p>

          {client && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Client Info</h2>
              <p><strong>Name:</strong> {client.name}</p>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phoneNumber}</p>
            </div>
          )}

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>

          <h2 className="text-xl font-bold mb-3">Service Records</h2>
          {serviceRecords.length === 0 ? (
            <p className="text-gray-500">No service records for this vehicle.</p>
          ) : (
            <div className="space-y-4">
              {serviceRecords.map((record) => (
  <div
    key={record.id}
    className="flex items-center justify-between p-2 border-b"
  >
    {/* Lijevi dio: detalji o servisu */}
    <div className="flex-grow">
      <p className="text-sm">
        <strong>Date:</strong>{" "}
        {new Date(record.serviceStart).toLocaleString()} –{" "}
        {new Date(record.serviceEnd).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Cost:</strong> ${record.totalCost}
      </p>

      {/* ✅ DODAJ OVDJE PRIKAZ TASKOVA */}
      {record.tasks && record.tasks.length > 0 && (
        <ul className="mt-2 ml-4 list-disc text-sm text-gray-700">
          {record.tasks.map((task) => (
            <li key={task.id}>
              {task.description} (${task.cost})
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Desni dio: gumb */}
    <div className="ml-2">
      <button
        onClick={() => deleteServiceRecord(record.id)}
        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
      >
        🗑
      </button>
    </div>
  </div>
))}



            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VehicleDetails;
