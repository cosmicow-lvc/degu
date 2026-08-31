import { useState, type JSX } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  solicitarRecuperacion,
  restablecerContrasena,
} from "../services/auth.service"

export default function RestaurarContrasena(): JSX.Element {
  const [paso, setPaso] = useState<1 | 2 | 3>(1)
  const [correo, setCorreo] = useState("")
  const [token, setToken] = useState("")
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)
    try {
      const data = await solicitarRecuperacion(correo)
      if (data.token) {
        setToken(data.token)
        setPaso(2)
      } else {
        // Por si en el futuro se conecta un envío de correo real
        setError("Si el correo existe, revisa tu bandeja de entrada.")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const handleRestablecer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setCargando(true)
    try {
      await restablecerContrasena(token, nuevaPassword)
      setPaso(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-white border border-slate-200 rounded-[30px] shadow-[0_28px_80px_rgba(15,23,42,0.08)] p-8">
        <div className="mb-8 text-center text-black">
          <h1 className="text-2xl font-semibold">Restaurar contraseña</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {paso === 1 && (
          <form onSubmit={handleSolicitar} className="space-y-6">
            <label className="block text-sm font-medium text-slate-700 text-left">
              Correo institucional
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <button
              type="submit"
              disabled={cargando}
              className={`w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
                cargando ? "bg-slate-400 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800"
              }`}
            >
              {cargando ? "Enviando..." : "Continuar"}
            </button>
          </form>
        )}

        {paso === 2 && (
          <form onSubmit={handleRestablecer} className="space-y-6">
            <label className="block text-sm font-medium text-slate-700 text-left">
              Nueva contraseña
              <input
                type="password"
                required
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 text-left">
              Confirmar contraseña
              <input
                type="password"
                required
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <button
              type="submit"
              disabled={cargando}
              className={`w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
                cargando ? "bg-slate-400 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800"
              }`}
            >
              {cargando ? "Guardando..." : "Restablecer contraseña"}
            </button>
          </form>
        )}

        {paso === 3 && (
          <div className="text-center space-y-6">
            <p className="text-slate-700">Tu contraseña fue actualizada correctamente.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 transition"
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-400">
          <Link to="/" className="text-slate-900 font-medium hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </section>
    </main>
  )
}