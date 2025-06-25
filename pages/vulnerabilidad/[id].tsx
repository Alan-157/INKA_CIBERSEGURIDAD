import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Evidencias from "../../components/Evidencias";

interface Vulnerabilidad {
  id: number;
  nombre: string;
  tipo: string;
  riesgo: string;
  fechaDeteccion: string;
  descripcion: string;
  impacto: string;
  ejemplo: string;
  cwe: string;
  owaspReferencia: string;
  recomendaciones: string;
}

export default function Detalle() {
  const [vuln, setVuln] = useState<Vulnerabilidad | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch("/api/vulnerabilidades")
      .then((res) => res.json())
      .then((datos: Vulnerabilidad[]) => {
        const encontrada = datos.find((v) => v.id === Number(id));
        setVuln(encontrada || null);
      });
  }, [id]);

  const colores: Record<string, string> = {
    Crítico: "bg-danger text-white",
    Alto: "bg-warning text-dark",
    Medio: "bg-info text-dark",
    Bajo: "bg-success text-white",
  };

  if (!vuln) {
    return (
      <Layout title="Detalle">
        <p className="text-light">Cargando detalle...</p>
      </Layout>
    );
  }

  return (
    <div
      style={{
        backgroundImage: 'url("/ciberseguridad.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <Layout title={vuln.nombre}>
          <div
            className="card text-white shadow-sm border-0"
            style={{
              background: "linear-gradient(135deg, rgb(219, 118, 59), rgb(30, 123, 135))",
              border: "1px solid rgba(24, 206, 173, 0.98)",
            }}
          >
            <div className="card-body">
              <h2 className="card-title mb-4">
                <span style={{ fontWeight: 700 }}>{vuln.nombre}</span>{" "}
                <small className="text-white">({vuln.tipo})</small>
              </h2>

              <p>
                <strong>
                  <i className="bi bi-exclamation-triangle-fill me-2 text-danger" /> Riesgo:
                </strong>{" "}
                <span className={`badge ${colores[vuln.riesgo]} px-3 py-2`}>
                  {vuln.riesgo}
                </span>
              </p>

              <p>
                <strong>
                  <i className="bi bi-calendar-event me-2 text-info" /> Fecha de detección:
                </strong>{" "}
                <span>{vuln.fechaDeteccion}</span>
              </p>

              <p>
                <strong>
                  <i className="bi bi-card-text me-2 text-warning" /> Descripción técnica:
                </strong>{" "}
                <span>{vuln.descripcion}</span>
              </p>

              <p>
                <strong>
                  <i className="bi bi-lightbulb-fill me-2 text-primary" /> Impacto:
                </strong>{" "}
                <span>{vuln.impacto}</span>
              </p>

              <p>
                <strong>
                  <i className="bi bi-terminal me-2 text-success" /> Ejemplo:
                </strong>{" "}
                <span>{vuln.ejemplo}</span>
              </p>

              <p>
                <strong>
                  <i className="bi bi-code-slash me-2 text-info" /> CWE:
                </strong>{" "}
                <span>{vuln.cwe}</span>
              </p>

              <p className="mt-4">
                <strong>
                  <i className="bi bi-tools me-2 text-secondary" /> Recomendaciones:
                </strong>
              </p>

              {vuln.recomendaciones ? (
                <ul>
                  {vuln.recomendaciones.split(". ").map((linea, i) => (
                    <li key={i}>{linea}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Sin recomendaciones registradas.</p>
              )}

              {vuln.owaspReferencia && (
                <a
                  href={vuln.owaspReferencia}
                  target="_blank"
                  className="btn btn-outline-info mt-4"
                  rel="noopener noreferrer"
                >
                  Ver referencia OWASP
                </a>
              )}
            </div>
          </div>

          <Evidencias vulnerabilidadId={vuln.id} />
        </Layout>
      </div>
    </div>
  );
}
