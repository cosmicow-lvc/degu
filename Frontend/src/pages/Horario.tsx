import { Fragment, useMemo, useState, type ReactElement } from "react"
import "../App.css"
import "./Horario.css"

interface Taller {
  dia: number
  bloque: number
  titulo: string
  lugar: string
}

const talleres: Array<Taller> = [
  { dia: 1, bloque: 3, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 1, bloque: 4, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 1, bloque: 4, titulo: "Cueca", lugar: "Gimnasio" },
  { dia: 1, bloque: 5, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 1, bloque: 5, titulo: "Bandas", lugar: "Sala multiusos" },
  { dia: 1, bloque: 6, titulo: "Pole Dance", lugar: "Gimnasio" },
  { dia: 2, bloque: 3, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 2, bloque: 3, titulo: "Club Gamer", lugar: "Sala multiusos" },
  { dia: 2, bloque: 4, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 2, bloque: 4, titulo: "Club Gamer", lugar: "Sala multiusos" },
  { dia: 2, bloque: 4, titulo: "Cueca", lugar: "Gimnasio" },
  { dia: 2, bloque: 5, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 2, bloque: 5, titulo: "Club Gamer", lugar: "Sala multiusos" },
  { dia: 2, bloque: 6, titulo: "Jazz Band", lugar: "Sala de Música" },
  { dia: 3, bloque: 1, titulo: "Pintura", lugar: "Taller de Arte" },
  { dia: 3, bloque: 2, titulo: "Pintura", lugar: "Taller de Arte" },
  { dia: 3, bloque: 2, titulo: "Canto", lugar: "Sala multiusos" },
  { dia: 3, bloque: 2, titulo: "Danza", lugar: "Sala de Música" },
  { dia: 3, bloque: 3, titulo: "Pintura", lugar: "Taller de Arte" },
  { dia: 3, bloque: 3, titulo: "Canto", lugar: "Sala multiusos" },
  { dia: 3, bloque: 4, titulo: "Danza", lugar: "Sala de Música" },
  { dia: 3, bloque: 4, titulo: "Teatro", lugar: "Sala multiusos" },
  { dia: 3, bloque: 6, titulo: "Música", lugar: "Sala de Música" },
  { dia: 3, bloque: 7, titulo: "Música", lugar: "Sala de Música" },
  { dia: 4, bloque: 2, titulo: "Club de literatura", lugar: "Sala de Música" },
  { dia: 4, bloque: 2, titulo: "Fotografía", lugar: "Exterior" },
  { dia: 4, bloque: 3, titulo: "Fotografía", lugar: "Exterior" },
  { dia: 4, bloque: 4, titulo: "Teatro", lugar: "Sala multiusos" },
  { dia: 4, bloque: 4, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 4, bloque: 6, titulo: "Pole Dance", lugar: "Gimnasio" },
  { dia: 5, bloque: 4, titulo: "Club TCG", lugar: "Sala J" },
  { dia: 5, bloque: 5, titulo: "Jazz Band", lugar: "Sala de Música" },
  { dia: 5, bloque: 5, titulo: "Bandas", lugar: "Sala multiusos" }
]

export default function Horario(): ReactElement {
  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]
  const bloques = ["A", "B", "C", "C2", "D", "E", "F", "G"]

  const lugares = useMemo(
    () => Array.from(new Set(talleres.map((t) => t.lugar))).sort(),
    []
  )

  // Por defecto: todos seleccionados
  const [lugaresActivos, setLugaresActivos] = useState<string[]>(lugares)

  const toggleLugar = (lugar: string) => {
    setLugaresActivos((prev) =>
      prev.includes(lugar) ? prev.filter((x) => x !== lugar) : [...prev, lugar]
    )
  }

  const talleresFiltrados = useMemo(
    () =>
      talleres.filter(
        (t) => t.bloque > 0 && t.dia > 0 && lugaresActivos.includes(t.lugar)
      ),
    [lugaresActivos]
  )

  const talleresPorCelda = useMemo(() => {
    const map = new Map<string, Taller[]>();
    for (const taller of talleresFiltrados) {
      const key = `${taller.bloque}-${taller.dia}`
      const prev = map.get(key) ?? []
      prev.push(taller)
      map.set(key, prev)
    }
    return map
  }, [talleresFiltrados])

  const seleccionarTodos = () => setLugaresActivos(lugares)
  const limpiarTodos = () => setLugaresActivos([])

  return (
    <section id="center">
      <div className="horario-layout">
        <div className="malla">
          <div className="celda esquina" />

          {dias.map((dia) => (
            <div key={`header-${dia}`} className="celda encabezado-dia">
              {dia}
            </div>
          ))}

          {bloques.map((bloque, bloqueIndex) => (
            <Fragment key={`fila-${bloque}`}>
              <div className="celda encabezado-bloque">{bloque}</div>

              {dias.map((dia, diaIndex) => {
                const bloqueNum = bloqueIndex + 1
                const diaNum = diaIndex + 1
                const key = `${bloqueNum}-${diaNum}`
                const items = talleresPorCelda.get(key) ?? []

                return (
                  <div
                    key={`celda-${bloque}-${dia}`}
                    className={`celda contenido ${items.length > 0 ? "con-taller" : ""}`}
                  >
                    <div className="contenido-lista">
                      {items.map((t, idx) => (
                        <span
                          key={`${t.titulo}-${t.lugar}-${idx}`}
                          className="contenido-item"
                          title={`${t.titulo} · ${t.lugar}`}
                        >
                          {t.titulo}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>

        <aside className="panel-detalle">
          <div className="panel-header">
            <h3>Filtros</h3>
          </div>
          <div className="panel-acciones">
            <button type="button" className="panel-btn" onClick={seleccionarTodos}>
              Seleccionar todos
            </button>
            <button type="button" className="panel-btn panel-btn-sec" onClick={limpiarTodos}>
              Limpiar
            </button>
          </div>

          <div className="panel-lista">
            {lugares.map((lugar) => {
              const checked = lugaresActivos.includes(lugar)

              return (
                <label key={lugar} className={`panel-check ${checked ? "panel-check-activo" : ""}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleLugar(lugar)}
                  />
                  <span className="panel-check-texto">{lugar}</span>
                </label>
              )
            })}
          </div>
        </aside>
      </div>
    </section>
  )
}
