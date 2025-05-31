import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api";
import Modal from "react-modal";
import { EventInput } from "@fullcalendar/core";
import { toast } from "react-toastify";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface ServiceTask {
  id: number;
  description: string;
  cost: number;
}

interface ServiceRecord {
  id: number;
  serviceStart: string;
  serviceEnd: string;
  totalCost: number;
  vehicleId: number;
  tasks: ServiceTask[];
  vehicle?: Vehicle;
}

Modal.setAppElement("#root");

const ServiceCalendar = () => {
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);


  const { data: serviceRecords = [], refetch: refetchServiceRecords } = useQuery<ServiceRecord[]>({
    queryKey: ["serviceRecords"],
    queryFn: async () => (await api.get("/ServiceRecord")).data || [],
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => (await api.get("/Vehicle")).data || [],
  });

  const { data: allTasks = [] } = useQuery<ServiceTask[]>({
    queryKey: ["serviceTasks"],
    queryFn: async () => (await api.get("/ServiceTask")).data || [],
  });

  const updateServiceTasks = useMutation({
    mutationFn: (data: { id: number; taskIds: number[] }) =>
      api.put(`/ServiceRecord/${data.id}/tasks`, data),
    onSuccess: () => {
      refetchServiceRecords();
      setServiceModalOpen(false);
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: number) => api.delete(`/ServiceRecord/${id}`),
    onSuccess: () => {
      refetchServiceRecords();
      setServiceModalOpen(false);
    },
  });

  useEffect(() => {
    if (selectedService) {
      setSelectedTaskIds(selectedService.tasks.map(task => task.id));
    }
  }, [selectedService]);

  const handleTaskToggle = (taskId: number) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSaveChanges = async () => {
    if (!selectedService) return;
  
    try {
      await updateServiceTasks.mutateAsync({
        id: selectedService.id,
        taskIds: selectedTaskIds,
      });
      toast.success("Tasks updated successfully!");
    } catch (error) {
      console.error("Error updating tasks:", error);
      toast.error("Failed to update tasks.");
    }
  };
  

  const handleDeleteService = async (id: number) => {
    if (!id) return;
  
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted successfully!");
      setDeleteConfirmOpen(false);
      setServiceModalOpen(false);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service.");
    }
  };
  
  

  const confirmDeleteService = (id: number) => {
    setRecordToDelete(id);
    setDeleteConfirmOpen(true);
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Service Calendar</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        events={serviceRecords.map((record) => {
          const vehicle = vehicles.find(v => v.id === record.vehicleId);
          return {
            id: record.id.toString(),
            title: vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle",
            start: record.serviceStart, 
            end: record.serviceEnd, 
            color: "#2563eb",
            textColor: "white",
            extendedProps: {
              ...record,
              vehicle,
            },
          };
        })}
        
        eventClick={(info) => {
          setSelectedService(info.event.extendedProps as ServiceRecord);
          setServiceModalOpen(true);
        }}
      />

<Modal
  isOpen={isServiceModalOpen}
  onRequestClose={() => setServiceModalOpen(false)}
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
  className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full z-[10000]"
>

        {selectedService && (
          <>
            <h2 className="text-2xl font-bold mb-4">Edit Service Tasks</h2>
            <div className="mb-4">
            <p><strong>Date:</strong> {new Date(selectedService.serviceStart).toLocaleString("hr-HR", {
            weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>

              <p><strong>Vehicle:</strong> {selectedService.vehicle?.make} {selectedService.vehicle?.model}</p>
            </div>

            <div className="border-t pt-4">
  <p className="font-semibold mb-2">Select Tasks:</p>
  <div className="max-h-60 overflow-auto border rounded p-2">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {allTasks.map((task) => {
        const isSelected = selectedTaskIds.includes(task.id);

        return (
          <div
            key={task.id}
            onClick={() => handleTaskToggle(task.id)}
            className={`cursor-pointer border rounded-md p-3 shadow-sm transition 
              ${isSelected ? "bg-blue-100 border-blue-500" : "bg-white hover:bg-gray-100"}`}
          >
            <h3 className="font-medium text-sm">{task.description}</h3>
            <p className="text-xs text-gray-600">${task.cost}</p>
          </div>
        );
      })}
    </div>
  </div>
</div>


            <div className="mt-6 flex justify-end space-x-2">
  <button
    className="px-4 py-2 bg-gray-200 rounded"
    onClick={() => setServiceModalOpen(false)}
  >
    Cancel
  </button>
  <button
    className="px-4 py-2 bg-red-500 text-white rounded"
    onClick={() => confirmDeleteService(selectedService!.id)}
  >
    Delete Service
  </button>
  <button
    className="px-4 py-2 bg-blue-500 text-white rounded"
    onClick={handleSaveChanges}
  >
    Save Changes
  </button>
</div>

          </>
        )}
      </Modal>

      <Modal
  isOpen={isDeleteConfirmOpen}
  onRequestClose={() => setDeleteConfirmOpen(false)}
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
  className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full z-[10000]"
>
  <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
  <p>Are you sure you want to delete this service record?</p>
  <div className="mt-6 flex justify-end gap-2">
    <button
      onClick={() => setDeleteConfirmOpen(false)}
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
    >
      Cancel
    </button>
    <button
      onClick={() => handleDeleteService(recordToDelete!)}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Delete
    </button>
  </div>
</Modal>

    </div>
  );
};

export default ServiceCalendar;
