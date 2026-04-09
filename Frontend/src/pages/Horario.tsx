import { Fragment, useMemo, useState, type ReactElement } from "react"
import "../App.css"
import "./Horario.css"

interface Taller {
  dia: number
  bloque: number
  titulo: string
}

const talleres: Array<Taller> = [
  { dia: 1, bloque: 3, titulo: "Danza" },
  { dia: 1, bloque: 3, titulo: "Teatro" },
  { dia: 4, bloque: 5, titulo: "Danza" },
  { dia: 3, bloque: 1, titulo: "Musica" },
  { dia: 6, bloque: 3, titulo: "Pintura" },
]

export default function Horario(): ReactElement {
  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]
  const bloques = ["A", "B", "C", "C2", "D", "E", "F", "G"]

  const talleresPorCelda = useMemo(() => {
    const map = new Map<string, Taller[]>()

    for (const taller of talleres) {
      if (taller.bloque <= 0 || taller.dia <= 0) continue
      const key = `${taller.bloque}-${taller.dia}`
      const prev = map.get(key) ?? []
      prev.push(taller)
      map.set(key, prev)
    }

    return map
  }, [])

  const [seleccion, setSeleccion] = useState<{ bloque: number; dia: number } | null>(null)
  const [busqueda, setBusqueda] = useState("")

  const talleresSeleccionados = useMemo(() => {
    if (!seleccion) return []
    return talleresPorCelda.get(`${seleccion.bloque}-${seleccion.dia}`) ?? []
  }, [seleccion, talleresPorCelda])

  const talleresFuentePanel = useMemo(() => {
    if (seleccion) return talleresSeleccionados
    return talleres.filter((t) => t.bloque > 0 && t.dia > 0)
  }, [seleccion, talleresSeleccionados])

  const talleresFiltradosPanel = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return talleresFuentePanel
    return talleresFuentePanel.filter((t) => t.titulo.toLowerCase().includes(q))
  }, [talleresFuentePanel, busqueda])

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
                const cantidad = items.length
                const activa = seleccion?.bloque === bloqueNum && seleccion?.dia === diaNum

                return (
                  <button
                    type="button"
                    key={`celda-${bloque}-${dia}`}
                    className={`celda contenido celda-click ${cantidad > 0 ? "con-taller" : ""} ${activa ? "activa" : ""}`}
                    onClick={() =>
                      setSeleccion((prev) =>
                        prev?.bloque === bloqueNum && prev?.dia === diaNum
                          ? null
                          : { bloque: bloqueNum, dia: diaNum }
                      )
                    }
                  >
                    {cantidad > 0 ? cantidad : ""}
                  </button>
                )
              })}
            </Fragment>
          ))}
        </div>

        <aside className="panel-detalle">
          <h3>Detalle</h3>

          <input
            className="panel-busqueda"
            type="text"
            placeholder="Buscar taller..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {!seleccion && <p className="panel-meta">Mostrando todos los talleres</p>}

          {seleccion && (
            <p className="panel-meta">
              Bloque {bloques[seleccion.bloque - 1]} · {dias[seleccion.dia - 1]}
            </p>
          )}

          <p className="panel-total">Total: {talleresFiltradosPanel.length}</p>

          {talleresFiltradosPanel.length === 0 && <p>No se encontraron talleres.</p>}

          {talleresFiltradosPanel.length > 0 && (
            <div className="panel-lista">
              {talleresFiltradosPanel.map((taller, idx) => (
                <article key={`${taller.titulo}-${taller.bloque}-${taller.dia}-${idx}`} className="panel-card">
                  <div className="panel-card-titulo">{taller.titulo}</div>
                  <div className="panel-card-meta">
                    Bloque {bloques[taller.bloque - 1]} · {dias[taller.dia - 1]}
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
