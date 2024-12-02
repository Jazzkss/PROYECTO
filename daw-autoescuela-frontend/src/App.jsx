import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout } from "./layout/AuthLayout"
import { Login } from "./pages/Login"
import { Registrar } from "./pages/Registrar"
import { AuthProvider } from "./context/AuthProvider"

function App() {



  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <AuthLayout/> }>
            <Route index element={<Login />} />
            <Route path="registrar" element={<Registrar />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
