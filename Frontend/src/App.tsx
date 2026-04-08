import { Routes, Route } from 'react-router-dom'
import Horario from './pages/Horario.tsx'
import Login from './pages/Login.tsx'
import Registro from './pages/Registro.tsx'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/horario" element={<Horario />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  )
}

export default App
