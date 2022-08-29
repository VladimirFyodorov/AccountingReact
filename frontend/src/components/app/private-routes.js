import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const isLOggedIn = sessionStorage.getItem('status') == 'loggedIn';
  return (
    isLOggedIn? <Outlet/>: <Navigate to='/login'/>
  );
};

export default PrivateRoutes;