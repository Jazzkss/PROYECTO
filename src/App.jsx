import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout } from "./layout/AuthLayout"
import { Login } from "./pages/Login"
import { Registrar } from "./pages/Registrar"
import { AuthProvider } from "./context/AuthProvider"

import RoleRedirect from "./components/RoleRedirect"
import ProtectedRoute from "./components/ProtectedRoute"; // Importamos ProtectedRoute
import { AdministrativoDashboard } from "./pages/privadas/AdministrativoDashboard"
import { AutoescuelaDashboard } from "./pages/privadas/AutoescuelaDashboard"
import { DirectorDashboard } from "./pages/privadas/DirectorDashboard"
import { EstudianteDashboard } from "./pages/privadas/EstudianteDashboard"
import { ProfesorDashboard } from "./pages/privadas/ProfesorDashboard"

function App() {



  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <AuthLayout/> }>
            <Route index element={<Login />} />
            <Route path="registrar" element={<Registrar />} />
          </Route>

          {/* Ruta para redirigir dependiendo del rol */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Subrutas protegidas (no se deben agregar directamente en /dashboard) */}
          <Route
            path="/autoescuela/dashboard"
            element={
              <ProtectedRoute requiredRole="autoescuela">
                <AutoescuelaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiante/dashboard"
            element={
              <ProtectedRoute requiredRole="estudiante">
                <EstudianteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profesor/dashboard"
            element={
              <ProtectedRoute requiredRole="profesor">
                <ProfesorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/dashboard"
            element={
              <ProtectedRoute requiredRole="director">
                <DirectorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/administrativo/dashboard"
            element={
              <ProtectedRoute requiredRole="administrativo">
                <AdministrativoDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
