import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      <main className="container mx-auto max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <Outlet />
      </main>
    </div>
  );
};
