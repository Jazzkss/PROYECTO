import { useState, useEffect, createContext, useCallback } from "react";
import clienteAxios from "../config/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [cargando, setCargando] = useState(true);
  const [auth, setAuth] = useState({});
  const navigate = useNavigate();

  // Función para autenticar al usuario, puede ser memoizada para optimizar
  const autenticarUsuario = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCargando(false);  // Finaliza la carga si no hay token
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await clienteAxios('/perfil', config);
      setAuth(data);  // Si la autenticación es exitosa, actualiza el contexto
    } catch (error) {
      console.error("Error de autenticación:", error.response?.data?.msg || error);
      setAuth({});  // Si hay un error, limpia la autenticación
      navigate("/login");  // Redirige al login si el token es inválido o no está presente
    } finally {
      setCargando(false);  // Finaliza la carga
    }
  }, [navigate]);

  // Ejecutar autenticarUsuario al montar el componente
  useEffect(() => {
    autenticarUsuario();
  }, [autenticarUsuario]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
