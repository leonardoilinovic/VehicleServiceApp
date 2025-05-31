import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/Navbar";
import ServiceList from "./pages/ServiceList";
import VehicleList from "./pages/VehicleList";
import VehicleDetails from "./pages/VehicleDetails";
import EditVehicle from "./pages/EditVehicle";
import AddClient from "./pages/AddClient";
import AddServiceTask from "./pages/AddServiceTask";
import ServiceDashboard from "./pages/ServiceDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ClientList from './pages/ClientList';
import EditClient from './pages/EditClient';
import ServiceCalendar from './components/ServiceCalendar';
import AuthForm from "./pages/AuthForm";
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <MainLayout>
      <div className="mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthForm />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/service-list" element={<ServiceList />} />
            <Route path="/vehicle-list" element={<VehicleList />} />
            <Route path="/vehicle-details/:id" element={<VehicleDetails />} />
            <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
            <Route path="/add-client" element={<AddClient />} />
            <Route path="/add-service-task" element={<AddServiceTask />} /> 
            <Route path="/service-dashboard" element={<ServiceDashboard />} />
            <Route path="/client-list" element={<ClientList />} />
            <Route path="/edit-client/:id" element={<EditClient />} />
            <Route path="/service-calendar" element={<ServiceCalendar />} />
          </Route>
        </Routes>
      </div>

      {/* Dodan ToastContainer za notifikacije */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      </MainLayout>
    </Router>
  );
}

export default App;