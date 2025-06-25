import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
api: {
    bodyParser: false,
},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const id = req.query.id;

if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
}

const uploadDir = path.join(process.cwd(), "/public/uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 5,
    filename: (originalName, originalExt, part, form) =>
    `vuln-${id}-${Date.now()}${originalExt}`,
});

try {
    const [fields, files] = await form.parse(req);
    return res.status(200).json({ status: "ok", files });
} catch (err) {
    console.error("Error al procesar el archivo:", err);
    return res.status(500).json({ error: "Error al subir archivo" });
}
}
