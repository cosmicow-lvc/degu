import type { ReactElement } from "react"
import Navbar from "../components/navbar"
import Schedule from "../components/Horario/Horario"

export default function Horario(): ReactElement {
  return (
    
  
    <div className="min-h-screen  ">
      <Navbar />
      <Schedule />
    </div>

   

  
  )
}
