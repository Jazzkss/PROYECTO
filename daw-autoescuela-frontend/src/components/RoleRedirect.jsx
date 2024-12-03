import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRedirect = () => {
  const { auth, cargando } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (cargando) return;

    // Si no hay datos de auth o el rol está ausente, no redirigimos
    if (!auth || !auth.role) {
      return;
    }

    setIsRedirecting(true);

    // Redirigimos según el rol
    switch (auth.role) {
      case "autoescuela":
        navigate("/autoescuela/dashboard");
        break;
      case "estudiante":
        navigate("/estudiante/dashboard");
        break;
      case "profesor":
        navigate("/profesor/dashboard");
        break;
      case "director":
        navigate("/director/dashboard");
        break;
      case "administrativo":
        navigate("/administrativo/dashboard");
        break;
      default:
        navigate("/");
        break;
    }

    setIsRedirecting(false);
  }, [auth, cargando, navigate]);

  // Mientras se redirige, muestra un spinner o mensaje
  if (isRedirecting) {
    return <div>Loading...</div>;
  }

  return null;
};

export default RoleRedirect;
