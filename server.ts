import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import initSqlJs, { Database } from 'sql.js';
import JSZip from 'jszip';

const app = express();
const PORT = 3000;
const DB_FILE_PATH = path.resolve('runt_database.sqlite');
const DOTNET_DIR = path.resolve('dotnet-backend-reference');

app.use(express.json({ limit: '15mb' }));

let sqliteDb: Database | null = null;

// Inicializar base de datos SQLite con sql.js
async function initDatabase(): Promise<Database> {
  if (sqliteDb) return sqliteDb;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE_PATH);
      sqliteDb = new SQL.Database(fileBuffer);
      console.log(`[SQLite] Base de datos cargada desde archivo existente: ${DB_FILE_PATH}`);
    } catch (e) {
      console.error('[SQLite] Error al leer archivo existente, inicializando nueva DB:', e);
      sqliteDb = new SQL.Database();
    }
  } else {
    sqliteDb = new SQL.Database();
    console.log('[SQLite] Nueva base de datos creada en memoria.');
  }

  // Crear tablas e índices si no existen
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS tramites_runt (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      numero_radicado TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      placa_letras TEXT NOT NULL,
      placa_numeros TEXT NOT NULL,
      organismo_nombre TEXT NOT NULL,
      organismo_ciudad TEXT NOT NULL,
      organismo_codigo TEXT NOT NULL,
      clase_vehiculo TEXT NOT NULL,
      marca TEXT NOT NULL,
      linea TEXT NOT NULL,
      combustible TEXT NOT NULL,
      modelo TEXT NOT NULL,
      carroceria_tipo TEXT NOT NULL,
      propietario_nombre TEXT NOT NULL,
      propietario_doc TEXT NOT NULL,
      payload_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tramites_placa ON tramites_runt(placa_letras, placa_numeros);
    CREATE INDEX IF NOT EXISTS idx_tramites_status ON tramites_runt(status);
    CREATE INDEX IF NOT EXISTS idx_tramites_updated ON tramites_runt(updated_at DESC);
  `);

  persistDatabase();
  return sqliteDb;
}

// Guardar los cambios binarios de SQLite a disco
function persistDatabase() {
  if (!sqliteDb) return;
  try {
    const data = sqliteDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('[SQLite] Error al persistir la base de datos:', err);
  }
}

// Rutas de API REST
app.get('/api/status', async (req, res) => {
  try {
    const db = await initDatabase();
    const result = db.exec('SELECT COUNT(*) as count FROM tramites_runt');
    const total = result[0]?.values[0]?.[0] || 0;
    
    res.json({
      status: 'ONLINE',
      engine: 'SQLite 3 (WebAssembly Embedded + File Persistence)',
      databaseFile: DB_FILE_PATH,
      totalTramites: total,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Listar trámites
app.get('/api/tramites', async (req, res) => {
  try {
    const db = await initDatabase();
    const result = db.exec('SELECT payload_json FROM tramites_runt ORDER BY updated_at DESC');
    
    if (result.length === 0 || !result[0].values) {
      return res.json([]);
    }

    const items = result[0].values.map((row) => {
      try {
        return JSON.parse(row[0] as string);
      } catch {
        return null;
      }
    }).filter(Boolean);

    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener trámite por ID
app.get('/api/tramites/:id', async (req, res) => {
  try {
    const db = await initDatabase();
    const stmt = db.prepare('SELECT payload_json FROM tramites_runt WHERE id = :id');
    stmt.bind({ ':id': req.params.id });
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return res.json(JSON.parse(row.payload_json as string));
    }
    stmt.free();
    res.status(404).json({ error: 'Trámite no encontrado' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Crear o actualizar trámite
app.post('/api/tramites', async (req, res) => {
  try {
    const db = await initDatabase();
    const data = req.body;
    
    if (!data.id) {
      data.id = `RUNT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    }

    const now = new Date().toISOString();
    data.updatedAt = now;
    if (!data.createdAt) data.createdAt = now;

    if (data.status === 'RADICADO' && !data.numeroRadicado) {
      data.numeroRadicado = `RNA-${new Date().getFullYear()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    const payloadJson = JSON.stringify(data);
    const placaLetras = (data.placa?.letras || '').toUpperCase().trim();
    const placaNumeros = (data.placa?.numeros || '').toUpperCase().trim();
    const orgNombre = data.organismo?.nombre || '';
    const orgCiudad = data.organismo?.ciudad || '';
    const orgCodigo = data.organismo?.codigo || '';
    const claseVehiculo = data.claseVehiculo || '';
    const marca = data.marca || '';
    const linea = data.linea || '';
    const combustible = data.combustible || '';
    const modelo = data.modelo || '';
    const carroceriaTipo = data.carroceriaTipo || '';
    const propNombre = `${data.propietario?.nombres || ''} ${data.propietario?.primerApellido || ''}`.trim();
    const propDoc = data.propietario?.numeroDocumento || '';

    // UPSERT
    const stmt = db.prepare(`
      INSERT INTO tramites_runt (
        id, status, numero_radicado, created_at, updated_at,
        placa_letras, placa_numeros, organismo_nombre, organismo_ciudad, organismo_codigo,
        clase_vehiculo, marca, linea, combustible, modelo, carroceria_tipo,
        propietario_nombre, propietario_doc, payload_json
      ) VALUES (
        :id, :status, :radicado, :created_at, :updated_at,
        :placa_letras, :placa_numeros, :org_nombre, :org_ciudad, :org_codigo,
        :clase, :marca, :linea, :combustible, :modelo, :carroceria,
        :prop_nombre, :prop_doc, :payload
      )
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        numero_radicado = excluded.numero_radicado,
        updated_at = excluded.updated_at,
        placa_letras = excluded.placa_letras,
        placa_numeros = excluded.placa_numeros,
        organismo_nombre = excluded.organismo_nombre,
        organismo_ciudad = excluded.organismo_ciudad,
        organismo_codigo = excluded.organismo_codigo,
        clase_vehiculo = excluded.clase_vehiculo,
        marca = excluded.marca,
        linea = excluded.linea,
        combustible = excluded.combustible,
        modelo = excluded.modelo,
        carroceria_tipo = excluded.carroceria_tipo,
        propietario_nombre = excluded.propietario_nombre,
        propietario_doc = excluded.propietario_doc,
        payload_json = excluded.payload_json;
    `);

    stmt.run({
      ':id': data.id,
      ':status': data.status,
      ':radicado': data.numeroRadicado || null,
      ':created_at': data.createdAt,
      ':updated_at': data.updatedAt,
      ':placa_letras': placaLetras,
      ':placa_numeros': placaNumeros,
      ':org_nombre': orgNombre,
      ':org_ciudad': orgCiudad,
      ':org_codigo': orgCodigo,
      ':clase': claseVehiculo,
      ':marca': marca,
      ':linea': linea,
      ':combustible': combustible,
      ':modelo': modelo,
      ':carroceria': carroceriaTipo,
      ':prop_nombre': propNombre,
      ':prop_doc': propDoc,
      ':payload': payloadJson,
    });
    stmt.free();

    persistDatabase();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Eliminar trámite
app.delete('/api/tramites/:id', async (req, res) => {
  try {
    const db = await initDatabase();
    const stmt = db.prepare('DELETE FROM tramites_runt WHERE id = :id');
    stmt.run({ ':id': req.params.id });
    stmt.free();
    persistDatabase();
    res.json({ success: true, id: req.params.id });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Ejecutar consulta SQL en consola de desarrollador
app.post('/api/sql/query', async (req, res) => {
  try {
    const db = await initDatabase();
    const query = req.body.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Consulta SQL inválida' });
    }

    const trimmed = query.trim();
    if (trimmed.toLowerCase().startsWith('select') || trimmed.toLowerCase().startsWith('pragma') || trimmed.toLowerCase().startsWith('explain')) {
      const results = db.exec(trimmed);
      if (results.length === 0) {
        return res.json({ columns: [], values: [], rowCount: 0 });
      }
      return res.json({
        columns: results[0].columns,
        values: results[0].values,
        rowCount: results[0].values.length,
      });
    } else {
      db.run(trimmed);
      persistDatabase();
      res.json({ message: 'Comando ejecutado con éxito', columns: ['Resultado'], values: [['OK']], rowCount: 1 });
    }
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Descargar archivo de base de datos SQLite binario
app.get('/api/db/download', async (req, res) => {
  try {
    await initDatabase();
    persistDatabase();
    if (fs.existsSync(DB_FILE_PATH)) {
      res.setHeader('Content-Disposition', 'attachment; filename="runt_database.sqlite"');
      res.setHeader('Content-Type', 'application/x-sqlite3');
      const stream = fs.createReadStream(DB_FILE_PATH);
      stream.pipe(res);
    } else {
      res.status(404).send('Archivo de base de datos no encontrado.');
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// Descargar proyecto completo ASP.NET Core listo para VS Code (.ZIP)
app.get('/api/dotnet/download', async (req, res) => {
  try {
    const zip = new JSZip();

    // Función recursiva para agregar carpeta al zip
    function addDirectoryToZip(dirPath: string, zipFolder: JSZip) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(file);
          if (subFolder) addDirectoryToZip(fullPath, subFolder);
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(file, content);
        }
      }
    }

    if (fs.existsSync(DOTNET_DIR)) {
      const rootFolder = zip.folder('RuntDigital.Api') || zip;
      addDirectoryToZip(DOTNET_DIR, rootFolder);

      // Si existe la base de datos sqlite en el servidor, incluir una copia de muestra
      if (fs.existsSync(DB_FILE_PATH)) {
        rootFolder.file('runt_database.sqlite', fs.readFileSync(DB_FILE_PATH));
      }

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      res.setHeader('Content-Disposition', 'attachment; filename="RuntDigital-AspNetCore-Backend.zip"');
      res.setHeader('Content-Type', 'application/zip');
      res.send(zipBuffer);
    } else {
      res.status(404).send('Directorio de referencia .NET no encontrado.');
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// Servir cliente frontend con Vite o estático
async function startServer() {
  await initDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RUNT Digital] Servidor activo en http://localhost:${PORT}`);
    console.log(`[RUNT Digital] Base de datos SQLite inicializada en ${DB_FILE_PATH}`);
  });
}

startServer();
