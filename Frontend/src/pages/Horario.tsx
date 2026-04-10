import { Fragment, type ReactElement } from "react"
import "../App.css"
import "./Horario.css"

export default function Horario(): ReactElement {
  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]
  const bloques = ["A", "B", "C", "C2", "D", "E", "F", "G"]

  return (
    <section id="center">
      <div className="malla">
        <div className="celda esquina" />

        {dias.map((dia) => (
          <div key={`header-${dia}`} className="celda encabezado-dia">
            {dia}
          </div>
        ))}

        {bloques.map((bloque) => (
          <Fragment key={`fila-${bloque}`}>
            <div className="celda encabezado-bloque">
              {bloque}
            </div>

            {dias.map((dia) => (
              <div key={`celda-${bloque}-${dia}`} className="celda contenido" />
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
