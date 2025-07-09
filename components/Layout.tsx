import Head from "next/head";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import $ from "jquery";

// Componente Layout que envuelve el contenido de cada página
export default function Layout({ children, title }: { children: ReactNode; title: string }) {
  // Estado para mostrar u ocultar el botón "Volver arriba"
  const [mostrarBoton, setMostrarBoton] = useState(false);

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    // Aplica animación de entrada a los elementos con clase "fade-in"
    $(".fade-in").hide().fadeIn(500);

    // Muestra el botón "Volver arriba" si el usuario hace scroll
    const manejarScroll = () => {
      setMostrarBoton(window.scrollY > 300);
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  // Función para hacer scroll suave hacia arriba
  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>{title}</title>

        {/* Fuente Nunito desde Google Fonts */}
        https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap

        {/* Bootstrap CSS */}
        https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css

        {/* Bootstrap Icons */}
        https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css

        {/* Estilos globales para toda la app */}
        <style>{`
          body {
            font-family: 'Nunito', sans-serif;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            background-color: rgb(11, 215, 188);
            color: white;
          }
        `}</style>
      </Head>

      {/* Barra de navegación fija en la parte superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" href="/">
            INKA CIBERSEGURIDAD pepe el pollo es el mejor.
          </Link>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm" href="/">
              INICIO
            </Link>
            <Link className="btn btn-outline-light btn-sm" href="/admin">
              Administración
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido principal con animación de entrada */}
      <main className="container fade-in" style={{ paddingTop: "6rem" }}>
        {children}
      </main>

      {/* Botón flotante para volver arriba */}
      {mostrarBoton && (
        <button
          onClick={volverArriba}
          className="btn btn-primary position-fixed bottom-0 end-0 m-4 shadow rounded-circle d-flex align-items-center justify-content-center"
          style={{ zIndex: 999, width: "50px", height: "50px", fontSize: "1.25rem" }}
          title="Volver arriba"
        >
          <i className="bi bi-arrow-up-short" />
        </button>
      )}
    </>
  );
}

