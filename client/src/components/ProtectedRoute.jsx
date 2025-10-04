import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        // Si no hay token, redirige a login
        return <Navigate to="/login" replace />;
    }

    // Si hay token, renderiza los hijos
    return children;
}
