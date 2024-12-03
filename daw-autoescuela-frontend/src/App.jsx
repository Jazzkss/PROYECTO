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
import ProtectedLayout from "./components/ProtectedLayout"
import AlumnosPage from "./pages/privadas/administrativos/AlumnosPage"
import ProfesoresPage from "./pages/privadas/administrativos/ProfesoresPage"
import ProfesorDetalle from "./components/detalle/ProfesorDetalle"

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
          <Route element={<ProtectedLayout />}>
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
             {/* Agregamos las nuevas rutas para Alumnos y Profesores */}
             <Route
              path="/administrativo/alumnos"
              element={
                <ProtectedRoute requiredRole="administrativo">
                  <AlumnosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/administrativo/profesores"
              element={
                <ProtectedRoute requiredRole="administrativo">
                  <ProfesoresPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profesor/:id"
              element={
                <ProtectedRoute requiredRole="administrativo">
                  <ProfesorDetalle />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
