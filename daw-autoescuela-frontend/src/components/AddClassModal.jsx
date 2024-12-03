import { useState, useEffect } from "react";
import { Alerta } from "./Alerta";
import clienteAxios from "../config/axios";

const AddClassModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    duration: "",
    description: "",
    profesorId: "",
    alumnoId: "",
  });

  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  // Obtener el token del localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Obtener los alumnos y profesores cuando se abre el modal
    const fetchAlumnos = async () => {
      try {
        let allAlumnos = [];
        let page = 1;
        let hasMore = true;
    
        // Mientras haya más páginas, sigue cargando los alumnos
        while (hasMore) {
          const { data } = await clienteAxios.get(
            `/administrativo/autoescuela/alumnos?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          // Agregar los alumnos de la página actual
          allAlumnos = [...allAlumnos, ...data.alumnos];
    
          // Si la página actual tiene menos alumnos de lo esperado, hemos llegado al final
          if (data.alumnos.length < 10) {
            hasMore = false;
          } else {
            page++;
          }
        }
    
        setAlumnos(allAlumnos);
      } catch (error) {
        setAlerta({
          msg: "Error al cargar los alumnos",
          error: true,
        });
      }
    };
    
    const fetchProfesores = async () => {
      try {
        const { data } = await clienteAxios.get(
          "/administrativo/autoescuela/profesores",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfesores(data.profesores || []);
      } catch (error) {
        setAlerta({
          msg: "Error al cargar los profesores",
          error: true,
        });
      }
    };

    fetchAlumnos();
    fetchProfesores();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    const { fecha, hora, duration, description, profesorId, alumnoId } = formData;

    if (!fecha || !hora || !duration || !description || !profesorId || !alumnoId) {
        setAlerta({
            msg: "Todos los campos deben ser completados",
            error: true,
        });
        return;
    }

    // Formatear la hora para agregar los segundos
    const formattedHora = `${hora}:00`; // Agrega ":00" para incluir los segundos

    try {
        const response = await clienteAxios.post(
            "/clases/crear",
            {
                fecha,
                hora: formattedHora, // Usa la hora formateada
                duration: parseInt(duration, 10), // Convertir duración a número.
                description,
                id_profesor: profesorId,
                id_alumno: alumnoId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setAlerta({
            msg: response.data.msg || "Clase registrada exitosamente",
            error: false,
        });

        // Limpiar el formulario
        setFormData({
            fecha: "",
            hora: "",
            duration: "",
            description: "",
            profesorId: "",
            alumnoId: "",
        });
    } catch (error) {
        setAlerta({
            msg: error.response?.data?.msg || "Hubo un error al registrar la clase",
            error: true,
        });
    }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Registrar Clase</h2>

        {/* Alerta */}
        <Alerta alerta={alerta} />
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descripción de la clase
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Descripción de la clase"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fecha" className="block text-sm font-medium mb-1">
              Fecha
            </label>
            <input
              type="date"
              id="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hora" className="block text-sm font-medium mb-1">
              Hora
            </label>
            <input
              type="time"
              id="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Duración (minutos)
            </label>
            <input
              type="number"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Duración en minutos"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="profesorId" className="block text-sm font-medium mb-1">
              Profesor
            </label>
            <select
              id="profesorId"
              value={formData.profesorId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map((profesor) => (
                <option key={profesor.id} value={profesor.id}>
                  {profesor.name} ({profesor.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="alumnoId" className="block text-sm font-medium mb-1">
              Alumno
            </label>
            <select
              id="alumnoId"
              value={formData.alumnoId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar alumno</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.name} ({alumno.email})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Registrar Clase
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

export default AddClassModal;
