import { useEffect, useState } from "react";
import Layout from "../components/Layout";

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

export default function Admin() {
  const [data, setData] = useState<Vulnerabilidad[]>([]);
  const [form, setForm] = useState<Omit<Vulnerabilidad, "id">>({
    nombre: "",
    tipo: "",
    riesgo: "Medio",
    descripcion: "",
    recomendaciones: "",
    fechaDeteccion: new Date().toISOString().split("T")[0],
    impacto: "",
    ejemplo: ""
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [rolUsuario, setRolUsuario] = useState<"admin" | "analista">("admin");

  useEffect(() => {
    fetch("/api/vulnerabilidades")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const agregar = async () => {
    const res = await fetch("/api/vulnerabilidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    setData([...data, { ...form, id: result.id }]);
    resetForm();
  };

  const actualizar = async () => {
    if (editId === null) return;
    const actualizada = { ...form, id: editId };
    const res = await fetch("/api/vulnerabilidades", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizada),
    });
    if (res.ok) {
      setData(data.map((v) => (v.id === editId ? actualizada : v)));
      resetForm();
    }
  };

  const eliminar = async (id: number) => {
    await fetch("/api/vulnerabilidades", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData(data.filter((v) => v.id !== id));
  };

  const cargarParaEditar = (v: Vulnerabilidad) => {
    const { id, ...resto } = v;
    setForm(resto);
    setEditId(id);
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      tipo: "",
      riesgo: "Medio",
      descripcion: "",
      recomendaciones: "",
      fechaDeteccion: new Date().toISOString().split("T")[0],
      impacto: "",
      ejemplo: ""
    });
    setEditId(null);
  };

  return (
    <Layout title="Administrar Vulnerabilidades">
      <div className="mb-4">
        <label className="form-label text-light me-2">Perfil:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={rolUsuario}
          onChange={(e) => setRolUsuario(e.target.value as "admin" | "analista")}
        >
          <option value="admin">Administrador</option>
          <option value="analista">Analista</option>
        </select>
      </div>

      {rolUsuario === "admin" && (
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
                placeholder="Nombre"
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
            {rolUsuario === "admin" && (
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
