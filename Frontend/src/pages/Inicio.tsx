import { type ReactElement } from "react"
import Navbar from "../components/navbar"
import Horario from "../components/Horario/Horario"
import PanelDirectivo from "../components/DashBoard/PanelDirectivo"
import { useAuth } from "../context/AuthContext"

export default function Inicio(): ReactElement {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-start grow p-6 bg-white m-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sistema de Gestión Estudiantil
          </h1>
          <p className="text-gray-700 mb-8">
            Bienvenido al panel principal de Galpón Cultural.
          </p>
        </div>
        
        {user?.rol === 'Administrador' && (
          <section className="mb-8">
            <PanelDirectivo />
          </section>
        )}
          <Horario modo="inicio" />

      </main>
    </div>
  )
}