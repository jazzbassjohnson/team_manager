import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        // Handle case when AuthContext is not provided
        return null;
    }

    const { isAuthenticated } = authContext;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
