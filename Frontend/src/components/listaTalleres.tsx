import React, { useEffect, useMemo, useState } from 'react';
import { obtenerResumenAsistencia, type ResumenAsistenciaTallerApi } from '../services/talleres.service';
import { obtenerSemestreActual, obtenerSemestreAnterior } from '../utils/semestre.utils';

interface Taller {
  id: number;
  codigo: string;
  nombre: string;
  porcentajeAsistencia: number;
  promedioSatisfaccion: number | null;
  totalSesiones: number;
  totalAlumnos: number;
}

const obtenerColorBarra = (porcentaje: number): string => {
  if (porcentaje >= 80) return 'bg-green-500';
  if (porcentaje >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const ListaTalleres: React.FC = () => {
  const semestreActual = useMemo(() => obtenerSemestreActual(), []);
  const semestresDisponibles = useMemo(
    () => [semestreActual, obtenerSemestreAnterior(semestreActual)],
    [semestreActual]
  );

  const [filtro, setFiltro] = useState<string>('');
  const [semestreFiltro, setSemestreFiltro] = useState<string>(semestreActual);
  const [mesFiltro, setMesFiltro] = useState<string>('');
  const [diaFiltro, setDiaFiltro] = useState<string>('');
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState<string>('');
  const [fechaFinFiltro, setFechaFinFiltro] = useState<string>('');

  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let activo = true;

    const cargarResumen = async () => {
      setCargando(true);
      setError('');

      try {
        const respuesta: ResumenAsistenciaTallerApi[] = await obtenerResumenAsistencia({
          semestre: semestreFiltro,
          mes: mesFiltro ? Number(mesFiltro) : undefined,
          dia: diaFiltro ? Number(diaFiltro) : undefined,
          fechaInicio: fechaInicioFiltro || undefined,
          fechaFin: fechaFinFiltro || undefined,
        });

        if (!activo) return;

        setTalleres(
          respuesta.map((taller) => ({
            id: taller.tallerId,
            codigo: `TAL${String(taller.tallerId).padStart(3, '0')}`,
            nombre: taller.nombre || `Taller ${taller.tallerId}`,
            porcentajeAsistencia: taller.promedioAsistencia,
            promedioSatisfaccion: taller.promedioSatisfaccion,
            totalSesiones: taller.totalSesiones,
            totalAlumnos: taller.totalAlumnos,
          }))
        );
      } catch (err) {
        if (!activo) return;
        setTalleres([]);
        setError(err instanceof Error ? err.message : 'Error al cargar el resumen de asistencia.');
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarResumen();

    return () => {
      activo = false;
    };
  }, [semestreFiltro, mesFiltro, diaFiltro, fechaInicioFiltro, fechaFinFiltro]);

  const talleresOrdenados = useMemo(() => {
    return [...talleres].sort((a, b) => {
      if (filtro === 'mas') return b.porcentajeAsistencia - a.porcentajeAsistencia;
      if (filtro === 'menos') return a.porcentajeAsistencia - b.porcentajeAsistencia;
      return a.id - b.id;
    });
  }, [talleres, filtro]);

  const limpiarFiltros = () => {
    setFiltro('');
    setSemestreFiltro(semestreActual);
    setMesFiltro('');
    setDiaFiltro('');
    setFechaInicioFiltro('');
    setFechaFinFiltro('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-left">Control de Asistencia</h1>
          <p className="text-gray-600 mt-2">
            Vista general de participación en los talleres del galpón cultural.
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Ordenar por...</option>
              <option value="mas">Mayor asistencia</option>
              <option value="menos">Menor asistencia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semestre</label>
            <select
              value={semestreFiltro}
              onChange={(e) => setSemestreFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {semestresDisponibles.map((semestre) => (
                <option key={semestre} value={semestre}>
                  {semestre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              style={{ backgroundColor: 'white', color: '#111827' }}
            >
              <option value="">Todos los meses</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Día</label>
            <select
              value={diaFiltro}
              onChange={(e) => setDiaFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los días</option>
              <option value="1">Lunes</option>
              <option value="2">Martes</option>
              <option value="3">Miércoles</option>
              <option value="4">Jueves</option>
              <option value="5">Viernes</option>
              <option value="6">Sábado</option>
              <option value="0">Domingo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicioFiltro}
              onChange={(e) => setFechaInicioFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha fin</label>
            <input
              type="date"
              value={fechaFinFiltro}
              onChange={(e) => setFechaFinFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors duration-150"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="bg-white rounded-lg p-6 text-gray-600">
          Cargando resumen de asistencia...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          {talleresOrdenados.length === 0 ? (
            <div className="p-6 text-gray-600">No hay talleres para los filtros seleccionados.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {talleresOrdenados.map((taller) => (
                <li
                  key={taller.id}
                  className="p-5 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-800 bg-blue-100 rounded-full">
                          {taller.codigo}
                        </span>
                        <span className="text-xs text-gray-600 font-medium">
                          Sesiones: {taller.totalSesiones}
                        </span>
                        <div>·</div>
                        <span className="text-xs text-gray-600 font-medium">
                          Alumnos: {taller.totalAlumnos}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-semibold text-gray-900">
                        {taller.nombre}
                      </p>
                    </div>

                    <div className="w-full sm:w-1/2 sm:pl-8">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-medium text-gray-600">
                              Porcentaje de asistencia
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              {taller.porcentajeAsistencia}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${obtenerColorBarra(taller.porcentajeAsistencia)}`}
                              style={{ width: `${taller.porcentajeAsistencia}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-medium text-gray-600">
                              Satisfacción promedio
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              {taller.promedioSatisfaccion ?? 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${obtenerColorBarra(
                                ((taller.promedioSatisfaccion ?? 0) / 5) * 100
                              )}`}
                              style={{ width: `${((taller.promedioSatisfaccion ?? 0) / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ListaTalleres;