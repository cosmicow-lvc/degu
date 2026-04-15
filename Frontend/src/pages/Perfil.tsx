import { type ReactElement } from "react"
import { Link } from "react-router-dom"

interface TallerHistorico {
  id: number
  codigo: string
  nombre: string
  semestre: string
  asistencia: number
  estado: "Calificado" | "No califica"
}

const estudiante = {
  nombre: "Camila Rojas Pérez",
  rut: "20123456-7",
  carrera: "Pedagogía en Artes",
  correo: "camila.rojas@ucn.cl",
  semestreActual: "2026-1",
  promedioAsistencia: 82,
  talleresInscritos: 4,
  talleresAprobados: 3,
}

const historialTalleres: TallerHistorico[] = [
  { id: 1, codigo: "TALL-001", nombre: "Teatro", semestre: "2025-1", asistencia: 92, estado: "Calificado" },
  { id: 2, codigo: "TALL-002", nombre: "Danza Contemporánea", semestre: "2025-2", asistencia: 78, estado: "No califica" },
  { id: 3, codigo: "TALL-003", nombre: "Pintura", semestre: "2024-2", asistencia: 61, estado: "No califica" },
  { id: 4, codigo: "TALL-004", nombre: "Música Andina", semestre: "2024-1", asistencia: 95, estado: "Calificado" },
]

function colorAsistencia(asistencia: number): string {
  if (asistencia >= 80) return "bg-emerald-500"
  if (asistencia >= 60) return "bg-amber-500"
  return "bg-rose-500"
}

function colorEstado(estado: TallerHistorico["estado"]): string {
  if (estado === "Calificado") return "bg-emerald-100 text-emerald-700 border border-emerald-200"
  if (estado === "No califica") return "bg-amber-100 text-amber-700 border border-amber-200"
  return "bg-rose-100 text-rose-700 border border-rose-200"
}

export default function Perfil(): ReactElement {
  return (
    <main className="min-h-screen bg-[#f6f7f8] px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-6 rounded-2xl border border-[#dfe3e7] bg-gradient-to-b from-[#f6f7f8] to-[#fcfcfd] p-6 shadow-[0_8px_22px_-18px_rgba(31,35,40,0.28)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2f363d]">
                Perfil de estudiante
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#2f363d] md:text-4xl">
                Datos e historial de talleres
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#5a636d]">
                Información personal y participación histórica en talleres, incluyendo asistencia y semestre.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-[#dfe3e7] bg-white px-4 py-2 text-sm font-semibold text-[#2f363d] transition hover:border-[#bfc8d1] hover:bg-[#f8fafc]"
            >
              Volver al inicio
            </Link>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-[#dfe3e7] bg-gradient-to-b from-[#f6f7f8] to-[#fcfcfd] p-5 shadow-[0_8px_22px_-18px_rgba(31,35,40,0.28)]">
            <h2 className="mb-4 text-lg font-semibold text-[#2f363d]">Información del estudiante</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-xl border border-[#dfe3e7] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#68727d]">Nombre</p>
                <p className="mt-1 text-[#2f363d]">{estudiante.nombre}</p>
              </article>

              <article className="rounded-xl border border-[#dfe3e7] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#68727d]">RUT</p>
                <p className="mt-1 text-[#2f363d]">{estudiante.rut}</p>
              </article>

              <article className="rounded-xl border border-[#dfe3e7] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#68727d]">Carrera</p>
                <p className="mt-1 text-[#2f363d]">{estudiante.carrera}</p>
              </article>

              <article className="rounded-xl border border-[#dfe3e7] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#68727d]">Correo</p>
                <p className="mt-1 break-all text-[#2f363d]">{estudiante.correo}</p>
              </article>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-[#dfe3e7] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#68727d]">Semestre actual</p>
                <p className="mt-1 text-xl font-semibold text-[#2f363d]">{estudiante.semestreActual}</p>
              </article>
              <article className="rounded-xl border border-[#dfe3e7] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#68727d]">Inscritos</p>
                <p className="mt-1 text-xl font-semibold text-[#2f363d]">{estudiante.talleresInscritos}</p>
              </article>
              <article className="rounded-xl border border-[#dfe3e7] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#68727d]">Aprobados</p>
                <p className="mt-1 text-xl font-semibold text-[#2f363d]">{estudiante.talleresAprobados}</p>
              </article>
            </div>
          </section>

          <aside className="rounded-2xl border border-[#dfe3e7] bg-gradient-to-b from-[#f6f7f8] to-[#fcfcfd] p-5 shadow-[0_8px_22px_-18px_rgba(31,35,40,0.28)]">
            <h3 className="text-base font-semibold text-[#2f363d]">Resumen</h3>
            <p className="mt-2 text-sm text-[#5a636d]">Asistencia promedio general</p>
            <p className="mt-1 text-3xl font-bold text-[#2f363d]">{estudiante.promedioAsistencia}%</p>
            <div className="mt-3 h-3 w-full rounded-full bg-[#e5e9ee]">
              <div
                className={`h-3 rounded-full ${colorAsistencia(estudiante.promedioAsistencia)}`}
                style={{ width: `${estudiante.promedioAsistencia}%` }}
              />
            </div>

            <p className="mt-6 text-sm text-[#5a636d]">Talleres históricos</p>
            <p className="text-2xl font-semibold text-[#2f363d]">{historialTalleres.length}</p>
          </aside>
        </div>

        <section className="mt-4 rounded-2xl border border-[#dfe3e7] bg-gradient-to-b from-[#f6f7f8] to-[#fcfcfd] p-5 shadow-[0_8px_22px_-18px_rgba(31,35,40,0.28)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2f363d]">Historial de talleres</h2>
            <span className="text-sm font-medium text-[#5a636d]">Total: {historialTalleres.length}</span>
          </div>

          <div className="grid gap-3">
            {historialTalleres.map((taller) => (
              <article
                key={taller.id}
                className="rounded-xl border border-[#dfe3e7] bg-white p-4 transition hover:-translate-y-[1px] hover:border-[#b7c2cd] hover:shadow-[0_10px_20px_-16px_rgba(31,35,40,0.34)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#cfd7df] bg-[#f3f6f9] px-2.5 py-1 text-xs font-semibold text-[#2f363d]">
                        {taller.codigo}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colorEstado(taller.estado)}`}>
                        {taller.estado}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-[#2f363d]">{taller.nombre}</h3>
                    <p className="mt-1 text-sm text-[#5a636d]">Semestre {taller.semestre}</p>
                  </div>

                  <div className="min-w-40">
                    <div className="mb-1 flex items-end justify-between">
                      <span className="text-sm text-[#5a636d]">Asistencia</span>
                      <span className="text-sm font-semibold text-[#2f363d]">{taller.asistencia}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#e5e9ee]">
                      <div
                        className={`h-2.5 rounded-full ${colorAsistencia(taller.asistencia)}`}
                        style={{ width: `${taller.asistencia}%` }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}