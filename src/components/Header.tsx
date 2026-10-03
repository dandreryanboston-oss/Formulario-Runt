import React from 'react';
import { Database, FileText, Code2, PlusCircle, CheckCircle, Sparkles } from 'lucide-react';
import { CASOS_EJEMPLO } from '../data/runtCatalogs';
import { RuntFormData } from '../types/runt';

interface HeaderProps {
  onNewTramite: () => void;
  onOpenSavedModal: () => void;
  onOpenSqliteModal: () => void;
  onOpenDotnetModal: () => void;
  onOpenOfficialPrintView: () => void;
  onLoadExample: (example: RuntFormData) => void;
  totalSavedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewTramite,
  onOpenSavedModal,
  onOpenSqliteModal,
  onOpenDotnetModal,
  onOpenOfficialPrintView,
  onLoadExample,
  totalSavedCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Tricolor Nacional de Colombia */}
      <div className="flex h-1.5 w-full">
        <div className="h-full w-1/2 bg-amber-400" />
        <div className="h-full w-1/4 bg-blue-600" />
        <div className="h-full w-1/4 bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Bar Contract (3 zonas limpias) */}
        <div className="flex items-center justify-between h-16">
          {/* Zona 1: Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNewTramite}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 text-white font-black text-sm shadow-xs">
                RN
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                  RUNT Digital
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Ministerio de Transporte · Colombia
                </span>
              </div>
            </button>
          </div>

          {/* Zona 2: Navegación & Filtros */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={onNewTramite}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
              Nuevo Formulario
            </button>

            <button
              type="button"
              onClick={onOpenSavedModal}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              Mis Radicados
              {totalSavedCount > 0 && (
                <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md font-bold">
                  {totalSavedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenOfficialPrintView}
              className="hover:text-blue-700 transition-colors"
            >
              Vista Hoja Oficial RUNT
            </button>

            <button
              type="button"
              onClick={onOpenSqliteModal}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              Base de Datos SQLite
            </button>

            <button
              type="button"
              onClick={onOpenDotnetModal}
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-600" />
              Arquitectura ASP.NET Core
            </button>
          </nav>

          {/* Zona 3: Acciones primarias y Precarga de Ejemplos */}
          <div className="flex items-center gap-2">
            <a
              href="/api/dotnet/download"
              download="RuntDigital-AspNetCore-Backend.zip"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-xl transition-colors"
              title="Descargar código fuente ASP.NET Core completo para VS Code"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-700" />
              <span>Descargar .NET (.ZIP)</span>
            </a>

            {/* Selector rápido de casos de prueba */}
            <div className="relative hidden sm:block">
              <select
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  if (!isNaN(idx) && CASOS_EJEMPLO[idx]) {
                    onLoadExample(CASOS_EJEMPLO[idx].data);
                  }
                }}
                defaultValue=""
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl px-3 py-2 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>
                  Cargar Caso de Prueba...
                </option>
                {CASOS_EJEMPLO.map((ex, i) => (
                  <option key={ex.title} value={i}>
                    {ex.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onOpenSavedModal}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              title="Mis Radicados"
            >
              <FileText className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSqliteModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Consola SQLite</span>
              <span className="sm:hidden">SQLite</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
