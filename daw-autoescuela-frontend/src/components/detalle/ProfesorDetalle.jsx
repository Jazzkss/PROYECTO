import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Spinner from "../spinners/Spinner";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi"; // Agregar iconos de flechas

const ProfesorDetalle = () => {
  const { id } = useParams(); // Obtener el ID del profesor desde la URL
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("futuras"); // Estado para el filtro (por defecto "futuras")
  const [page, setPage] = useState(1); // Página actual de la paginación
  const [pageSize] = useState(10); // Tamaño de la página (por defecto 10 clases por página)
  const [totalClases, setTotalClases] = useState(0); // Total de clases para la paginación

  const token = localStorage.getItem("token"); // Obtener el token de localStorage

  useEffect(() => {
    const fetchProfesorDetalle = async () => {
      try {
        if (!token) {
          setError("No se encontró el token de autenticación.");
          return;
        }

        // Hacer la solicitud con filtros y paginación
        const { data } = await clienteAxios.get(
          `/administrativo/autoescuela/profesor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Añadimos el token en los encabezados
            },
            params: {
              tipoFiltro,
              page,
              pageSize,
            }
          }
        );

        // Asegurarse de que la respuesta contiene los datos del profesor
        if (data?.profesor) {
          setProfesor(data.profesor); // Guardar los datos del profesor
          setTotalClases(data.profesor.totalClases); // Establecer el total de clases para la paginación
        } else {
          setError("Profesor no encontrado.");
        }
      } catch (err) {
        setError("Error al obtener los detalles del profesor.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfesorDetalle();
  }, [id, tipoFiltro, page, token]); // Repetir la solicitud cada vez que cambie el filtro, página o token

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const handleFiltroChange = (e) => {
    setTipoFiltro(e.target.value); // Cambiar el filtro (pasadas/futuras)
    setPage(1); // Resetear la página al primer número cuando se cambie el filtro
  };

  const handlePageChange = (newPage) => {
    setPage(newPage); // Cambiar la página
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto border-t-4 border-indigo-600">
      <h2 className="text-4xl font-semibold mb-6 text-indigo-600">Detalles del Profesor</h2>
      
      {/* Información del profesor */}
      <div className="space-y-5 text-gray-700">
        <p><strong className="font-semibold text-xl">Nombre:</strong> {profesor.nombre}</p>
        <p><strong className="font-semibold text-xl">Email:</strong> {profesor.email}</p>
        <p><strong className="font-semibold text-xl">Teléfono:</strong> {profesor.telefono || "No disponible"}</p>
        <p><strong className="font-semibold text-xl">Dirección:</strong> {profesor.direccion || "No disponible"}</p>
        <p><strong className="font-semibold text-xl">DNI:</strong> {profesor.dni || "No disponible"}</p>
      </div>

      {/* Selector de filtro (Pasadas o Futuras) */}
      <div className="mt-6 mb-5">
        <label className="mr-2 font-medium text-lg">Filtrar clases por:</label>
        <select 
          value={tipoFiltro} 
          onChange={handleFiltroChange} 
          className="p-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
        >
          <option value="futuras">Futuras</option>
          <option value="pasadas">Pasadas</option>
        </select>
      </div>

      {/* Mostrar las clases según el filtro seleccionado */}
      <h3 className="text-3xl font-semibold mt-6 mb-5">{tipoFiltro === "futuras" ? "Clases Futuras" : "Clases Pasadas"}:</h3>
      <ul>
        {profesor.clases && profesor.clases.length > 0 ? (
          profesor.clases.map((clase) => (
            <li key={clase.id} className="bg-gray-100 p-5 rounded-lg shadow-lg mb-5 hover:bg-gray-200 transition-colors duration-300">
              <p><strong className="font-semibold text-lg">Fecha:</strong> {clase.fecha}</p>
              <p><strong className="font-semibold text-lg">Hora:</strong> {clase.hora}</p>
              <p><strong className="font-semibold text-lg">Descripción:</strong> {clase.descripcion}</p>
              <p><strong className="font-semibold text-lg">Duración:</strong> {clase.duration} minutos</p>

              {/* Información del alumno */}
              <div className="mt-4 text-gray-800">
                <h4 className="font-semibold text-lg">Alumno:</h4>
                <p><strong className="font-semibold text-lg">Nombre:</strong> {clase.alumno.nombre}</p>
                <p><strong className="font-semibold text-lg">Email:</strong> {clase.alumno.email}</p>
                <p><strong className="font-semibold text-lg">Teléfono:</strong> {clase.alumno.telefono || "No disponible"}</p>
              </div>

              {/* Clases disponibles */}
              <div className="mt-4 text-gray-800">
                <h5 className="font-semibold text-lg">Clases Disponibles:</h5>
                {clase.clasesDisponibles && clase.clasesDisponibles.length > 0 ? (
                  <ul>
                    {clase.clasesDisponibles.map((claseDisponible, index) => (
                      <li key={index}>Clases Restantes: {claseDisponible}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay clases disponibles.</p>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-center">No hay clases {tipoFiltro} disponibles.</p>
        )}
      </ul>

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-300"
        >
          <HiArrowLeft className="inline-block mr-2" />Anterior
        </button>
        <p className="text-lg text-gray-700">Página {page} de {Math.ceil(totalClases / pageSize)}</p>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page * pageSize >= totalClases}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-300"
        >
          Siguiente<HiArrowRight className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ProfesorDetalle;
