import React from 'react';

interface Taller {
  id: number;
  codigo: string;
  nombre: string;
  porcentajeAsistencia: number;
}

const talleresData: Taller[] = [
  { id: 1, codigo: 'TALL-001', nombre: 'Teatro', porcentajeAsistencia: 85 },
  { id: 2, codigo: 'TALL-002', nombre: 'Danza Contemporánea', porcentajeAsistencia: 65 },
  { id: 3, codigo: 'TALL-003', nombre: 'Pintura', porcentajeAsistencia: 40 },
  { id: 4, codigo: 'TALL-004', nombre: 'Música Andina', porcentajeAsistencia: 95 },
];

const ListaTalleres: React.FC = () => {
  
  const obtenerColorBarra = (porcentaje: number): string => {
    if (porcentaje >= 80) return 'bg-green-500';
    if (porcentaje >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-left">Control de Asistencia</h1>
        <p className="text-gray-600 mt-2">Vista general de participación en los talleres del galpón cultural.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {talleresData.map((taller) => (
            <li 
              key={taller.id} 
              className="p-5 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                
                {/* Información del Taller */}
                <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
                  <div className="flex items-center space-x-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-800 bg-blue-100 rounded-full">
                      {taller.codigo}
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {taller.nombre}
                  </p>
                </div>

                {/* Barra de Progreso */}
                <div className="w-full sm:w-1/2 sm:pl-8">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium text-gray-600">Asistencia actual</span>
                    <span className="text-sm font-bold text-gray-800">{taller.porcentajeAsistencia}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${obtenerColorBarra(taller.porcentajeAsistencia)}`}
                      style={{ width: `${taller.porcentajeAsistencia}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListaTalleres;