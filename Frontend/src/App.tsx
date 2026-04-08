import { Routes, Route } from 'react-router-dom'
import Horario from './pages/Horario.tsx'
import Login from './pages/Login.tsx'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/horario" element={<Horario />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
