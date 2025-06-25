import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const dataPath = path.join(process.cwd(), "data", "owasp.json");

type Vulnerabilidad = {
  id: number;
  nombre: string;
  tipo: string;
  riesgo: string;
  descripcion: string;
  recomendaciones: string;
  fechaDeteccion: string;
  impacto: string;
  ejemplo: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, "[]");
    }

    const rawData = fs.readFileSync(dataPath, "utf-8");
    let data: Vulnerabilidad[] = JSON.parse(rawData);

    switch (req.method) {
      case "GET":
        return res.status(200).json(data);

      case "POST": {
        const nueva: Vulnerabilidad = req.body;
        const nuevoId = data.length ? Math.max(...data.map(v => v.id)) + 1 : 1;
        const entrada = { ...nueva, id: nuevoId };
        data.push(entrada);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return res.status(201).json({ message: "Vulnerabilidad agregada", id: nuevoId });
      }

      case "PUT": {
        const actualizada: Vulnerabilidad = req.body;
        if (!actualizada.id) {
          return res.status(400).json({ error: "ID requerido para actualizar" });
        }
        data = data.map(v => (v.id === actualizada.id ? actualizada : v));
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return res.status(200).json({ message: "Vulnerabilidad actualizada" });
      }

      case "DELETE": {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: "ID requerido para eliminar" });
        }
        data = data.filter(v => v.id !== id);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return res.status(200).json({ message: "Vulnerabilidad eliminada" });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error("Error en la API:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
