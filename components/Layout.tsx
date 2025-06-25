import Head from "next/head";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import $ from "jquery";

export default function Layout({ children, title }: { children: ReactNode; title: string }) {
const [mostrarBoton, setMostrarBoton] = useState(false);

useEffect(() => {
    $(".fade-in").hide().fadeIn(500);

    const manejarScroll = () => {
    setMostrarBoton(window.scrollY > 300);
    };
    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
}, []);

const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

return (
    <>
    <Head>
        <title>{title}</title>

        {/* Fuente Nunito */}
        <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
        rel="stylesheet"
        />

        {/* Bootstrap CSS */}
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        />

        {/* Bootstrap Icons */}
        <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />

        {/* Estilos globales */}
        <style>{`
        body {
            font-family: 'Nunito', sans-serif;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            background-color:rgb(11, 215, 188);
            color: white;
        }
        `}</style>
    </Head>

      {/* Barra de navegación */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
        <div className="container">
        <Link className="navbar-brand fw-bold" href="/">
            INKA CIBERSEGURIDAD
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

      {/* Contenido principal */}
    <main className="container fade-in" style={{ paddingTop: "6rem" }}>
        {children}
    </main>

      {/* Botón volver arriba */}
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
