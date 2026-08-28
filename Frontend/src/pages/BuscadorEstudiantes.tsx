import { useEffect, useState, type ReactElement } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import { buscarEstudiantes } from "../services/estudiantes.service"
import type { Estudiante } from "../interfaces/Estudiante"
const LIMITE = 10

export default function BuscadorEstudiantes(): ReactElement {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalResultados, setTotalResultados] = useState(0)
  const [resultados, setResultados] = useState<Estudiante[]>([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const texto = query.trim()

    if (!texto) {
      setResultados([])
      setTotalPaginas(0)
      setTotalResultados(0)
      setCargando(false)
      return
    }

    let activo = true
    setCargando(true)

    const timeout = setTimeout(async () => {
      try {
        const response = await buscarEstudiantes(texto, pagina, LIMITE)
        if (!activo) return

        setResultados(response.data)
        setTotalPaginas(response.meta.totalPages)
        setTotalResultados(response.meta.total)
      } catch {
        if (activo) {
          setResultados([])
          setTotalPaginas(0)
          setTotalResultados(0)
        }
      } finally {
        if (activo) setCargando(false)
      }
    }, 500)

    return () => {
      activo = false
      clearTimeout(timeout)
    }
  }, [query, pagina])

  const irAlPerfil = (estudiante: Estudiante) => {
    navigate("/perfil", {
      state: {
        estudiante,
      },
    })
  }

  const cambiarQuery = (valor: string) => {
    setQuery(valor)
    setPagina(1)
  }

  const irPaginaAnterior = () => {
    setPagina((actual) => Math.max(actual - 1, 1))
  }

  const irPaginaSiguiente = () => {
    setPagina((actual) => actual + 1)
  }

  const hayBusqueda = query.trim().length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="min-h-screen px-4 py-8 sm:px-6">
        <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col">
          <header className="mb-6 rounded-2xl border border-[#dfe3e7] bg-white p-6 shadow-[0_8px_22px_-18px_rgba(31,35,40,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2f363d]">
              Buscador de estudiantes
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#2f363d]">Buscar por nombre o RUT</h1>

            <input
              type="text"
              value={query}
              onChange={(e) => cambiarQuery(e.target.value)}
              placeholder="Ej: Camila o 20.123.456-7"
              className="mt-4 w-full rounded-xl border border-[#dfe3e7] bg-[#f8fafc] px-4 py-3 text-[#2f363d] outline-none transition focus:border-[#bfc8d1]"
            />
          </header>

          <div className="flex-1">
            <div className="grid gap-3">
              {cargando && <p className="text-sm text-[#5a636d]">Buscando estudiantes...</p>}

              {resultados.map((estudiante) => (
                <button
                  key={estudiante.id}
                  type="button"
                  onClick={() => irAlPerfil(estudiante)}
                  className="rounded-xl border border-[#dfe3e7] bg-[#f8fafc] p-4 text-left transition hover:border-[#bfc8d1] hover:bg-white"
                >
                  <p className="font-semibold text-[#2f363d]">
                    {estudiante.nombre} {estudiante.apellido ?? ""}
                  </p>
                  <p className="text-sm text-[#5a636d]">{estudiante.rut}</p>
                  <p className="text-sm text-[#5a636d]">{estudiante.correo}</p>
                </button>
              ))}
            </div>
          </div>

          {hayBusqueda && (
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#dfe3e7] bg-white px-4 py-3 shadow-[0_8px_22px_-18px_rgba(31,35,40,0.28)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#5a636d]">
                {totalResultados > 0
                  ? `Mostrando ${resultados.length} de ${totalResultados} estudiantes`
                  : "No hay resultados para mostrar"}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={irPaginaAnterior}
                  disabled={cargando || pagina === 1}
                  className="rounded-xl border border-[#dfe3e7] bg-white px-4 py-2 text-sm font-semibold text-[#2f363d] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>

                <span className="min-w-24 text-center text-sm font-medium text-[#5a636d]">
                  Página {totalPaginas > 0 ? pagina : 0} de {totalPaginas}
                </span>

                <button
                  type="button"
                  onClick={irPaginaSiguiente}
                  disabled={cargando || pagina >= totalPaginas || totalPaginas === 0}
                  className="rounded-xl border border-[#dfe3e7] bg-white px-4 py-2 text-sm font-semibold text-[#2f363d] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}