import { useState } from 'react';

const AsistenciaForm = () => {
  const [rut, setRut] = useState('');
  const [satisfaccion, setSatisfaccion] = useState<number | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rut, satisfaccion });
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Asistencia Registrada!</h2>
          <p className="text-gray-600">Tu participación en el taller ha sido guardada correctamente.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 w-full py-3 bg-gray-800 text-white rounded-xl font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {}
      <div className="w-full max-w-md mt-8 mb-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Galpón Cultural UCN</h1>
        <p className="text-gray-500 italic">Registro de Asistencia</p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-8"
      >
        {}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ingresa tu RUT (sin puntos ni guion)
          </label>
          <input
            type="text"
            required
            placeholder="12345678"
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-colors text-lg"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
            ¿Qué te pareció el taller de hoy?
          </label>
          <div className="flex justify-between items-center gap-2">
            {[1, 2, 3, 4, 5].map((nivel) => (
              <button
                key={nivel}
                type="button"
                onClick={() => setSatisfaccion(nivel)}
                className={`flex-1 py-4 text-2xl rounded-xl transition-all ${
                  satisfaccion === nivel 
                    ? 'bg-blue-600 scale-110 shadow-lg' 
                    : 'bg-gray-100 grayscale opacity-60'
                }`}
              >
                {['😠', '🙁', '😐', '🙂', '🤩'][nivel - 1]}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span>Malo</span>
            <span>Excelente</span>
          </div>
        </div>

        {}
        <button
          type="submit"
          disabled={!rut || !satisfaccion}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
            rut && satisfaccion 
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirmar Asistencia
        </button>
      </form>

      <p className="mt-8 text-xs text-gray-400 text-center max-w-[250px]">
        Al registrarte confirmas que has participado en la sesión de hoy.
      </p>
    </div>
  );
};

export default AsistenciaForm;