import type { JSX } from "react/jsx-dev-runtime"

export default function Registro(): JSX.Element {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-white border border-slate-200 rounded-[30px] shadow-[0_28px_80px_rgba(15,23,42,0.08)] p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Crear cuenta</h1>
        </div>

        <form className="space-y-6">
          <label className="block text-sm text-left font-medium text-slate-700">
            Nombre completo
            <input
              type="text"
              name="name"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Nombre Apellido1 Apellido2"
            />
          </label>

          <label className="block text-sm text-left font-medium text-slate-700">
            Correo electrónico
            <input
              type="email"
              name="email"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="tucorreo@ejemplo.com"
            />
          </label>

          <label className="block text-sm text-left font-medium text-slate-700">
            Contraseña
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Crea una contraseña"
            />
          </label>

          <label className="block text-sm text-left font-medium text-slate-700">
            Confirmar contraseña
            <input
              type="password"
              name="confirmPassword"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Repite tu contraseña"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Registrar
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="font-semibold text-slate-900 hover:underline">
            Inicia sesión
          </a>
        </p>
      </section>
    </main>
  )
}
