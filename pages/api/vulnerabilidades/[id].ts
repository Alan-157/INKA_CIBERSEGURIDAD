import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const dataPath = path.join(process.cwd(), "data", "owasp.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
const { id } = req.query;

if (!fs.existsSync(dataPath)) {
    return res.status(500).json({ error: "Archivo no encontrado" });
}

const rawData = fs.readFileSync(dataPath, "utf-8");
const data = JSON.parse(rawData);

const encontrado = data.find((v: any) => v.id === Number(id));

if (encontrado) {
    res.status(200).json(encontrado);
} else {
    res.status(404).json({ error: "No se encontró la vulnerabilidad con ese ID" });
}
}
