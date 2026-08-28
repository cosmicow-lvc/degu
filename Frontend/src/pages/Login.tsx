import { useState, type JSX } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { loginConCorreo, loginConGoogle } from "../services/auth.service"

export default function Login(): JSX.Element {
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      const data = await loginConCorreo(correo, password)
      login(data.token)
      navigate("/inicio")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("")
    setCargando(true)

    try {
      const decoded: any = jwtDecode(credentialResponse.credential)
      const email = decoded.email.toLowerCase()

      const esCorreoUCN = email.endsWith('@ucn.cl') || email.endsWith('.ucn.cl')

      if (!esCorreoUCN) {
        throw new Error('Acceso denegado: Por favor, utiliza tu correo institucional de la UCN.')
      }

      const data = await loginConGoogle(credentialResponse.credential)
      login(data.token)
      navigate("/inicio")

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
          <h1 className=" text-2xl font-semibold ">Inicio de sesión</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-medium text-slate-700 text-left">
            Correo
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 text-left">
            Contraseña
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
              Recordarme
            </label>
            <button
              type="submit"
              disabled={cargando}
              className={`inline-flex justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
                cargando ? "bg-slate-400 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800"
              }`}
            >
              {cargando ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-sm text-slate-400">O continuar con Google</span>
              <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('El inicio de sesión con Google fue cancelado o falló.')}
              useOneTap={false}
              shape="rectangular"
              theme="outline"
              text="signin_with"
            />
          </div>
        </div>
      </section>
    </main>
  )
}