import { Routes, Route } from 'react-router-dom'
import Horario from './pages/Horario.tsx'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/horario" element={<Horario />} />
    </Routes>
  )
}

export default App
