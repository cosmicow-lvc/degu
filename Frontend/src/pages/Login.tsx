
import type { JSX } from "react/jsx-dev-runtime"
import "../App.css"
import "./Login.css"

export default function Login(): JSX.Element {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>Inicio de sesión</h1>
        </div>

        <form className="login-form">
          <label>
            Correo
            <input type="email" required />
          </label>

          <label>
            Contraseña
            <input type="password" name="password" required />
          </label>

          <div className="login-actions">
            <label className="remember-label">
              <input type="checkbox" name="remember" />
              Recordarme
            </label>
            <button type="submit">Entrar</button>
          </div>
        </form>

        <p className="login-footnote">
          ¿Olvidaste tu contraseña? <a href="#">Restaurarla</a>
        </p>
      </section>
    </main>
  )
}