import { useState, useEffect } from "react";
import AddUserModal from "../../components/AddUserModal";
import AddClassModal from "../../components/AddClassModal";
import AlumnosList from "../../components/listados/AlumnosList";
import ProfesoresList from "../../components/listados/ProfesoresList";
import Card from "../../components/cards/Card";

export const AdministrativoDashboard = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  const toggleClassModal = () => {
    setIsClassModalOpen(!isClassModalOpen);
  };

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Administrativo Dashboard</h1>

      {/* Contenido principal */}
      <div className="flex-grow">

        {/* Añadimos las tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card 
            title="Alumnos" 
            route="/administrativo/alumnos" 
            endpoint="/administrativo/autoescuela/alumnos" // Cambiar al endpoint correcto
          />
          <Card 
            title="Profesores" 
            route="/administrativo/profesores" 
            endpoint="/administrativo/autoescuela/profesores" // Cambiar al endpoint correcto
          />
        </div>
      </div>

      {/* Botón flotante para abrir el modal de agregar usuario */}
      <button
        onClick={toggleUserModal}
        className="fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-50"
        title="Agregar usuario"
      >
        +
      </button>

      {/* Botón flotante para abrir el modal de registrar clase */}
      <button
        onClick={toggleClassModal}
        className="fixed bottom-24 left-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 z-50"
        title="Registrar clase"
      >
        +
      </button>

      {/* Fondo oscuro cuando los modales están abiertos */}
      {(isUserModalOpen || isClassModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}

      {/* Modal de agregar usuario */}
      {isUserModalOpen && <AddUserModal onClose={toggleUserModal} />}

      {/* Modal de registrar clase */}
      {isClassModalOpen && <AddClassModal onClose={toggleClassModal} />}
    </div>
  );
};
