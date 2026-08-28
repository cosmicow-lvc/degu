import { useMetricas } from "../../pages/hooks/useMetricas"
import star from "../../assets/star.svg"
import trendingDown from "../../assets/trending-down.svg"
import trendingUp from "../../assets/trending-up.svg"

export default function PanelDirectivo() {
  const { metricas, isLoading, error } = useMetricas();

  if (isLoading) return <p className="text-center text-gray-500">Cargando panel directivo...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!metricas) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-5 rounded-lg text-left">
          <h3 className="mb-2">Asistencias totales</h3>
          <p className="text-3xl font-bold">{metricas.volumen.totalAsistenciasFisicas}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-lg text-left">
          <h3 className="mb-2">Estudiantes únicos</h3>
          <p className="text-3xl font-bold">{metricas.volumen.estudiantesUnicos}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-lg text-left">
          <h3 className="mb-2">Satisfacción promedio</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold">{metricas.calidad.satisfaccionPromedio}</p>
            <p className="text-xm">/ 5.0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <img src={trendingUp} alt="" aria-hidden="true" className="h-6 w-6" />
            Talleres con más asistencia
          </h3>
          <ul className="space-y-2">
            {metricas.rendimiento.mejoresAsistencia.map((t, i) => (
              <li key={t.id} className="flex justify-between text-sm">
                <span className="font-medium">{i + 1}. {t.nombre}</span>
                <span className="font-bold">{t.totalAsistenciasReal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <img src={trendingDown} alt="" aria-hidden="true" className="h-6 w-6" />
            Talleres con menos asistencia
          </h3>
          <ul className="space-y-2">
            {metricas.rendimiento.peoresAsistencia.map((t, i) => (
              <li key={t.id} className="flex justify-between text-sm">
                <span className="font-medium">{i + 1}. {t.nombre}</span>
                <span className="font-bold">{t.totalAsistenciasReal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <img src={star} alt="" aria-hidden="true" className="h-6 w-6" />
            Mejores evaluaciones
          </h3>
          <ul className="space-y-2">
            {metricas.rendimiento.mejoresCalificaciones.map((t, i) => (
              <li key={t.id} className="flex justify-between text-sm">
                <span className="font-medium">{i + 1}. {t.nombre}</span>
                <span className="font-bold">{t.promedioCalificacion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <img src={trendingDown} alt="" aria-hidden="true" className="h-6 w-6" />
            Talleres con evaluaciones bajas
          </h3>
          <ul className="space-y-2">
            {metricas.rendimiento.peoresCalificaciones.map((t, i) => (
              <li key={t.id} className="flex justify-between text-sm">
                <span className="font-medium">{i + 1}. {t.nombre}</span>
                <span className={(t.promedioCalificacion ?? 0) >= 2 ? "font-bold" : "font-bold text-red-800"}>{t.promedioCalificacion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}