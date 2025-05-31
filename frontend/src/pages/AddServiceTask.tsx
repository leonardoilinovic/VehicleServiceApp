import React from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { toast } from "react-toastify";

interface ServiceTaskFormData {
  description: string;
  cost: number;
}

const AddServiceTask = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceTaskFormData>();

  const onSubmit = async (data: ServiceTaskFormData) => {
    try {
      await api.post("/ServiceTask", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Service task added successfully!");
      reset(); // Reset form fields after successful submission
    } catch (error: any) {
      console.error("Error adding service task:", error.response?.data || error.message);
      toast.error("Failed to add service task: " + (error.response?.data || error.message));
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Add Service Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <input
            type="text"
            {...register("description", { required: "Task description is required" })}
            placeholder="Enter task description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cost:</label>
          <input
            type="number"
            {...register("cost", { required: "Cost is required", min: { value: 0.01, message: "Cost must be greater than 0" } })}
            placeholder="Enter cost"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.cost && <p className="text-red-500 text-xs italic">{errors.cost.message}</p>}
        </div>
        
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddServiceTask;
