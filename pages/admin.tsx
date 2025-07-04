// Importación de hooks de React y del layout común de la aplicación
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

// Interfaz que describe la estructura de una vulnerabilidad
interface Vulnerabilidad {
  id: number;
  nombre: string;
  tipo: string;
  riesgo: string;
  descripcion: string;
  recomendaciones: string;
  fechaDeteccion: string;
  impacto: string;
  ejemplo: string;
}

// Componente principal de administración
export default function Admin() {
  // Estado que contiene el listado de vulnerabilidades cargadas desde el backend
  const [data, setData] = useState<Vulnerabilidad[]>([]);

  // Estado del formulario, con los mismos campos que la interfaz excepto "id"
  const [form, setForm] = useState<Omit<Vulnerabilidad, "id">>({
    nombre: "",
    tipo: "",
    riesgo: "Medio", // valor por defecto
    descripcion: "",
    recomendaciones: "",
    fechaDeteccion: new Date().toISOString().split("T")[0], // fecha actual por defecto (formato YYYY-MM-DD)
    impacto: "",
    ejemplo: ""
  });

  // Estado que guarda el ID del elemento a editar (si se está en modo edición)
  const [editId, setEditId] = useState<number | null>(null);

  // Rol actual del usuario para definir permisos (admin puede editar/eliminar, analista solo visualiza)
  const [rolUsuario, setRolUsuario] = useState<"admin" | "analista">("admin");

  // Efecto que se ejecuta al montar el componente para traer los datos desde la API
  useEffect(() => {
    fetch("/api/vulnerabilidades")
      .then((res) => res.json())
      .then(setData); // actualiza el estado con los datos obtenidos
  }, []);

  // Función para agregar una nueva vulnerabilidad
  const agregar = async () => {
    const res = await fetch("/api/vulnerabilidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), // se envía el formulario como JSON
    });

    const result = await res.json(); // se recibe el nuevo ID generado en el backend
    setData([...data, { ...form, id: result.id }]); // se agrega al array actual
    resetForm(); // se limpia el formulario
  };

  // Función para actualizar una vulnerabilidad existente
  const actualizar = async () => {
    if (editId === null) return; // si no hay ID en edición, salimos

    const actualizada = { ...form, id: editId }; // combinamos form + id
    const res = await fetch("/api/vulnerabilidades", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizada),
    });

    if (res.ok) {
      // si se actualizó correctamente, reemplazamos en el array local
      setData(data.map((v) => (v.id === editId ? actualizada : v)));
      resetForm(); // limpiamos estado
    }
  };

  // Función para eliminar una vulnerabilidad por su ID
  const eliminar = async (id: number) => {
    await fetch("/api/vulnerabilidades", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // se envía solo el ID
    });

    setData(data.filter((v) => v.id !== id)); // eliminamos del array local
  };

  // Función que carga los datos de una vulnerabilidad al formulario para ser editados
  const cargarParaEditar = (v: Vulnerabilidad) => {
    const { id, ...resto } = v; // separamos el ID del resto de los campos
    setForm(resto);             // cargamos los campos al formulario
    setEditId(id);              // guardamos el ID para futura actualización
  };

// Restaura el formulario a su estado inicial (campos vacíos o valor por defecto)
const resetForm = () => {
  setForm({
    nombre: "",
    tipo: "",
    riesgo: "Medio", // Riesgo por defecto
    descripcion: "",
    recomendaciones: "",
    fechaDeteccion: new Date().toISOString().split("T")[0], // Fecha actual
    impacto: "",
    ejemplo: ""
  });
  setEditId(null); // Sale del modo edición
};


  return ( //Se renderiza el contenido usando layout general y el titulo indica que estamos en el modulo de administración.
    <Layout title="Administrar Vulnerabilidades">
      <div className="mb-4">
        <label className="form-label text-light me-2">Perfil:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={rolUsuario}
          onChange={(e) => setRolUsuario(e.target.value as "admin" | "analista")} //Permite cambiar entre el modo "admin" y el "analista"
        >
          <option value="admin">Administrador</option>
          <option value="analista">Analista</option>
        </select>
      </div>

      {rolUsuario === "admin" && ( //Se muestra solo el perfil de adminstrador
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editId === null ? agregar() : actualizar();
          }}
          className="p-4 rounded shadow mb-5 text-light"
          style={{
            background: "linear-gradient(135deg, rgba(9, 53, 97, 0.95), rgba(89, 41, 97, 0.95))",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre" //El valor es bidireccional: El input muestra lo que hay en form.nombre, y cuaalquier cambio se refleja en el estado. Lo mismo aplica para los demas como: Tipo, Riesgo, Descripcion, Impacto, Ejemplo, Recomendaciones, FechaDetección.
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Tipo de vulnerabilidad"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={form.riesgo}
                onChange={(e) => setForm({ ...form, riesgo: e.target.value })}
              >
                <option>Crítico</option>
                <option>Alto</option>
                <option>Medio</option>
                <option>Bajo</option>
              </select>
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Descripción técnica"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Impacto"
                value={form.impacto}
                onChange={(e) => setForm({ ...form, impacto: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Ejemplo"
                value={form.ejemplo}
                onChange={(e) => setForm({ ...form, ejemplo: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Recomendaciones (separadas por puntos)"
                value={form.recomendaciones}
                onChange={(e) =>
                  setForm({ ...form, recomendaciones: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                value={form.fechaDeteccion}
                onChange={(e) =>
                  setForm({ ...form, fechaDeteccion: e.target.value })
                }
              />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success me-2"> 
                {editId === null ? "Agregar" : "Actualizar"} 
              </button>
              {editId !== null && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="list-group">
        {data.map((v) => (
          <div
            key={v.id}
            className="list-group-item border-0 text-light d-flex justify-content-between align-items-center rounded shadow-sm mb-3"
            style={{
              background: "linear-gradient(135deg,rgb(195, 18, 18),rgb(7, 7, 7))",
              border: "1px solid rgba(255, 255, 255, 0.05)"
            }}
          >
            <div>
              <h5 className="mb-1">{v.nombre}</h5>
              <small className="text-white">{v.descripcion}</small>
            </div>
            {rolUsuario === "admin" && ( //Editar: carga el item al formulario para modificarlo. Eliminar: Lo borra de la lista y del backend (Esto solo si es admin)
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-info btn-sm"
                  style={{ minWidth: "80px" }}
                  onClick={() => cargarParaEditar(v)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ minWidth: "80px" }}
                  onClick={() => eliminar(v.id)}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
