// src/pages/Login.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from "../api/index";
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();
  
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      const response = await api.post('/auth/login', data);
      const token = response.data?.token;
      if (!token) {
        setLoginError('Invalid email or password. Please try again.');
        return;
      }
      localStorage.setItem('jwtToken', token);
      window.location.href = '/home';
    } catch (error: any) {
      if (error.response?.status === 401) {
        setLoginError('Invalid email or password. Please try again.');
      } else {
        setLoginError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <motion.form 
      action="#"
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 w-full max-w-md mx-auto border-none"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
      
      {/* Email Input */}
      <div className="w-full">
        <input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          className="w-full px-4 py-3 rounded-md border bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="w-full relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
          className="w-full px-4 py-3 pr-10 rounded-md border bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
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
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Login Error Message */}
      {loginError && (
        <div className="w-full text-center py-2 bg-red-100 text-red-700 rounded-md">
          {loginError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>
    </motion.form>
  );
}

export default Login;