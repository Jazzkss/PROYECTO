import AlumnosList from "../../../components/listados/AlumnosList";

const AlumnosPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Listado de Alumnos</h1>
      <AlumnosList />
    </div>
  );
};

export default AlumnosPage;