import ProfesoresList from "../../../components/listados/ProfesoresList";

const ProfesoresPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Listado de Profesores</h1>
      <ProfesoresList />
    </div>
  );
};

export default ProfesoresPage;