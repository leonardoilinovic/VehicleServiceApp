import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function AuthForm() {
  const [isLoginActive, setIsLoginActive] = useState(true);

  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[50vh]">
  <div className="relative z-10 w-[95%] max-w-md mx-auto">
    <div className="bg-white shadow-lg rounded-lg w-full px-4 sm:px-6">
          <div className="flex justify-center mb-6 pt-6 space-x-4">
            <button
              className={`py-2 px-6 sm:px-7 rounded-full transform transition-all duration-200 font-semibold text-sm 
                ${isLoginActive
                  ? "bg-blue-600 text-white scale-105 shadow-lg"
                  : "bg-blue-200 text-blue-700 scale-90 shadow-none hover:bg-blue-300"
                }`}
              onClick={() => setIsLoginActive(true)}
            >
              Login
            </button>

            <button
              className={`py-2 px-6 sm:px-7 rounded-full transform transition-all duration-200 font-semibold text-sm 
                ${!isLoginActive
                  ? "bg-blue-600 text-white scale-105 shadow-lg"
                  : "bg-blue-200 text-blue-700 scale-90 shadow-none hover:bg-blue-300"
                }`}
              onClick={() => setIsLoginActive(false)}
            >
              Register
            </button>
          </div>

          <div className="p-4 sm:p-6 pt-0">
            {isLoginActive ? <Login /> : <Register />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;