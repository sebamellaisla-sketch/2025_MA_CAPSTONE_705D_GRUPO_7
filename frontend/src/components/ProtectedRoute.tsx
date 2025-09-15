import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: JSX.Element;
  role?: "admin" | "client";
};

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  if (!user) {
    // No está logueado → redirigir a login
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Está logueado pero no tiene el rol requerido
    return <Navigate to="/" replace />;
  }

  return children;
}