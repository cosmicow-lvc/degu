// src/services/authService.ts

const baseUrl = import.meta.env.VITE_API_URL
export interface SolicitarRecuperacionRequest {
  correo: string
}

export interface SolicitarRecuperacionResponse {
  mensaje: string
  token?: string
}
export interface LoginResponse {
  token: string
  [key: string]: any
}

/**
 * Llama al backend para autenticar con correo y contraseña.
 * Lanza un Error con mensaje legible si la respuesta no es OK.
 */
export async function loginConCorreo(
  correo: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  })

  const data = await response.json()

  if (!response.ok) { 
    if (response.status === 404 || response.status === 401) {
      throw new Error("Credenciales incorrectas. Inténtalo nuevamente.");
    }
    throw new Error(data.message || data.error || "Ocurrió un problema al iniciar sesión. Inténtalo más tarde.");
  }

  return data as LoginResponse
}

/**
 * Llama al backend para autenticar con un token de Google (JWT credential).
 */
export async function loginConGoogle(credentialToken: string): Promise<LoginResponse> {
  const response = await fetch(`${baseUrl}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: credentialToken }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Error al autenticar con Google en el servidor.")
  }

  return data as LoginResponse
}
// reemplaza la función solicitarRecuperacion existente y agrega restablecerContrasena

export const solicitarRecuperacion = async (
  correo: string
): Promise<SolicitarRecuperacionResponse> => {
  const response = await fetch(`${baseUrl}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "No se pudo solicitar la recuperación")
  }

  return data
}

export interface RestablecerContrasenaResponse {
  mensaje: string
}

export const restablecerContrasena = async (
  token: string,
  nuevaPassword: string
): Promise<RestablecerContrasenaResponse> => {
  const response = await fetch(`${baseUrl}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, nuevaPassword }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "No se pudo restablecer la contraseña")
  }

  return data
}