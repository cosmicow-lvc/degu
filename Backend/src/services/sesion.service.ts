import { prisma } from '../lib/prisma'; // Asegúrate de importar desde tu cliente generado
import crypto from 'crypto';

export class SesionService {
  
  async crear(tallerId: number, bloque: number, minutos: number) {
    if (typeof bloque !== 'number') {
      throw new Error("El bloque debe ser un número entero.");
    }

    const ahora = new Date();

    const sesionVigente = await prisma.sesion.findFirst({
      where: {
        tallerId,
        bloque,
        validoHasta: {
          gt: ahora,
        },
      },
      orderBy: {
        validoHasta: 'desc',
      },
    });

    if (sesionVigente) {
      return sesionVigente;
    }

    const token = crypto.randomBytes(16).toString('hex');
    const fechaExpiracion = new Date();
    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + minutos);

    return await prisma.sesion.create({
      data: {
        tallerId,
        bloque,
        qrToken: token,
        validoHasta: fechaExpiracion,
        fecha: new Date()
      }
    });
  }

  async validar(token: string) {
    return await prisma.sesion.findFirst({
      where: {
        qrToken: token,
        validoHasta: {
          gt: new Date()
        }
      },
      include: {
        taller: {
          select: { nombre: true }
        }
      }
    });
  }

  async listarPorTaller(tallerId: number) {
    return await prisma.sesion.findMany({
      where: { tallerId },
      orderBy: { fecha: 'desc' }
    });
  }

  async finalizar(id: number) {
    return await prisma.sesion.update({
      where: { id },
      data: {
        validoHasta: new Date()
      }
    });
  }
  async obtenerOCrearDeHoy(tallerId: number, bloque: number, minutos: number) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const existente = await prisma.sesion.findFirst({
      where: {
        tallerId,
        bloque,
        fecha: { gte: hoy, lt: manana }
      }
    });

    if (existente) return existente;

    return this.crear(tallerId, bloque, minutos);
  }
}