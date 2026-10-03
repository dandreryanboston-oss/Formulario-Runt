import React, { useState } from 'react';
import { RuntFormData } from '../types/runt';
import { X, Search, FileText, Trash2, Edit3, Printer, CheckCircle2, Clock, Download } from 'lucide-react';
import { ColombianPlate } from './ColombianPlate';

interface SavedTramitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tramites: RuntFormData[];
  onSelectTramite: (tramite: RuntFormData) => void;
  onDeleteTramite: (id: string) => Promise<void>;
  onPrintTramite: (tramite: RuntFormData) => void;
}

export const SavedTramitesModal: React.FC<SavedTramitesModalProps> = ({
  isOpen,
  onClose,
  tramites,
  onSelectTramite,
  onDeleteTramite,
  onPrintTramite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RADICADO' | 'BORRADOR'>('ALL');

  if (!isOpen) return null;

  const filtered = tramites.filter((t) => {
    const fullPlaca = `${t.placa.letras}${t.placa.numeros}`.toUpperCase();
    const prop = `${t.propietario.nombres} ${t.propietario.primerApellido} ${t.propietario.numeroDocumento}`.toUpperCase();
    const rad = (t.numeroRadicado || '').toUpperCase();
    const search = searchTerm.toUpperCase().trim();

    const matchesSearch =
      !search || fullPlaca.includes(search) || prop.includes(search) || rad.includes(search);

    const matchesStatus =
      statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tramites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `runt_tramites_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Historial de Formularios RUNT (Base de Datos SQLite)
            </h2>
            <p className="text-xs text-slate-500">
              {tramites.length} registro(s) persistido(s) en la base de datos local
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por placa, cédula o propietario..."
              className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({tramites.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('RADICADO')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'RADICADO' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Radicados
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('BORRADOR')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'BORRADOR' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Borradores
              </button>
            </div>

            <button
              type="button"
              onClick={exportAllJson}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200"
              title="Descargar todos como JSON"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar
            </button>
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No se encontraron formularios</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {searchTerm ? 'Intente con otro término de búsqueda.' : 'Cree un nuevo trámite o cargue un caso de prueba para comenzar.'}
              </p>
            </div>
          ) : (
            filtered.map((tramite) => (
              <div
                key={tramite.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3">
                  <ColombianPlate
                    letras={tramite.placa.letras}
                    numeros={tramite.placa.numeros}
                    ciudad={tramite.organismo.ciudad}
                    tipoServicio={tramite.tipoServicio}
                    claseVehiculo={tramite.claseVehiculo}
                    className="scale-90 origin-left"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {tramite.claseVehiculo} · {tramite.marca} {tramite.linea}
                      </span>
                      {tramite.status === 'RADICADO' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Radicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Clock className="h-3 w-3" />
                          Borrador
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5">
                      Propietario: {tramite.propietario.nombres} {tramite.propietario.primerApellido} (Cédula: {tramite.propietario.numeroDocumento})
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {tramite.numeroRadicado ? `Rad: ${tramite.numeroRadicado} · ` : ''}
                      Org: {tramite.organismo.ciudad} · Modificado: {new Date(tramite.updatedAt || '').toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      onPrintTramite(tramite);
                      onClose();
                    }}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Imprimir Hoja Oficial RUNT"
                  >
                    <Printer className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTramite(tramite);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => tramite.id && onDeleteTramite(tramite.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar de SQLite"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Persistencia en tiempo real en archivo SQLite binario</span>
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
