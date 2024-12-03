import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth, cargando } = useAuth();

  // Mientras estamos cargando la autenticación, no hacemos nada
  if (cargando) {
    return <div>Loading...</div>; // O algún spinner de carga
  }

  // Si no está autenticado o no tiene un rol
  if (!auth || !auth.role) {
    return <Navigate to="/" />; // Redirige al login si no está autenticado
  }

  // Si el usuario tiene el rol adecuado, renderizamos los hijos
  if (auth.role !== requiredRole) {
    // Si el usuario tiene un rol pero no es el adecuado, redirigimos a su propia página
    return <Navigate to={`/${auth.role}/dashboard`} />;
  }

  return children; // Si el rol es adecuado, renderiza la ruta protegida
};

export default ProtectedRoute;
