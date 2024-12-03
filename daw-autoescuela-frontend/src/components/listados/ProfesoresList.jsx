import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import clienteAxios from "../../config/axios";
import Spinner from "../spinners/Spinner";

const ProfesoresList = () => {
  const [profesores, setProfesores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Página actual
  const [hasMore, setHasMore] = useState(true); // Si hay más profesores para cargar
  const [total, setTotal] = useState(0); // Total de profesores

  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Inicializamos useNavigate

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const { data } = await clienteAxios.get(
          `/administrativo/autoescuela/profesores?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filtrar duplicados (asegurar que no hay repetidos antes de añadir)
        setProfesores((prevProfesores) => {
          const newProfesores = data.profesores.filter(
            (profesor) => !prevProfesores.some((p) => p.id === profesor.id)
          );
          return [...prevProfesores, ...newProfesores];
        });

        setTotal(data.total); // Actualiza el total de profesores.

        // Verificar si se han cargado todos los profesores
        if (profesores.length + data.profesores.length >= data.total) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) fetchProfesores();
  }, [page, token, hasMore, profesores.length]); // Agregar 'profesores.length' como dependencia para evitar problemas con el estado anterior

  const loadMore = () => {
    if (hasMore) setPage((prevPage) => prevPage + 1);
  };

  if (loading && page === 1) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Listado de Profesores</h2>
      <ul className="space-y-4">
        {profesores.map((profesor) => (
          <li
            key={profesor.id} // Asegúrate de que la key sea única
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <p className="text-lg font-medium text-gray-800">{profesor.name}</p>
              <p className="text-sm text-gray-500">{profesor.email}</p>
            </div>
            <button
              onClick={() => navigate(`/profesor/${profesor.id}`)} // Navegar a la página de detalles
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Ver más
            </button>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
        >
          Cargar más
        </button>
      )}
      {!hasMore && profesores.length > 0 && (
        <p className="text-center text-gray-500 mt-4">Todos los profesores han sido cargados.</p>
      )}
    </div>
  );
};

export default ProfesoresList;
