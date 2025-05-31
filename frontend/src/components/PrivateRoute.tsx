// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isLoggedIn = !!localStorage.getItem('jwtToken');  // Provjerite da li je korisnik prijavljen

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth" replace />;  // Ako nije, preusmjerite na stranicu za prijavu
};

export default PrivateRoute;
