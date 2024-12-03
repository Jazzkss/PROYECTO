// components/ProtectedLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const ProtectedLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-24"> {/* Agregar un padding bottom para asegurarse de que el contenido no se superponga al footer */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
