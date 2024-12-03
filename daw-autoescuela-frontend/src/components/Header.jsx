// components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Si tienes un hook para manejar autenticación

const Header = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth(); // Supongamos que este hook devuelve info del usuario autenticado y una función de logout

  

  const handleLogout = () => {
    logout(); // Lógica para cerrar sesión
    navigate("/");
  };

  return (
    <header className="bg-gray-800 text-gray-200 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/dashboard" className="text-lg font-bold text-indigo-400 hover:text-indigo-500">
            {auth?.autoescuela?.name}
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/autoescuela/dashboard" className="text-sm hover:text-indigo-400">
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
