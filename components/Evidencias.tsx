import { useState } from "react";

// Tipo de dato para una evidencia
interface Evidencia {
  id: number;
  nombre: string;
  tipo: string;
  url: string;
  esPrincipal: boolean;
}

// Componente
export default function Evidencias({ vulnerabilidadId }: { vulnerabilidadId: number }) {
  const [archivos, setArchivos] = useState<Evidencia[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const tiposPermitidos = ["application/pdf", "image/png", "image/jpeg"];

  // ✅ Subida o reemplazo de archivo
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    reemplazarId?: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();

    for (const file of Array.from(files)) {
      if (!tiposPermitidos.includes(file.type)) {
        alert("Formato no permitido. Solo se aceptan PDF, PNG o JPG.");
        return;
      }
      formData.append("evidencias", file);
    }

    setSubiendo(true);

    try {
      const res = await fetch(`/api/evidencias/${vulnerabilidadId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const nuevas = data.archivos.map((archivo: any) => ({
        id: reemplazarId ?? Math.floor(Math.random() * 100000),
        nombre: archivo.nombre,
        tipo: archivo.tipo,
        url: archivo.ruta, // ✅ URL real del archivo subido
        esPrincipal: false,
      }));

      setArchivos((prev) => {
        if (reemplazarId) {
          return prev.map((e) => (e.id === reemplazarId ? nuevas[0] : e));
        }
        return [...prev, ...nuevas];
      });
    } catch (err) {
      console.error("Error al subir archivo:", err);
      alert("Hubo un error al subir el archivo.");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  // 👉 Marcar como principal
  const seleccionarPrincipal = (id: number) => {
    setArchivos((prev) =>
      prev.map((e) => ({ ...e, esPrincipal: e.id === id }))
    );
    // Bonus: podrías hacer un PATCH al backend para persistir esto
  };

  // 👉 Eliminar archivo
  const eliminarArchivo = (id: number) => {
    if (confirm("¿Eliminar este archivo?")) {
      setArchivos((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="mt-5">
      <h5 className="text-light mb-3">🗂 Evidencias</h5>

      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        multiple
        onChange={(e) => handleUpload(e)}
        className="form-control mb-3"
        disabled={subiendo}
      />

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

                <label className="btn btn-outline-warning btn-sm mb-0">
                  Reemplazar
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    hidden
                    onChange={(e) => handleUpload(e, evidencia.id)}
                  />
                </label>

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
