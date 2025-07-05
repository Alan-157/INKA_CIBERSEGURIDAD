import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Permitir archivos sin bodyParser para manejar multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler para subir evidencias vinculadas a un ID de vulnerabilidad
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  // Solo aceptar método POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  // Crear el directorio de subida si no existe
  const uploadDir = path.join(process.cwd(), "/public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configuración de formidable
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 5,
    filename: (originalName, ext, part, form) => {
      return `vuln-${id}-${Date.now()}${ext}`;
    },
  });

  try {
    // Parsear la solicitud con promesa
    const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Construir lista de evidencias
    const archivos = Object.values(files).flatMap((entry: any) => {
      const arr = Array.isArray(entry) ? entry : [entry];
      return arr.map((file) => ({
        nombre: file.originalFilename || "archivo",
        ruta: `/uploads/${path.basename(file.filepath)}`, //Para ver desde el navegador
        tipo: file.mimetype || "",
      }));
    });

    return res.status(200).json({ status: "ok", archivos });
  } catch (err) {
    console.error("Error al procesar el archivo:", err);
    return res.status(500).json({ error: "Error al subir archivo" });
  }
}
