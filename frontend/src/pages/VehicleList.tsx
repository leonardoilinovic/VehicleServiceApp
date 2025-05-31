import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Vehicle } from '../types';

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/Vehicle');
        if (Array.isArray(response.data)) {
          setVehicles(response.data);
        } else if (response.data?.$values) {
          setVehicles(response.data.$values); // fallback za stare slučajeve
        } else {
          setVehicles([]);
        }
        
      } catch (error) {
        console.error('Error fetching vehicles', error);
      }
    };
  
    fetchVehicles();
  }, []);
  
  // Filtriranje vozila prema kriteriju
  const filteredVehicles = vehicles.filter(
    v => v.make.toLowerCase().includes(filter.toLowerCase()) || v.model.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Vehicles</h1>
      <input
        className="mb-4 w-full p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Search by make or model"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredVehicles.map(vehicle => (
        <div key={vehicle.id} 
             className="p-4 mb-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer rounded shadow"
             onClick={() => navigate(`/vehicle-details/${vehicle.id}`)}>
          <span className="font-medium">{vehicle.make} {vehicle.model} - {vehicle.year}</span>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;
