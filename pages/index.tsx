// Importación de hooks y componentes necesarios
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

// Definición de la interfaz que representa una vulnerabilidad
interface Vulnerabilidad {
  id: number;
  nombre: string;
  tipo: string;
  riesgo: string;
  fechaDeteccion: string;
  descripcion: string;
  impacto: string;
  ejemplo: string;
  recomendaciones: string;
  owaspReferencia: string;
}

// Componente principal de la página de inicio
export default function Home() {
  // Estados para almacenar datos y filtros
  const [data, setData] = useState<Vulnerabilidad[]>([]);
  const [filtroRiesgo, setFiltroRiesgo] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [mostrarBoton, setMostrarBoton] = useState(false);

  // Carga inicial de datos desde la API
  useEffect(() => {
    fetch("/api/vulnerabilidades")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Mostrar botón "Volver arriba" al hacer scroll
  useEffect(() => {
    const manejarScroll = () => {
      setMostrarBoton(window.scrollY > 300);
    };
    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  // Opciones de filtrado
  const riesgos = ["", "Crítico", "Alto", "Medio", "Bajo"];
  const tipos = Array.from(new Set(data.map((v) => v.tipo)));

  // Colores asociados a cada nivel de riesgo
  const colores: Record<string, string> = {
    Crítico: "bg-danger text-white",
    Alto: "bg-warning text-dark",
    Medio: "bg-info text-dark",
    Bajo: "bg-success text-white",
  };

  // Aplicación de filtros a los datos
  const filtrado = data.filter((v) => {
    return (
      (!filtroRiesgo || v.riesgo === filtroRiesgo) &&
      (!filtroTipo || v.tipo === filtroTipo) &&
      (!filtroFecha || v.fechaDeteccion >= filtroFecha)
    );
  });

  // Renderizado del componente
  return (
    <div
      style={{
        backgroundImage: 'url("/ciberseguridad.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.65)",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Layout title="INKA Security - Dashboard">
          <h1 className="mb-4 text-white">Listado de Vulnerabilidades</h1>

          {/* Filtros de búsqueda */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select
                className="form-select"
                value={filtroRiesgo}
                onChange={(e) => setFiltroRiesgo(e.target.value)}
              >
                <option value="">Filtrar por Riesgo</option>
                {riesgos.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="">Filtrar por Tipo</option>
                {tipos.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de vulnerabilidades */}
          <div className="row gy-4">
            {filtrado.map((v) => (
              <div key={v.id} className="col-md-6">
                <div
                  className="card border-0 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #3b352e, #4e453b)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f8f9fa",
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{v.nombre}</h5>
                    <h6
                      className="card-subtitle mb-2"
                      style={{ color: "#f8f9fa", fontWeight: 500 }}
                    >
                      {v.tipo}
                    </h6>

                    <p className="mb-2">
                      <i className="bi bi-exclamation-triangle me-2" />
                      <span className={`badge ${colores[v.riesgo]}`}>{v.riesgo}</span>
                    </p>

                    <p className="small mb-1">
                      <i className="bi bi-calendar me-2" />
                      Detectada el: {v.fechaDeteccion}
                    </p>

                    <p className="card-text small" style={{ color: "#ffffff" }}>
                      {v.descripcion.length > 150
                        ? `${v.descripcion.slice(0, 150)}...`
                        : v.descripcion}
                    </p>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <Link
                        href={`/vulnerabilidad/${v.id}`}
                        className="btn btn-dark btn-sm text-white d-flex align-items-center"
                        style={{
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          transition: "transform 0.1s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <i className="bi bi-eye-fill me-2" />
                        <span style={{ fontWeight: 500, letterSpacing: "0.5px" }}>
                          Ver detalle
                        </span>
                      </Link>
                      {v.owaspReferencia && (
                        <a
                          href={v.owaspReferencia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-link btn-sm text-info"
                        >
                          OWASP
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mensaje si no hay resultados */}
            {filtrado.length === 0 && (
              <p className="text-muted mt-4">
                No se encontraron vulnerabilidades con esos filtros.
              </p>
            )}
          </div>

          {/* Botón para volver arriba */}
          {mostrarBoton && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="btn btn-primary position-fixed bottom-0 end-0 m-4 shadow rounded-circle d-flex align-items-center justify-content-center"
              style={{
                zIndex: 999,
                width: "50px",
                height: "50px",
                fontSize: "1.25rem",
              }}
              title="Volver arriba"
            >
              <i className="bi bi-arrow-up-short" />
            </button>
          )}
        </Layout>
      </div>
    </div>
  );
}
