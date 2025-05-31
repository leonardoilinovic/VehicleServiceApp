import React from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Client {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
}

const AddClient: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Client>();

  const onSubmit = async (data: Client) => {
    try {
      await api.post("/Client", data);
      toast.success("✅ Client added successfully!");
      reset();
    } catch (error) {
      alert("Failed to add client");
      console.error("Error adding client:", error);
      toast.error("Error adding client");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Client</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Name:</label>
          <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Email:</label>
          <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Phone Number:</label>
          <input type="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" {...register("phoneNumber", { required: "Phone number is required" })} />
          {errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Client</button>
      </form>
    </div>
  );
};

export default AddClient;
