import { Routes, Route } from 'react-router-dom';
import ListaTalleres from './components/listaTalleres';
import FormularioAsistencia from './components/formularioAsistencia';
import Inicio from './pages/Inicio';
import Horario from './pages/Horario'
import Perfil from './pages/Perfil'
import './App.css';
import Login from './pages/Login';



function App() {
  return (
    <Routes>  
      <Route path='/' element={<Inicio />} />
      <Route path='/formularioAsistencia' element={<FormularioAsistencia />} />
      <Route path='/talleres' element={<ListaTalleres />} />
      <Route path='/horario' element={<Horario />} />
      <Route path='/perfil' element={<Perfil />} />
      <Route path='/login' element={<Login />} />
      <Route path='/inicio' element={<Inicio />} />
      <Route path="*" element={<div className="p-10 text-center text-red-500">Página no encontrada (Error 404)</div>} />
    </Routes>
  );
}

export default App;
