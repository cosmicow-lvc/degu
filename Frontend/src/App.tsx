import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ListaTalleres from './components/listaTalleres';
import FormularioAsistencia from './components/formularioAsistencia';
import './App.css';

const Inicio = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Sistema de Gestión Estudiantil</h1>
    <p className="text-gray-600 mb-8">Bienvenido al panel principal de Galpón Cultural.</p>
     
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Link 
        to="/talleres" 
        className="px-6 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Ir a la Lista de Talleres
      </Link>
    </div>

    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Link 
        to="/formularioAsistencia" 
        className="px-6 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Ir al Formulario de Asistencia
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<Inicio />} />
        <Route path='/formularioAsistencia' element={<FormularioAsistencia />} />
        <Route path="/talleres" element={<ListaTalleres />} />
        <Route path="*" element={<div className="p-10 text-center text-red-500">Página no encontrada (Error 404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
