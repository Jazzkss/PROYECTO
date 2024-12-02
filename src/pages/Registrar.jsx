import { useState } from "react";
import { Link } from "react-router-dom";
import { Alerta } from "../components/Alerta";
import clienteAxios from "../config/axios";
export const Registrar = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact_info: "",
    address: "",
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
    if (!formData.name || !formData.email || !formData.password) {
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

    // Enviar datos al backend
    try {
      const { data } = await clienteAxios.post(
        `/autoescuelas/registro`,
        formData
      );

      setAlerta({
        msg: data.msg || "Registro exitoso",
        error: false,
      });

      // Reiniciar el formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        contact_info: "",
        address: "",
      });
    } catch (error) {
      setAlerta({
        msg: error.response?.data?.msg || "Ocurrió un error durante el registro",
        error: true,
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">Registrarse</h2>

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
            className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu nombre"
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
            placeholder="Crea una contraseña"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="contact_info"
            className="block text-sm font-medium mb-1"
          >
            Información de Contacto
          </label>
          <input
            type="text"
            id="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu dirección"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Registrarse
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/" className="text-indigo-400 hover:text-indigo-500">
          Inicia Sesión
        </Link>
      </p>
    </>
  );
};
