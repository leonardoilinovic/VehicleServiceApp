import React, { useState } from "react";
import api from "../api";
import { useQuery, useMutation } from "@tanstack/react-query";
import Modal from "react-modal";
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



// Set App Element for Modals
Modal.setAppElement("#root");

// Definition of model interfaces
interface Client {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  clientId: number;
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
}


interface CreateServiceRecordDto {
  serviceStart: string;
  serviceEnd: string;
  totalCost: number;
  vehicleId: number;
  taskIds: number[];
}



const ServiceDashboard = () => {

  const [selectedServiceDetails, setSelectedServiceDetails] = useState<any | null>(null);
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isVehicleModalOpen, setVehicleModalOpen] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState<number | "">("");
  const [vehicleLicense, setVehicleLicense] = useState("");

  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);

  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState("");

  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);


  const { data: clients = [], refetch: refetchClients } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => (await api.get("/Client")).data || [],
  });
  

  const { data: vehicles = [], refetch: refetchVehicles } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => (await api.get("/Vehicle")).data || [],
  });

  const { data: tasks = [] } = useQuery<ServiceTask[]>({
    queryKey: ["serviceTasks"],
    queryFn: async () => (await api.get("/ServiceTask")).data || [],
  });
  

  const { data: serviceRecords = [], refetch: refetchServiceRecords } = useQuery<ServiceRecord[]>({
    queryKey: ["serviceRecords"],
    queryFn: async () => {
      const response = await api.get("/ServiceRecord");
      return response.data.map((record: any) => ({
        id: record.id,
        serviceStart: record.serviceStart,
        serviceEnd: record.serviceEnd,
        totalCost: record.totalCost,
        vehicleId: record.vehicleId,
        tasks: record.tasks.map((task: any) => ({
          id: task.id,
          description: task.description,
          cost: task.cost,
        })),
      }));
    },
  });
  
  
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );
  
  

  const filteredVehicles = vehicles
  .filter((vehicle) => vehicle.clientId === selectedClient)
  .filter((vehicle) =>
    `${vehicle.make} ${vehicle.model} ${vehicle.licensePlate}`
      .toLowerCase()
      .includes(vehicleSearchTerm.toLowerCase())
  );


  const addClient = useMutation<Client, Error, Omit<Client, "id">>({
    mutationFn: async (newClient) => {
      const response = await api.post<Client>("/Client", newClient);
      return response.data;
    },
    onSuccess: () => refetchClients(),
  });

  const addVehicle = useMutation<Vehicle, Error, Omit<Vehicle, "id">>({
    mutationFn: async (newVehicle) => {
      const response = await api.post<Vehicle>("/Vehicle", newVehicle);
      return response.data;
    },
    onSuccess: () => refetchVehicles(),
  });

  const addService = useMutation<ServiceRecord, Error, CreateServiceRecordDto>({
    mutationFn: async (newService) => {
      const response = await api.post<ServiceRecord>("/ServiceRecord", newService);
      return response.data;
    },
    onSuccess: async () => {
      await refetchServiceRecords();
      await refetchClients();
      await refetchVehicles();
    },
  });
  
  

  const handleTaskChange = (taskId: number, taskCost: number, checked: boolean) => {
    setSelectedTasks((prevTasks) =>
      checked ? [...prevTasks, taskId] : prevTasks.filter((id) => id !== taskId)
    );

    setTotalCost((prevTotal) =>
      checked ? prevTotal + taskCost : prevTotal - taskCost
    );
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addClient.mutateAsync({
        name: clientName,
        email: clientEmail,
        phoneNumber: clientPhone,
      });
      setSelectedClient(response.id);
      await refetchClients();
      setClientModalOpen(false);
      setClientName("");
      setClientEmail("");
      setClientPhone("");

      toast.success("Client added successfully!");
    } catch (error) {
      toast.error("Error adding client!");
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      toast.error("Please select a client before adding a vehicle!");
      return;
    }
    try {
      const response = await addVehicle.mutateAsync({
        make: vehicleMake,
        model: vehicleModel,
        year: Number(vehicleYear),
        licensePlate: vehicleLicense,
        clientId: selectedClient,
      });
      setSelectedVehicle(response.id);
      await refetchVehicles();
      setVehicleModalOpen(false);
      setVehicleMake("");
      setVehicleModel("");
      setVehicleYear("");
      setVehicleLicense("");

      toast.success("Vehicle added successfully!");
    } catch (error) {
      toast.error("Error adding vehicle!");
    }
  };

  const handleSaveService = async () => {
    if (!selectedClient) return toast.error("Please select a client first!");
    if (!selectedVehicle) return toast.error("Please select a vehicle first!");
    if (selectedTasks.length === 0) return toast.error("Select at least one service task!");
    if (!selectedRange) return toast.error("Please select a time range from the calendar!");
  
    try {
        await addService.mutateAsync({
        serviceStart: selectedRange.start,
        serviceEnd: selectedRange.end,
        totalCost,
        vehicleId: selectedVehicle!,
        taskIds: selectedTasks,
      });
  
      toast.success("Service saved successfully!");

      setSelectedTasks([]);
      setTotalCost(0);
      setSelectedRange(null);
  
      await refetchServiceRecords();
    } catch (error) {
      toast.error("Error saving service!");
    }
  };
  
  
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Service Dashboard</h1>
  
      {/* Client selection */}
      <div className="mb-4">
  <h2 className="font-semibold">Client</h2>

  <div className="relative">
    <input
      type="text"
      placeholder="Search clients..."
      value={clientSearchTerm}
      onChange={(e) => setClientSearchTerm(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
      onFocus={() => setClientDropdownOpen(true)}
      onBlur={() => setTimeout(() => setClientDropdownOpen(false), 150)} // spriječi prerano zatvaranje
    />

    {clientDropdownOpen && (
      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-auto shadow-md">
        {filteredClients.length === 0 && (
          <li className="px-4 py-2 text-gray-500">No results</li>
        )}
        {filteredClients.map((client) => (
          <li
            key={client.id}
            onClick={() => {
              setSelectedClient(client.id);
              setClientSearchTerm(client.name);
              setClientDropdownOpen(false);
              setSelectedVehicle(null); // reset vozilo kad se mijenja klijent
              setVehicleSearchTerm(""); // i search za vozilo
            }}
            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
          >
            {client.name}
          </li>
        ))}
      </ul>
    )}
  </div>

  <button
    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    onClick={() => setClientModalOpen(true)}
  >
    ➕ Add Client
  </button>
</div>

  
      {/* Vehicle selection */}
      <div className="mb-4">
  <h2 className="font-semibold">Vehicle</h2>

  <div className="relative">
    <input
      type="text"
      placeholder="Search vehicles..."
      value={vehicleSearchTerm}
      onChange={(e) => setVehicleSearchTerm(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
      onFocus={() => setVehicleDropdownOpen(true)}
      onBlur={() => setTimeout(() => setVehicleDropdownOpen(false), 150)} // delay to allow click
      disabled={!selectedClient} // spriječi search ako klijent nije odabran
    />

    {vehicleDropdownOpen && (
      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-auto shadow-md">
        {filteredVehicles.length === 0 && (
          <li className="px-4 py-2 text-gray-500">No results</li>
        )}
        {filteredVehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            onClick={() => {
              setSelectedVehicle(vehicle.id);
              setVehicleSearchTerm(`${vehicle.make} ${vehicle.model}`);
              setVehicleDropdownOpen(false);
            }}
            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
          >
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </li>
        ))}
      </ul>
    )}
  </div>

  <button
    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    onClick={() => setVehicleModalOpen(true)}
    disabled={!selectedClient}
  >
    ➕ Add Vehicle
  </button>
</div>

  
      {/* Service tasks selection */}
      <div className="mb-4">
        <h2 className="font-semibold">Service Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg shadow-sm cursor-pointer ${
                selectedTasks.includes(task.id) ? 'bg-blue-100 border-blue-500' : 'bg-white'
              }`}
              onClick={() => handleTaskChange(task.id, task.cost, !selectedTasks.includes(task.id))}
            >
              <h3 className="text-lg font-semibold">{task.description}</h3>
              <p className="text-sm text-gray-600">Cost: ${task.cost}</p>
            </div>
          ))}
        </div>
      </div>
  
      {/* Service details */}
      <div className="mb-4">
  <h2 className="font-semibold">Service Details</h2>

  {selectedRange ? (
  <p className="mt-2 px-3 py-2 bg-blue-100 rounded-md border border-blue-300">
    Selected Time: <strong>{new Date(selectedRange.start).toLocaleString()}</strong> – <strong>{new Date(selectedRange.end).toLocaleString()}</strong>
  </p>
) : (
  <p className="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-300">
    Click a time range on the calendar to schedule a service.
  </p>
)}


  <input
    type="number"
    className="block w-full px-3 py-2 mt-3 bg-white border border-gray-300 rounded-md shadow-sm"
    value={totalCost}
    readOnly
  />

  <button
    className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    onClick={handleSaveService}
  >
    Save Service
  </button>
</div>


  
      {/* FullCalendar integration */}
      <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
  initialView="timeGridWeek"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  }}
  slotMinTime="06:00:00"
  slotMaxTime="22:00:00"
  selectable={true}
  selectMirror={true}
  editable={true}
  weekends={true}
  events={[
    ...serviceRecords.map((record) => {
      const vehicle = vehicles.find((v) => v.id === record.vehicleId);
      return {
        title: vehicle
          ? `${vehicle.make} ${vehicle.model} - $${record.totalCost}`
          : `Servis - $${record.totalCost}`,
        start: record.serviceStart,
        end: record.serviceEnd,
        color: 'blue',
        textColor: 'white',
        extendedProps: {
          vehicleId: record.vehicleId,
          totalCost: record.totalCost,
          tasks: record.tasks,
        },
      };
    }),
    selectedRange && {
      title: 'Selected Slot',
      start: selectedRange.start,
      end: selectedRange.end,
      color: '#bfdbfe',
      textColor: 'black',
    },
  ].filter(Boolean) as EventInput[]}
  
  
  select={(info) => {
    setSelectedRange({ start: info.startStr, end: info.endStr });
  }}
  
  eventClick={(info) => {
    const { vehicleId, totalCost, tasks } = info.event.extendedProps;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const client = clients.find(c => c.id === vehicle?.clientId);

    setSelectedServiceDetails({
      date: info.event.startStr,
      vehicle,
      client,
      tasks: tasks || [],
      totalCost,
    });

    setServiceModalOpen(true);
  }}
/>





  
      {/* Client and Vehicle modals */}
      <Modal
  isOpen={isClientModalOpen}
  onRequestClose={() => setClientModalOpen(false)}
  className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[10000]"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
>
        <div className="bg-white p-8 rounded-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Add Client</h2>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Name:</label>
              <input
                type="text"
                placeholder="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Email:</label>
              <input
                type="email"
                placeholder="Email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Phone:</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setClientModalOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none">
                Cancel
              </button>
              <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none">
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
  isOpen={isVehicleModalOpen}
  onRequestClose={() => setVehicleModalOpen(false)}
  className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[10000]"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
>
        <div className="bg-white p-8 rounded-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Make:</label>
              <input
                type="text"
                placeholder="Make"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Model:</label>
              <input
                type="text"
                placeholder="Model"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Year:</label>
              <input
                type="number"
                placeholder="Year"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(Number(e.target.value))}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">License Plate:</label>
              <input
                type="text"
                placeholder="License Plate"
                value={vehicleLicense}
                onChange={(e) => setVehicleLicense(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setVehicleModalOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none">
                Cancel
              </button>
              <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none">
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isServiceModalOpen}
        onRequestClose={() => setServiceModalOpen(false)}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
        className="fixed inset-0 flex justify-center items-center z-[10000]"
      >


  <div className="bg-white p-8 rounded-lg max-w-md w-full">
    <h2 className="text-xl font-bold mb-4">Detalji Servisa</h2>
    
    {selectedServiceDetails && (
      <div className="space-y-3 text-gray-800">
        <p><strong>Datum servisa:</strong> {new Date(selectedServiceDetails.date).toLocaleDateString()}</p>
        <p><strong>Vozilo:</strong> {selectedServiceDetails.vehicle?.make} {selectedServiceDetails.vehicle?.model} ({selectedServiceDetails.vehicle?.year})</p>
        <p><strong>Registracija:</strong> {selectedServiceDetails.vehicle?.licensePlate}</p>
        <p><strong>Klijent:</strong> {selectedServiceDetails.client?.name} ({selectedServiceDetails.client?.email}, {selectedServiceDetails.client?.phoneNumber})</p>
        <div>
          <strong>Zadaci:</strong>
          <ul className="list-disc list-inside ml-4">
            {selectedServiceDetails.tasks?.map((task: ServiceTask) => (
              <li key={task.id}>{task.description} - ${task.cost}</li>
            ))}
          </ul>
        </div>
        <p><strong>Ukupna cijena:</strong> ${selectedServiceDetails.totalCost}</p>
      </div>
    )}

    <div className="mt-6 text-right">
      <button
        onClick={() => setServiceModalOpen(false)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Zatvori
      </button>
    </div>
  </div>
</Modal>


    </div>
  );
}

export default ServiceDashboard;
