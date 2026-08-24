import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { buscarEstudiantes } from "../../services/estudiantes.service"
import type { Estudiante } from "../../interfaces/Estudiante"
import type { TallerSeleccionado } from "../../interfaces/Horario"

interface Props {
  tallerSeleccionado: TallerSeleccionado
  estudiantes: Estudiante[]
  asistenciaActual: Record<string, boolean>
  hayCambios: boolean
  cargando?: boolean
  error?: string | null
  alternarAsistencia: (rut: string) => void
  marcarTodos: (presente: boolean) => void
  guardarAsistencia: () => void
  cerrarModalAsistencia: () => void
  abrirQrModal: () => void
  inscribirEstudiante: (estudianteId: number) => Promise<void>
}

export default function ModalAsistencia({
  tallerSeleccionado,
  estudiantes,
  asistenciaActual,
  hayCambios,
  cargando = false,
  error = null,
  alternarAsistencia,
  marcarTodos,
  guardarAsistencia,
  cerrarModalAsistencia,
  abrirQrModal,
  inscribirEstudiante
}: Props) {
  const { user } = useAuth();
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [busquedaQuery, setBusquedaQuery] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<any[]>([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [msgErrorInsc, setMsgErrorInsc] = useState<string | null>(null);
  const [msgExitoInsc, setMsgExitoInsc] = useState<string | null>(null);

  const ejecutarBusqueda = async () => {
    if (!busquedaQuery.trim()) return;
    setCargandoBusqueda(true);
    setMsgErrorInsc(null);
    try {
      const res = await buscarEstudiantes(busquedaQuery, 1, 10);
      setResultadosBusqueda(res.data);
    } catch (err: any) {
      setMsgErrorInsc('Error al buscar estudiantes');
    } finally {
      setCargandoBusqueda(false);
    }
  };

  const handleInscribir = async (estudianteId: number, nombreEstudiante: string) => {
    setMsgErrorInsc(null);
    setMsgExitoInsc(null);
    try {
      await inscribirEstudiante(estudianteId);
      setMsgExitoInsc(`${nombreEstudiante} inscrito correctamente.`);
      // Quitar de la lista de búsqueda para evitar doble clic
      setResultadosBusqueda(prev => prev.filter(e => e.id !== estudianteId));
      setTimeout(() => setMsgExitoInsc(null), 3000);
    } catch (err: any) {
      setMsgErrorInsc(err.message || 'Error al inscribir estudiante.');
    }
  };

  return (
    <div className="modal-overlay-sec" onClick={cerrarModalAsistencia}>
      <div className="modal-contenido-sec" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{tallerSeleccionado.taller.nombre}</h3>
          <button type="button" className="panel-btn panel-btn-sec" onClick={cerrarModalAsistencia}>
            Cerrar
          </button>
        </div>

        {cargando && <p className="panel-subtitulo">Cargando estudiantes...</p>}
        {error && <p className="panel-subtitulo" style={{ color: "red" }}>{error}</p>}

        {!cargando && !error && (
          <>
            <div className="asistencia-acciones">
              <button type="button" className="panel-btn" onClick={() => marcarTodos(true)}>
                Todos presentes
              </button>
              <button type="button" className="panel-btn panel-btn-sec" onClick={() => marcarTodos(false)}>
                Todos ausentes
              </button>
              <button type="button" className="panel-btn panel-btn-sec" onClick={abrirQrModal}>
                Ver código QR
              </button>
            </div>

            {/* Inscripción rápida de estudiante (Solo Administradores) */}
            {user?.rol === 'Administrador' && (
              <div className="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-left">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 text-sm">Inscripción rápida de estudiante</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarBuscador(!mostrarBuscador);
                      setBusquedaQuery('');
                      setResultadosBusqueda([]);
                      setMsgErrorInsc(null);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    {mostrarBuscador ? "Ocultar buscador" : "+ Inscribir alumno"}
                  </button>
                </div>

                {mostrarBuscador && (
                  <div className="mt-3 space-y-3">
                    {msgErrorInsc && (
                      <div className="p-2 bg-red-100 text-red-700 text-xs rounded border border-red-200">
                        {msgErrorInsc}
                      </div>
                    )}
                    {msgExitoInsc && (
                      <div className="p-2 bg-green-100 text-green-700 text-xs rounded border border-green-200">
                        {msgExitoInsc}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Buscar por nombre o RUT..."
                        value={busquedaQuery}
                        onChange={(e) => setBusquedaQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') ejecutarBusqueda(); }}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs outline-none bg-white text-gray-800 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={ejecutarBusqueda}
                        disabled={cargandoBusqueda}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
                      >
                        {cargandoBusqueda ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>

                    {resultadosBusqueda.length > 0 && (
                      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded bg-white divide-y divide-gray-100">
                        {resultadosBusqueda.map((est) => {
                          const yaInscrito = estudiantes.some((e) => e.rut === est.rut);
                          return (
                            <div key={est.id} className="flex justify-between items-center p-2 text-xs">
                              <div>
                                <span className="font-semibold text-gray-700">{est.nombre} {est.apellido}</span>
                                <span className="text-gray-400 ml-2">({est.rut})</span>
                              </div>
                              {yaInscrito ? (
                                <span className="text-gray-400 font-medium text-[10px]">Ya inscrito</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleInscribir(est.id, `${est.nombre} ${est.apellido}`)}
                                  className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded text-[10px] transition"
                                >
                                  + Inscribir
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {resultadosBusqueda.length === 0 && busquedaQuery && !cargandoBusqueda && (
                      <p className="text-[11px] text-gray-500 text-center">No se encontraron estudiantes para esa búsqueda</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {estudiantes.length === 0 && (
              <p className="panel-subtitulo">No hay estudiantes inscritos en este taller.</p>
            )}

            <ul className="asistencia-lista">
              {estudiantes.map((estudiante) => {
                const presente = asistenciaActual[estudiante.rut] ?? false

                return (
                  <li
                    key={estudiante.rut}
                    className={`asistencia-card ${presente ? "presente" : "ausente"}`}
                  >
                    <div className="asistencia-card-info">
                      <strong>{estudiante.nombre} {estudiante.apellido}</strong>
                      <span>{estudiante.rut}</span>
                    </div>

                    <div className="asistencia-switch-wrap">
                      <span className={`asistencia-estado ${presente ? "activo" : ""}`}>
                        {presente ? "Presente" : "Ausente"}
                      </span>

                      <label className="asistencia-switch" aria-label={`Cambiar asistencia de ${estudiante.nombre} ${estudiante.apellido}`}>
                        <input
                          type="checkbox"
                          checked={presente}
                          onChange={() => alternarAsistencia(estudiante.rut)}
                        />
                        <span className="asistencia-slider" />
                      </label>
                    </div>
                  </li>
                )
              })}
            </ul>

            <button type="button" className="panel-btn" onClick={guardarAsistencia} disabled={!hayCambios}>
              Guardar
            </button>
          </>
        )}
      </div>
    </div>
  )
}