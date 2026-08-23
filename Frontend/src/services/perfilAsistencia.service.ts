export interface ResumenAsistenciaEstudianteItem {
  tallerId: number;
  nombre: string;
  semestre: string;
  bloque: string;
  totalSesiones: number;
  asistencias: number;
  porcentaje: number;
  promedioSatisfaccion: number | null;
}

export async function obtenerResumenAsistenciaEstudiante(
  estudianteId: number
): Promise<ResumenAsistenciaEstudianteItem[]> {
  if (!Number.isFinite(estudianteId) || estudianteId <= 0) {
    throw new Error("estudianteId invalido");
  }

  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const baseUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(
    `${baseUrl}/asistencia/resumen/estudiante/${estudianteId}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Error al cargar resumen de asistencia del estudiante.");
  }

  return response.json();
}