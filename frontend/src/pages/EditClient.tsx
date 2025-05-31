import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Client {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

const EditClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Client>();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { data } = await api.get(`/Client/${id}`);
        reset(data);  // Sets form values based on fetched client
      } catch (error) {
        console.error("Error fetching client details", error);
        toast.error('Failed to fetch client details');
      }
    };

    fetchClient();
  }, [id, reset]);

  const onSubmit = async (data: Client) => {
    try {
      await api.put(`/Client/${id}`, data);
      toast.success('Client updated successfully!');
      navigate("/client-list");
    } catch (error) {
      console.error("Error updating client", error);
      toast.error('Failed to update client');
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-8 rounded-lg shadow bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">Edit Client</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Name:</label>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Email:</label>
          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Phone Number:</label>
          <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register("phoneNumber", { required: "Phone number is required" })} />
          {errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditClient;
