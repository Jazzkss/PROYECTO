const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 text-sm py-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Jazzkss. Todos los derechos
          reservados.
        </p>
        <p>
          <a
            href="/politica-privacidad"
            className="text-indigo-400 hover:text-indigo-500"
          >
            Política de Privacidad
          </a>{" "}
          |{" "}
          <a
            href="/terminos-condiciones"
            className="text-indigo-400 hover:text-indigo-500"
          >
            Términos y Condiciones
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
