import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

interface ServiceTask {
  id: number;
  description: string;
  cost?: number;
}

interface ServiceRecord {
  id: number;
  vehicleId: number;
  serviceStart: string;
  serviceEnd: string;
  totalCost?: number;
  tasks?: ServiceTask[];
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
}


const ServiceList = () => {
  const queryClient = useQueryClient();

  const { data: serviceRecords, isLoading, error } = useQuery<ServiceRecord[], Error>({
    queryKey: ["serviceRecords"],
    queryFn: async () => {
      const response = await api.get("/ServiceRecord");
      return response.data;
    },
  });

  const { data: vehicles = [] } = useQuery<Vehicle[], Error>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const res = await api.get("/Vehicle");
      return res.data;
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: number) => api.delete(`/ServiceRecord/${id}`),
    onSuccess: () => {
      toast.success("🗑️ Service deleted");
      queryClient.invalidateQueries({ queryKey: ["serviceRecords"] });
    },
    onError: () => toast.error("❌ Failed to delete service"),
  });

  const [sortConfig, setSortConfig] = useState<{ key: keyof ServiceRecord | null, direction: 'asc' | 'desc' }>({
    key: 'serviceStart',
    direction: 'asc',
  });
  

const handleSort = (key: keyof ServiceRecord) => {
  setSortConfig((prev) => {
    if (prev.key === key) {
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
    }
    return { key, direction: 'asc' };
  });
};

const sortedRecords = React.useMemo(() => {
  if (!serviceRecords || !sortConfig.key) return serviceRecords;

  const sorted = [...serviceRecords].sort((a, b) => {
    const aValue = a[sortConfig.key!];
    const bValue = b[sortConfig.key!];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return sorted;
}, [serviceRecords, sortConfig]);


  if (isLoading)
    return <div className="text-center text-lg py-10 text-gray-600">Loading service records...</div>;
  if (error) {
    toast.error("❌ Error loading service records");
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Service Records</h1>
      <div className="flex items-center gap-4 mb-4">
  <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
  <select
    id="sort"
    value={sortConfig.key + "_" + sortConfig.direction}
    onChange={(e) => {
      const [key, direction] = e.target.value.split("_");
      setSortConfig({
        key: key as keyof ServiceRecord,
        direction: direction as "asc" | "desc",
      });
    }}
    className="border px-3 py-1 rounded-md shadow-sm text-sm"
  >
    <option value="serviceStart_asc">Date ↑</option>
    <option value="serviceStart_desc">Date ↓</option>
    <option value="totalCost_asc">Cost ↑</option>
    <option value="totalCost_desc">Cost ↓</option>
    <option value="vehicleId_asc">Vehicle ID ↑</option>
    <option value="vehicleId_desc">Vehicle ID ↓</option>
  </select>
</div>

      {serviceRecords && serviceRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {sortedRecords?.map((record) => (
    <div
      key={record.id}
      className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
    >
      <div>
      <h3 className="text-lg font-semibold mb-1">
  {
    vehicles.find((v) => v.id === record.vehicleId)
      ? `${vehicles.find((v) => v.id === record.vehicleId)?.make} ${vehicles.find((v) => v.id === record.vehicleId)?.model}`
      : "Unknown Vehicle"
  }
</h3>

        <p className="text-sm text-gray-600 mb-1">
          <strong>Date:</strong>{" "}
          {new Date(record.serviceStart).toLocaleString("hr-HR")} –{" "}
          {new Date(record.serviceEnd).toLocaleTimeString("hr-HR")}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Total Cost:</strong> ${record.totalCost?.toFixed(2) ?? "N/A"}
        </p>

        {record.tasks && record.tasks.length > 0 ? (
          <div className="text-sm">
            <p className="font-semibold mb-1">Tasks:</p>
            <div className="max-h-40 overflow-y-auto pr-2">
  <ul className="list-disc ml-4 text-sm text-gray-700">
    {record.tasks.map((task) => (
      <li key={task.id}>
        {task.description} - ${task.cost?.toFixed(2) ?? "N/A"}
      </li>
    ))}
  </ul>
</div>

          </div>
        ) : (
          <p className="text-sm text-gray-400">No tasks</p>
        )}
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={() => deleteService.mutate(record.id)}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No service records found.</p>
      )}
    </div>
  );
};

export default ServiceList;
