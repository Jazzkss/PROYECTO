import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const Card = ({ title, route, endpoint }) => {
  const [total, setTotal] = useState(0); // Para almacenar el total (alumnos o profesores)
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar posibles errores
  const navigate = useNavigate(); // Reemplazamos useHistory por useNavigate

  const token = localStorage.getItem("token"); // Obtenemos el token de localStorage

  useEffect(() => {
    // Hacer la solicitud axios para obtener los totales de alumnos o profesores
    const fetchData = async () => {
      try {
        if (!token) {
          setError("No se encontró el token de autenticación.");
          return;
        }

        const { data } = await clienteAxios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`, // Añadimos el token en el encabezado
          },
        });
        setTotal(data.total); // Suponiendo que la respuesta contiene un campo 'total'
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData(); // Llamar a la función de fetch cuando el componente se monte
  }, [endpoint, token]); // Dependemos tanto del 'endpoint' como del 'token'

  const handleClick = () => {
    navigate(route); // Usamos navigate en lugar de history.push
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-700 flex flex-col items-center justify-center">
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <p className="text-xl mb-4">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-400 flex flex-col items-center justify-center">
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <p className="text-xl mb-4 text-red-500">{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-400 flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-5xl font-bold mb-4">{total}</p>
      <button
        onClick={handleClick}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ver Listado
      </button>
    </div>
  );
};

export default Card;
