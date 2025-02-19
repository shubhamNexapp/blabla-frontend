import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {

    const role = JSON.parse(localStorage.getItem("authUser"))?.role

    console.log(allowedRoles, role)
    return allowedRoles.includes(role) ? element : <Navigate to="/unauthorized" />;
};

export default PrivateRoute