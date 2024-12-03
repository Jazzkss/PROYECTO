import { useState } from "react";
import { Alerta } from "./Alerta";
import clienteAxios from "../config/axios";

const AddUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact_info: "",
    address: "",
    dni: "",
    role: "estudiante", // Valor por defecto
    clases_disponibles: 0, // Inicializar en 0
  });

  const [alerta, setAlerta] = useState({ msg: "", error: false });

  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setAlerta({
        msg: "Todos los campos obligatorios deben ser completados",
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

    // Si no hay token en el localStorage, mostramos una alerta
    if (!token) {
      setAlerta({
        msg: "No se encontró el token de autenticación",
        error: true,
      });
      return;
    }

    try {
      const { data } = await clienteAxios.post(
        "/usuarios/registro", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Usar el token de localStorage
          }
        }
      );

      setAlerta({
        msg: data.msg || "Usuario agregado exitosamente",
        error: false,
      });

      // Reiniciar el formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        contact_info: "",
        address: "",
        dni: "",
        role: "estudiante",
        clases_disponibles: 0, // Reiniciar también las clases disponibles
      });
    } catch (error) {
      setAlerta({
        msg: error.response?.data?.msg || "Ocurrió un error durante el registro",
        error: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Usuario</h2>

        {/* Componente Alerta */}
        <Alerta alerta={alerta} />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ingresa el nombre"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ingresa el correo electrónico"
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
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Crea una contraseña"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Rol
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="administrativo">Administrativo</option>
              <option value="profesor">Profesor</option>
              <option value="estudiante">Estudiante</option>
              <option value="director">Director</option>
            </select>
          </div>

          {/* Mostrar solo si el rol es 'estudiante' */}
          {formData.role === "estudiante" && (
            <div className="mb-4">
              <label htmlFor="clases_disponibles" className="block text-sm font-medium mb-1">
                Número de Clases Disponibles
              </label>
              <input
                type="number"
                id="clases_disponibles"
                value={formData.clases_disponibles}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Número de clases"
                min="0"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="contact_info" className="block text-sm font-medium mb-1">
              Información de Contacto
            </label>
            <input
              type="text"
              id="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Teléfono o información adicional"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Dirección"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dni" className="block text-sm font-medium mb-1">
              DNI
            </label>
            <input
              type="text"
              id="dni"
              value={formData.dni}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Documento de identidad"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Guardar Usuario
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default AddUserModal;
