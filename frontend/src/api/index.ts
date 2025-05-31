// frontend/src/api/index.ts
import axios, { AxiosError } from 'axios';

// Promijeni ovu liniju! Dodaj '/api' na kraj URL-a
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5001') + '/api'; 

const api = axios.create({
  baseURL: API_BASE_URL, // Sada će biti npr. http://localhost:5001/api
});

// Ostatak tvog koda ostaje isti
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
    }
    return Promise.reject(error);
  }
);

// DELETE metoda za ServiceRecord
export const deleteServiceRecord = async (id: number) => {
  const response = await api.delete(`/ServiceRecord/${id}`);
  return response.data;
};

export interface UpdateServiceRecordDto {
  serviceDate: string;
  totalCost: number;
  vehicleId: number;
  taskIds: number[];
}

export interface ServiceTask {
  id: number;
  description: string;
  cost: number;
}

export interface ServiceRecord {
  id: number;
  serviceStart: string;
  serviceEnd: string;
  totalCost: number;
  vehicleId: number;
  tasks: ServiceTask[];
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  clientId: number;
}

export const updateServiceRecord = async (id: number, data: UpdateServiceRecordDto) => {
  const response = await api.put(`/ServiceRecord/${id}`, data);
  return response.data;
};

export default api;