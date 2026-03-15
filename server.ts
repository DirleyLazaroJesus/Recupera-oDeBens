import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("pmro_recovery.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'lost', 'stolen', 'robbed'
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    serial_number TEXT,
    owner_name TEXT NOT NULL,
    owner_contact TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recovered_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    serial_number TEXT,
    location_found TEXT,
    date_found TEXT NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/recovered", (req, res) => {
    const { q } = req.query;
    try {
      let items;
      if (q) {
        const stmt = db.prepare(`
          SELECT * FROM recovered_items 
          WHERE description LIKE ? OR serial_number LIKE ?
          ORDER BY created_at DESC
        `);
        items = stmt.all(`%${q}%`, `%${q}%`);
      } else {
        items = db.prepare("SELECT * FROM recovered_items ORDER BY created_at DESC").all();
      }
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recovered items" });
    }
  });

  // Seed some data if empty
  const recoveredCount = db.prepare("SELECT COUNT(*) as count FROM recovered_items").get() as { count: number };
  if (recoveredCount.count === 0) {
    const seedStmt = db.prepare(`
      INSERT INTO recovered_items (category, description, serial_number, location_found, date_found)
      VALUES (?, ?, ?, ?, ?)
    `);
    seedStmt.run("Celular", "iPhone 13 Pro Max Azul", "IMEI-123456789", "Centro, Porto Velho", "2024-03-01");
    seedStmt.run("Bicicleta", "Bicicleta Caloi Aro 29 Preta", "SN-987654", "Jatuarana", "2024-03-05");
    seedStmt.run("Documentos", "Carteira com documentos em nome de João Silva", null, "Rodoviária", "2024-03-08");
    seedStmt.run("Carro", "Toyota Corolla Prata", "ABC-1234", "Avenida Jorge Teixeira", "2024-03-10");
    seedStmt.run("Moto", "Honda Biz 125 Vermelha", "XYZ-9876", "Bairro Embratel", "2024-03-12");
    seedStmt.run("Outros", "Notebook Dell Latitude Cinza", "TAG-554433", "Shopping", "2024-03-14");
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
