import { useState } from "react";

// Interfaz que define la estructura de una evidencia
interface Evidencia {
  id: number;
  nombre: string;
  tipo: string;
  url: string;
  esPrincipal: boolean;
}

// Componente que gestiona las evidencias de una vulnerabilidad
export default function Evidencias({ vulnerabilidadId }: { vulnerabilidadId: number }) {
  // Estado para almacenar las evidencias cargadas
  const [archivos, setArchivos] = useState<Evidencia[]>([]);

  // Estado para indicar si se está subiendo un archivo
  const [subiendo, setSubiendo] = useState(false);

  // Tipos de archivos permitidos
  const tiposPermitidos = ["application/pdf", "image/png", "image/jpeg"];

  // Maneja la carga de archivos
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();

    // Validación de tipo de archivo
    for (const file of Array.from(files)) {
      if (!tiposPermitidos.includes(file.type)) {
        alert("Formato no permitido. Solo PDF, PNG y JPG.");
        return;
      }
      formData.append("evidencias", file);
    }

    // Enviar archivos al servidor
    setSubiendo(true);
    await fetch(`/api/evidencias/${vulnerabilidadId}`, {
      method: "POST",
      body: formData,
    });
    setSubiendo(false);

    // Nota: aquí podrías actualizar la lista de archivos desde el backend
  };

  // Marca una evidencia como principal
  const seleccionarPrincipal = (id: number) => {
    setArchivos(prev =>
      prev.map(e => ({ ...e, esPrincipal: e.id === id }))
    );
  };

  // Elimina una evidencia de la lista (solo en el frontend)
  const eliminarArchivo = (id: number) => {
    if (confirm("¿Eliminar este archivo?")) {
      setArchivos(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="mt-5">
      <h5 className="text-light mb-3">🗂 Evidencias</h5>

      {/* Input para subir archivos */}
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        multiple
        onChange={handleUpload}
        className="form-control mb-3"
        disabled={subiendo}
      />

      {/* Lista de evidencias o mensaje si no hay */}
      {archivos.length === 0 ? (
        <p className="text-white">No hay evidencias cargadas.</p>
      ) : (
        <ul className="list-group">
          {archivos.map((evidencia) => (
            <li
              key={evidencia.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{evidencia.nombre}</strong>{" "}
                {evidencia.tipo.includes("image") && "🖼"}
                {evidencia.esPrincipal && (
                  <span className="badge bg-primary ms-2">Principal</span>
                )}
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => seleccionarPrincipal(evidencia.id)}
                >
                  Marcar principal
                </button>
                <a
                  href={evidencia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info btn-sm"
                >
                  Ver
                </a>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => eliminarArchivo(evidencia.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
