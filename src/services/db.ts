import { RuntFormData } from '../types/runt';

const STORAGE_KEY = 'runt_digital_tramites_v1';
const DRAFT_KEY = 'runt_digital_current_draft';

export interface DbStats {
  totalRecords: number;
  radicados: number;
  borradores: number;
  lastUpdated: string;
  engine: string;
}

export interface SqlQueryResult {
  columns: string[];
  values: any[][];
  error?: string;
  rowCount: number;
}

class RuntDbService {
  private isServerHealthy = true;

  // Cargar todos los registros (desde API o fallback local)
  async getAllTramites(): Promise<RuntFormData[]> {
    try {
      const res = await fetch('/api/tramites');
      if (res.ok) {
        const data = await res.json();
        // Guardar espejo local
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        this.isServerHealthy = true;
        return data;
      }
    } catch {
      this.isServerHealthy = false;
    }

    // Fallback a localStorage
    const local = localStorage.getItem(STORAGE_KEY);
    return local ? JSON.parse(local) : [];
  }

  // Obtener un trámite por ID
  async getTramiteById(id: string): Promise<RuntFormData | null> {
    try {
      const res = await fetch(`/api/tramites/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignore
    }

    const list = await this.getAllTramites();
    return list.find((t) => t.id === id) || null;
  }

  // Guardar o actualizar un trámite
  async saveTramite(data: RuntFormData): Promise<RuntFormData> {
    const timestamp = new Date().toISOString();
    const id = data.id || `RUNT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    // Asignar número de radicado si está radicado
    let numeroRadicado = data.numeroRadicado;
    if (data.status === 'RADICADO' && !numeroRadicado) {
      const year = new Date().getFullYear();
      numeroRadicado = `RNA-${year}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    const recordToSave: RuntFormData = {
      ...data,
      id,
      numeroRadicado,
      createdAt: data.createdAt || timestamp,
      updatedAt: timestamp,
    };

    // Intentar guardar en backend SQLite
    try {
      const res = await fetch('/api/tramites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordToSave),
      });
      if (res.ok) {
        const saved = await res.json();
        this.updateLocalMirror(saved);
        return saved;
      }
    } catch {
      // Server error fallback
    }

    // Fallback local
    this.updateLocalMirror(recordToSave);
    return recordToSave;
  }

  // Eliminar trámite
  async deleteTramite(id: string): Promise<boolean> {
    try {
      await fetch(`/api/tramites/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }

    const localList = (await this.getAllTramites()).filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localList));
    return true;
  }

  // Guardar borrador en progreso de trabajo
  saveCurrentDraft(data: RuntFormData) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }

  // Recuperar borrador en progreso
  getCurrentDraft(): RuntFormData | null {
    const item = localStorage.getItem(DRAFT_KEY);
    return item ? JSON.parse(item) : null;
  }

  // Limpiar borrador
  clearCurrentDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  // Estadísticas de la base de datos
  async getStats(): Promise<DbStats> {
    const list = await this.getAllTramites();
    const radicados = list.filter((t) => t.status === 'RADICADO').length;
    return {
      totalRecords: list.length,
      radicados,
      borradores: list.length - radicados,
      lastUpdated: list[0]?.updatedAt || new Date().toISOString(),
      engine: this.isServerHealthy ? 'SQLite 3 (Backend Express & WAL)' : 'SQLite Local Client Mode',
    };
  }

  // Ejecutar consulta SQL contra la base de datos SQLite
  async executeSql(query: string): Promise<SqlQueryResult> {
    try {
      const res = await fetch('/api/sql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      return { columns: [], values: [], rowCount: 0, error: err.error || 'Error ejecutando consulta' };
    } catch (e: any) {
      // Fallback: emular consulta básica sobre local storage
      const list = await this.getAllTramites();
      const lower = query.toLowerCase().trim();
      if (lower.startsWith('select') && lower.includes('tramites')) {
        return {
          columns: ['id', 'placa', 'tramite', 'clase', 'marca', 'propietario', 'status', 'created_at'],
          values: list.map((t) => [
            t.id,
            `${t.placa.letras}-${t.placa.numeros}`,
            t.tramitesSeleccionados.join(','),
            t.claseVehiculo,
            `${t.marca} ${t.linea}`,
            `${t.propietario.nombres} ${t.propietario.primerApellido}`,
            t.status,
            t.createdAt,
          ]),
          rowCount: list.length,
        };
      }
      return { columns: [], values: [], rowCount: 0, error: e.message || 'No se pudo conectar al servidor SQL' };
    }
  }

  private updateLocalMirror(record: RuntFormData) {
    const local = localStorage.getItem(STORAGE_KEY);
    let list: RuntFormData[] = local ? JSON.parse(local) : [];
    const index = list.findIndex((t) => t.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export const runtDb = new RuntDbService();
