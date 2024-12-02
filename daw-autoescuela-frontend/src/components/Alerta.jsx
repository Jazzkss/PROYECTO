export const Alerta = ({ alerta }) => {
    if (!alerta.msg) return null;
  
    return (
      <div
        className={`text-center my-4 p-3 rounded-md ${
          alerta.error ? "bg-red-600 text-white" : "bg-green-600 text-white"
        }`}
      >
        {alerta.msg}
      </div>
    );
  };
  