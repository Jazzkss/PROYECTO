import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios"; // Asegúrate de tener la configuración de axios
import { useAuth } from "../hooks/useAuth"; // Suponiendo que usas un hook para manejar el estado de autenticación

export const Login = () => {
  const navigate = useNavigate(); // Redirigir a otra página después de iniciar sesión
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!formData.email || !formData.password) {
      setAlerta({
        msg: "Ambos campos son obligatorios",
        error: true,
      });
      return;
    }

    if (!formData.email.includes("@")) {
      setAlerta({
        msg: "El correo debe ser válido",
        error: true,
      });
      return;
    }

    // Enviar datos al backend
    try {
      const { data } = await clienteAxios.post("/auth/login", formData);

      // Si el login es exitoso, guardar el token o información del usuario
      // Por ejemplo, podrías guardar el token en el localStorage
      localStorage.setItem("token", data.token);

      // Mostrar mensaje de éxito y redirigir
      setAlerta({
        msg: "Login exitoso",
        error: false,
      });

      // Redirigir a la página de inicio o donde desees
      navigate("/dashboard"); // O la ruta que necesites
    } catch (error) {
      setAlerta({
        msg: error.response?.data?.msg || "Ocurrió un error durante el inicio de sesión",
        error: true,
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h2>

      {/* Mostrar alerta si existe */}
      {alerta.msg && (
        <div
          className={`p-4 mb-4 text-sm rounded-md ${
            alerta.error ? "bg-red-600" : "bg-green-600"
          } text-white`}
        >
          {alerta.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu correo"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Iniciar Sesión
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        ¿No tienes una cuenta?{" "}
        <Link to="/registrar" className="text-indigo-400 hover:text-indigo-500">
          Regístrate
        </Link>
      </p>
    </>
  );
};
