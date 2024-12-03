import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import Spinner from "../spinners/Spinner";

const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Página actual
  const [hasMore, setHasMore] = useState(true); // Si hay más alumnos para cargar

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const { data } = await clienteAxios.get(
          `/administrativo/autoescuela/alumnos?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filtrar duplicados (solo agregar alumnos que no estén ya en la lista)
        setAlumnos((prevAlumnos) => {
          const newAlumnos = data.alumnos.filter(
            (alumno) => !prevAlumnos.some((a) => a.id === alumno.id)
          );
          return [...prevAlumnos, ...newAlumnos];
        });

        // Si hay menos de 10 alumnos, significa que no hay más páginas.
        if (data.alumnos.length < 10) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) fetchAlumnos();
  }, [page, token, hasMore]);

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
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Listado de Alumnos</h2>
      <ul className="space-y-4">
        {alumnos.map((alumno) => (
          <li
            key={alumno.id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <p className="text-lg font-medium text-gray-800">{alumno.name}</p>
              <p className="text-sm text-gray-500">{alumno.email}</p>
            </div>
            <button
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
    </div>
  );
};

export default AlumnosList;
