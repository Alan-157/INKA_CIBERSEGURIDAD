import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="es">
        <Head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <style>{`
            body {
                background: linear-gradient(135deg, rgba(0,0,40,0.85), rgba(0,0,80,0.85)), url('/cyber-bg.jpg') no-repeat center center fixed;
                background-size: cover;
                color: #e0f0ff;
                font-family: monospace;
            }
            .glass {
                background: rgba(0, 123, 255, 0.12);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(0, 123, 255, 0.3);
                border-radius: 1rem;
            }
            `}</style>
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
            </Html>
    );
}
