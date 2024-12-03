import { useState } from "react";
import AddUserModal from "../../components/AddUserModal";

export const AutoescuelaDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Autoescuela Dashboard</h1>

      {/* Contenido principal */}
      <div className="flex-grow">
        {/* Agrega aquí el contenido de tu dashboard */}
      </div>

      {/* Botón flotante para abrir el modal */}
      <button
        onClick={toggleModal}
        className="fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-50"
        title="Agregar usuario"
      >
        +
      </button>

      {/* Fondo oscuro cuando el modal está abierto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}

      {/* Modal */}
      {isModalOpen && <AddUserModal onClose={toggleModal} />}
    </div>
  );
};
