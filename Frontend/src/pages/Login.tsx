
import type { JSX } from "react/jsx-dev-runtime"
import "../App.css"

export default function Login(): JSX.Element {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-white border border-slate-200 rounded-[30px] shadow-[0_28px_80px_rgba(15,23,42,0.08)] p-8">
        <div className="mb-8 text-center text-black">
          <h1 className=" text-2xl font-semibold ">Inicio de sesión</h1>
        </div>

        <form className="space-y-6">
          <label className="block text-sm font-medium text-slate-700 text-left">
            Correo
            <input
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 text-left">
            Contraseña
            <input
              type="password"
              name="password"
              required
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
              className="inline-flex justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Olvidaste tu contraseña?{' '}
          <a href="#" className="font-semibold text-slate-900 hover:underline">
            Restaurarla
          </a>
        </p>
      </section>
    </main>
  )
}