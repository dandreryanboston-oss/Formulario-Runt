import React, { useState, useEffect } from 'react';
import { runtDb, DbStats, SqlQueryResult } from '../services/db';
import { X, Database, Play, Download, Terminal, Table, CheckCircle2, AlertCircle } from 'lucide-react';

interface SqliteConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqliteConsoleModal: React.FC<SqliteConsoleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState(
    'SELECT id, status, placa_letras, placa_numeros, clase_vehiculo, marca, linea, propietario_nombre, updated_at FROM tramites_runt ORDER BY updated_at DESC LIMIT 10;'
  );
  const [result, setResult] = useState<SqlQueryResult | null>(null);
  const [stats, setStats] = useState<DbStats | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStats();
      handleRunQuery(query);
    }
  }, [isOpen]);

  const loadStats = async () => {
    const s = await runtDb.getStats();
    setStats(s);
  };

  const handleRunQuery = async (sqlToRun?: string) => {
    const targetQuery = sqlToRun || query;
    setIsExecuting(true);
    try {
      const res = await runtDb.executeSql(targetQuery);
      setResult(res);
      await loadStats();
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Consola & Base de Datos SQLite Local
              </h2>
              <p className="text-xs text-slate-400">
                Archivo: <span className="font-mono text-emerald-300">runt_database.sqlite</span> · Motor:{' '}
                {stats?.engine || 'SQLite 3'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/db/download"
              download="runt_database.sqlite"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              title="Descargar archivo SQLite local para inspeccionar en DB Browser o Visual Studio"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              Descargar .sqlite
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tarjetas de Estadísticas de Base de Datos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Total Registros
            </span>
            <span className="font-mono text-xl font-bold text-slate-900">
              {stats?.totalRecords ?? 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Radicados Oficiales
            </span>
            <span className="font-mono text-xl font-bold text-emerald-700">
              {stats?.radicados ?? 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Borradores en Progreso
            </span>
            <span className="font-mono text-xl font-bold text-amber-700">
              {stats?.borradores ?? 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Tabla Principal
            </span>
            <span className="font-mono text-xs font-bold text-slate-800 block truncate">
              tramites_runt
            </span>
            <span className="text-[10px] text-slate-400">Index: placa, status</span>
          </div>
        </div>

        {/* Editor de Consultas SQL */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-blue-600" />
              Editor de Sentencias SQL
            </label>

            {/* Consultas Rápidas */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Consultas rápidas:</span>
              <button
                type="button"
                onClick={() => {
                  const q = 'SELECT id, status, placa_letras, placa_numeros, clase_vehiculo, marca, linea, propietario_nombre FROM tramites_runt;';
                  setQuery(q);
                  handleRunQuery(q);
                }}
                className="text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded"
              >
                SELECT *
              </button>
              <button
                type="button"
                onClick={() => {
                  const q = 'SELECT status, count(*) as cantidad FROM tramites_runt GROUP BY status;';
                  setQuery(q);
                  handleRunQuery(q);
                }}
                className="text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded"
              >
                GROUP BY status
              </button>
              <button
                type="button"
                onClick={() => {
                  const q = 'PRAGMA table_info(tramites_runt);';
                  setQuery(q);
                  handleRunQuery(q);
                }}
                className="text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded"
              >
                PRAGMA schema
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-950 text-emerald-400 font-mono text-xs p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              Soporta sintaxis SQLite estándar (SELECT, INSERT, UPDATE, PRAGMA)
            </p>
            <button
              type="button"
              disabled={isExecuting}
              onClick={() => handleRunQuery()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Ejecutar Consulta SQL
            </button>
          </div>
        </div>

        {/* Tabla de Resultados */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50">
          {result?.error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{result.error}</span>
            </div>
          ) : result && result.columns.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {result.rowCount} fila(s) devuelta(s)
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-[350px]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 sticky top-0">
                      <tr>
                        {result.columns.map((col, i) => (
                          <th key={i} className="px-3 py-2 font-bold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {result.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {row.map((cell: any, cIdx: number) => (
                            <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap max-w-xs truncate">
                              {cell !== null && cell !== undefined ? String(cell) : <span className="text-slate-400 italic">null</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Table className="h-8 w-8 mx-auto text-slate-300 mb-1" />
              No hay datos para mostrar o la consulta no retornó filas.
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Base de datos persistente en disco en formato binario SQLite 3</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
