// src/pages/Register.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/index';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
}

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError(null);
    try {
      await api.post('/auth/register', data);
      navigate('/home', { replace: true });
    } catch (error: any) {
      const resp = error.response?.data;
      if (resp?.errors) {
        const allErrors = Object.values(resp.errors).flat().join(' ');
        setRegisterError(allErrors);
      } else if (resp?.message) {
        setRegisterError(resp.message);
      } else {
        setRegisterError('Registration failed. Please check your input.');
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 w-full max-w-md mx-auto border-none"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

      {/* Full Name */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Full Name"
          {...register("fullName", { required: "Full name is required" })}
          className="w-full px-4 py-3 rounded-md border bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="w-full">
        <input
          type="email"
          placeholder="Email"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          className="w-full px-4 py-3 rounded-md border bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="w-full relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password", { 
            required: "Password is required",
            pattern: {
              // najmanje 6 znakova, barem 1 veliko slovo i 1 specijalni znak
              value: /^(?=.*[A-Z])(?=.*\W).{6,}$/,
              message: "Password must be ≥6 chars, include 1 uppercase & 1 special character"
            }
          })}
          className="w-full px-4 py-3 pr-10 rounded-md border bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-2 top-2.5 flex items-center justify-center h-8 w-8 text-gray-500 hover:text-gray-700"
        >
          {showPassword
            ? FaEyeSlash({ className: 'h-5 w-5' })
            : FaEye({ className: 'h-5 w-5' })
          }
        </button>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Global Registration Error */}
      {registerError && (
        <div className="w-full text-center py-2 bg-red-100 text-red-700 rounded-md">
          {registerError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Register
      </button>
    </motion.form>
  );
}

export default Register;
