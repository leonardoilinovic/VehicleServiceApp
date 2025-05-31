import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Client {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('nameAsc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/Client');
      setClients(data.$values || data);
    } catch (error) {
      console.error('Failed to fetch clients', error);
      toast.error('❌ Failed to fetch clients');
    }
  };

  const deleteClient = async (id: number) => {
      try {
        await api.delete(`/Client/${id}`);
        fetchClients(); // Refresh list
        toast.success('🗑️ Client deleted');
      } catch (error) {
        console.error('Failed to delete client', error);
        toast.error('❌ Failed to delete client');
      }
  };

  const filteredAndSortedClients = clients
    .filter(client =>
      client.name.toLowerCase().includes(filter.toLowerCase()) ||
      client.email.toLowerCase().includes(filter.toLowerCase()) ||
      client.phoneNumber.includes(filter)
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'nameAsc': return a.name.localeCompare(b.name);
        case 'nameDesc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Clients List</h1>

      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg w-full"
      />

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg"
      >
        <option value="nameAsc">Name Ascending</option>
        <option value="nameDesc">Name Descending</option>
      </select>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedClients.map(client => (
              <tr key={client.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {client.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {client.email}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {client.phoneNumber}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => navigate(`/edit-client/${client.id}`)}
                    className="text-blue-500 hover:text-blue-800 mr-2 px-3 py-1 border border-blue-500 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="text-red-500 hover:text-red-800 px-3 py-1 border border-red-500 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
