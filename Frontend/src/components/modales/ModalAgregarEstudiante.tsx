import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { registrarUsuario, registrarEstudiantesBatch } from '../../services/estudiantes.service';
import { obtenerTextoCelda, formatRut } from '../../utils/excel.utils';
import { obtenerTalleresPorSemestre, type TallerApi } from '../../services/talleres.service';
import { inscribirEstudiantesBatch } from '../../services/inscripcion.service';
import { obtenerSemestreActual } from '../../utils/semestre.utils';

type EstudianteExcelRow = {
  nombre: string;
  apellido: string;
  rut: string;
  correo: string;
  carrera: string;
  telefono: string;
  talleresTexto: string;
};

interface ProblemaImportacion {
  estudiante: string;
  taller: string;
  motivo: string;
}

export const AgregarEstudiante = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [telefono, setTelefono] = useState('');
  // Ahora guardamos el nombre del taller, no el id
  const [tallerNombreSeleccionado, setTallerNombreSeleccionado] = useState<string>('');

  const [talleresDisponibles, setTalleresDisponibles] = useState<TallerApi[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [exitoMensaje, setExitoMensaje] = useState<string | null>(null);
  const [filasPreview, setFilasPreview] = useState<EstudianteExcelRow[]>([]);

  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [problemasImportacion, setProblemasImportacion] = useState<ProblemaImportacion[]>([]);
  const [mostrarProblemasImportacion, setMostrarProblemasImportacion] = useState(false);

  const semestreActual = obtenerSemestreActual();

  useEffect(() => {
    if (isModalOpen) {
      cargarTalleres();
    }
  }, [isModalOpen]);

  const cargarTalleres = async () => {
    try {
      const data = await obtenerTalleresPorSemestre(semestreActual);
      setTalleresDisponibles(data);
    } catch (err) {
      console.error("Error al cargar talleres:", err);
    }
  };

  // Nombres únicos para el select, ordenados alfabéticamente
  const nombresUnicos = Array.from(
    new Set(talleresDisponibles.map((t) => t.nombre))
  ).sort();

  // Todos los ids que corresponden al nombre seleccionado
  const idsDelTallerSeleccionado = talleresDisponibles
    .filter((t) => t.nombre === tallerNombreSeleccionado)
    .map((t) => t.id);

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setRut('');
    setCorreo('');
    setCarrera('');
    setTelefono('');
    setTallerNombreSeleccionado('');
    setErrorMensaje(null);
    setProblemasImportacion([]);
    setMostrarProblemasImportacion(false);
  };

  const handleAgregarEstudiante = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMensaje(null);
    setExitoMensaje(null);

    try {
      const response = await registrarUsuario({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        rut: rut.trim(),
        correo: correo.trim().toLowerCase(),
        carrera: carrera.trim(),
        telefono: telefono.trim(),
        rol: 'Estudiante',
      });

      const estudianteId = response.usuario.id;

      // Si eligió un taller, inscribir en todos los bloques de ese nombre via batch
      if (tallerNombreSeleccionado && idsDelTallerSeleccionado.length > 0) {
        await inscribirEstudiantesBatch(
          idsDelTallerSeleccionado.map((tallerId) => ({ estudianteId, tallerId }))
        );
      }

      setExitoMensaje('Estudiante agregado e inscrito exitosamente.');
      resetForm();

      setTimeout(() => {
        setIsModalOpen(false);
        setExitoMensaje(null);
      }, 1500);
    } catch (error: any) {
      setErrorMensaje(error.message || 'Error al agregar estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportarExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;
    setIsLoading(true);
    setErrorMensaje(null);
    setExitoMensaje(null);
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await archivo.arrayBuffer());
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error('El archivo no tiene hojas válidas.');

      const filas: EstudianteExcelRow[] = [];
      worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
        if (rowNumber === 1) return;

        const nombreCompleto = obtenerTextoCelda(row.getCell(2).value).trim();
        if (!nombreCompleto) return;

        const partesNombre = nombreCompleto.split(/\s+/);
        const nombre = partesNombre[0] || "";
        const apellido = partesNombre.slice(1).join(" ") || "";

        const rut = obtenerTextoCelda(row.getCell(3).value).trim();
        const carrera = obtenerTextoCelda(row.getCell(4).value).trim();
        const correo = obtenerTextoCelda(row.getCell(6).value).trim().toLowerCase();
        const telefono = obtenerTextoCelda(row.getCell(7).value).trim();
        const talleresTexto = obtenerTextoCelda(row.getCell(8).value).trim();

        if (nombreCompleto && rut && correo) {
          filas.push({ nombre, apellido, rut, carrera, correo, telefono, talleresTexto });
        }
      });

      if (filas.length === 0) throw new Error('El archivo no tiene filas de datos.');

      setFilasPreview(filas);
      setMostrarPreview(true);
    } catch (error: any) {
      setErrorMensaje(error.message || 'Error al leer el archivo Excel.');
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const handleConfirmarImportacion = async () => {
    setIsLoading(true);
    setErrorMensaje(null);
    try {
      setProblemasImportacion([]);
      setMostrarProblemasImportacion(false);

      const todosLosTalleres = await obtenerTalleresPorSemestre(semestreActual);

      // Mapa nombre → todos los ids (para inscribir en todos los bloques del grupo)
      const idsPorNombre = new Map<string, number[]>();
      todosLosTalleres.forEach((t) => {
        const clave = t.nombre.trim().toLowerCase();
        const prev = idsPorNombre.get(clave) ?? [];
        prev.push(t.id);
        idsPorNombre.set(clave, prev);
      });

      const nombrePorTallerId = new Map(todosLosTalleres.map((t) => [t.id, t.nombre]));

      const resCreacion = await registrarEstudiantesBatch(
        filasPreview.map((fila) => ({
          nombre: fila.nombre,
          apellido: fila.apellido,
          rut: formatRut(fila.rut),
          correo: fila.correo,
          carrera: fila.carrera,
          telefono: fila.telefono,
          rol: 'Estudiante',
        }))
      );

      const problemas: ProblemaImportacion[] = [];

      resCreacion.errores.forEach((err) => {
        problemas.push({
          estudiante: `${err.input.nombre} ${err.input.apellido}`,
          taller: '—',
          motivo: err.message,
        });
      });

      const porRut = new Map(resCreacion.creados.map((e) => [e.rut, e.id]));
      const nombrePorEstudianteId = new Map(
        resCreacion.creados.map((e) => [e.id, `${e.nombre} ${e.apellido}`])
      );

      // Construir pares: un estudiante → todos los tallerId de cada nombre que tiene en el Excel
      const pares: { estudianteId: number; tallerId: number }[] = [];

      filasPreview.forEach((fila) => {
        const rutFormateado = formatRut(fila.rut);
        const estudianteId = porRut.get(rutFormateado);
        if (!estudianteId || !fila.talleresTexto) return;

        fila.talleresTexto.split(',').forEach((tBruto) => {
          const nombreLimpio = tBruto.split('(')[0].trim().toLowerCase();
          if (!nombreLimpio) return;

          const ids = idsPorNombre.get(nombreLimpio);
          if (ids && ids.length > 0) {
            ids.forEach((tallerId) => pares.push({ estudianteId, tallerId }));
          } else {
            problemas.push({
              estudiante: `${fila.nombre} ${fila.apellido}`,
              taller: tBruto.trim(),
              motivo: 'No se encontró ese taller en el semestre actual',
            });
          }
        });
      });

      const resInscripcion = await inscribirEstudiantesBatch(pares);

      resInscripcion.resultados
        .filter((r) => r.status !== 'inscrito')
        .forEach((r) => {
          problemas.push({
            estudiante: nombrePorEstudianteId.get(r.estudianteId) ?? `ID ${r.estudianteId}`,
            taller: nombrePorTallerId.get(r.tallerId) ?? `ID ${r.tallerId}`,
            motivo:
              r.status === 'ya_inscrito'
                ? 'El estudiante ya estaba inscrito en ese taller'
                : 'El taller no existe (fue eliminado o cambió de semestre)',
          });
        });

      setProblemasImportacion(problemas);
      setMostrarProblemasImportacion(problemas.length > 0);

      setExitoMensaje(
        `Se importaron ${resCreacion.creados.length} estudiantes correctamente` +
          (problemas.length > 0 ? ` (${problemas.length} incidencias, ver detalle abajo).` : '.')
      );
      setMostrarPreview(false);
      setFilasPreview([]);

      if (problemas.length === 0) {
        setTimeout(() => {
          setIsModalOpen(false);
          setExitoMensaje(null);
        }, 2000);
      }
    } catch (error: any) {
      setErrorMensaje(error.message || 'Error al importar los estudiantes.');
    } finally {
      setIsLoading(false);
    }
  };

  const cerrarProblemasImportacion = () => setMostrarProblemasImportacion(false);
  const handleCancelarImportacion = () => {
    setMostrarPreview(false);
    setFilasPreview([]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline transition-colors"
      >
        Agregar estudiante
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center gap-2 p-4 z-50 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl w-full my-8 max-h-[calc(100vh-2rem)] min-h-0">
            {/* Formulario Manual */}
            <div className="bg-white rounded-lg shadow-xl flex-1 p-6 min-h-0 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <h3 className="text-xl font-bold">Agregar estudiante</h3>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Se creará el estudiante usando el registro del sistema. La contraseña se asignará por defecto.
              </p>

              {errorMensaje && !mostrarPreview && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
                  {errorMensaje}
                </div>
              )}

              {exitoMensaje && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded border border-green-200">
                  {exitoMensaje}
                </div>
              )}

              <form onSubmit={handleAgregarEstudiante} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                    <input
                      type="text"
                      required
                      placeholder="12.345.678-9"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@alumnos.ucn.cl"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
                    <input
                      type="text"
                      placeholder="Ej: Ingeniería Civil"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={carrera}
                      onChange={(e) => setCarrera(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      placeholder="Ej: +56912345678"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taller a Inscribir (Opcional)
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    value={tallerNombreSeleccionado}
                    onChange={(e) => setTallerNombreSeleccionado(e.target.value)}
                  >
                    <option value="">-- No inscribir en ningún taller por ahora --</option>
                    {nombresUnicos.map((nombre) => (
                      <option key={nombre} value={nombre}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                  {tallerNombreSeleccionado && idsDelTallerSeleccionado.length > 1 && (
                    <p className="mt-1 text-xs text-gray-500">
                      El estudiante quedará inscrito en los {idsDelTallerSeleccionado.length} bloques de este taller.
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    {isLoading ? 'Guardando...' : 'Agregar estudiante'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl w-full my-8 max-h-[calc(100vh-2rem)] min-h-0">
            {/* Importación desde Excel */}
            <div className="bg-white rounded-lg shadow-xl flex-1 p-6 flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <h3 className="text-xl font-bold">Importar desde Excel</h3>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Carga el archivo Excel de respuestas del formulario. Los nombres de los talleres se buscarán y asociarán automáticamente.
              </p>

              {errorMensaje && mostrarPreview && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
                  {errorMensaje}
                </div>
              )}

              {!mostrarPreview && (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <label className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer shadow-md">
                    Examinar archivo .xlsx
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleImportarExcel}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                  <span className="text-xs text-gray-400 mt-2">Formatos aceptados: .xlsx</span>
                </div>
              )}

              {mostrarPreview && (
                <div className="flex-1 flex flex-col min-h-0">
                  <p className="text-sm text-gray-600 mb-2">
                    Se encontraron <strong>{filasPreview.length}</strong> estudiantes. Revisa la lista antes de confirmar:
                  </p>

                  <div className="flex-1 max-h-96 overflow-auto border rounded mb-4 shadow-inner">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-100 sticky top-0 border-b">
                        <tr>
                          <th className="px-3 py-2">Nombre completo</th>
                          <th className="px-3 py-2">RUT</th>
                          <th className="px-3 py-2">Carrera</th>
                          <th className="px-3 py-2">Correo</th>
                          <th className="px-3 py-2">Talleres</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filasPreview.map((fila, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium">{fila.nombre} {fila.apellido}</td>
                            <td className="px-3 py-2">{fila.rut}</td>
                            <td className="px-3 py-2 text-gray-500">{fila.carrera}</td>
                            <td className="px-3 py-2">{fila.correo}</td>
                            <td className="px-3 py-2 text-emerald-700 font-semibold">{fila.talleresTexto}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancelarImportacion}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmarImportacion}
                      disabled={isLoading}
                      className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition-all font-medium shadow-md"
                    >
                      {isLoading ? 'Importando...' : 'Confirmar e importar'}
                    </button>
                  </div>
                </div>
              )}

              {mostrarProblemasImportacion && problemasImportacion.length > 0 && (
                <div className="mt-4 border border-yellow-300 bg-yellow-50 rounded p-3 max-h-64 overflow-auto">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-medium text-sm">
                      {problemasImportacion.length} estudiante(s) con incidencias:
                    </p>
                    <button
                      type="button"
                      onClick={cerrarProblemasImportacion}
                      className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pr-4">Estudiante</th>
                        <th className="pr-4">Taller</th>
                        <th>Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {problemasImportacion.map((p, i) => (
                        <tr key={i} className="border-t">
                          <td className="pr-4 py-1">{p.estudiante}</td>
                          <td className="pr-4 py-1">{p.taller}</td>
                          <td className="py-1 text-gray-700">{p.motivo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};