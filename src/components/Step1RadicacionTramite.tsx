import React from 'react';
import { RuntFormData } from '../types/runt';
import { ORGANISMOS_TRANSITO, TRAMITES_LIST } from '../data/runtCatalogs';
import { ColombianPlate } from './ColombianPlate';
import { Building2, Calendar, FileSpreadsheet, Info, Tag } from 'lucide-react';

interface Step1Props {
  formData: RuntFormData;
  updateFormData: (updater: (prev: RuntFormData) => RuntFormData) => void;
}

export const Step1RadicacionTramite: React.FC<Step1Props> = ({
  formData,
  updateFormData,
}) => {
  const handleOrganismoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const org = ORGANISMOS_TRANSITO.find((o) => o.codigo === e.target.value);
    if (org) {
      updateFormData((prev) => ({
        ...prev,
        organismo: {
          ...prev.organismo,
          nombre: org.nombre,
          ciudad: org.ciudad,
          codigo: org.codigo,
        },
      }));
    }
  };

  const toggleTramite = (id: number) => {
    updateFormData((prev) => {
      const exists = prev.tramitesSeleccionados.includes(id);
      const updated = exists
        ? prev.tramitesSeleccionados.filter((t) => t !== id)
        : [...prev.tramitesSeleccionados, id];
      return {
        ...prev,
        tramitesSeleccionados: updated,
      };
    });
  };

  const isTraspaso = formData.tramitesSeleccionados.includes(2);
  const isOtros = formData.tramitesSeleccionados.includes(18);

  return (
    <div className="space-y-6">
      {/* 1. Organismo de Tránsito */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">1. Organismo de Tránsito</h2>
            <p className="text-xs text-slate-500">Seleccione la Secretaría o Dirección de Tránsito competente</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-12">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Secretaría / Organismo de Tránsito (Catálogo Oficial RUNT)
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                value={formData.organismo.codigo}
                onChange={handleOrganismoSelect}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {ORGANISMOS_TRANSITO.map((org) => (
                  <option key={org.codigo} value={org.codigo}>
                    {org.nombre} — {org.ciudad} (Cód: {org.codigo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre Oficial del Organismo
            </label>
            <input
              type="text"
              value={formData.organismo.nombre}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  organismo: { ...prev.organismo, nombre: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ciudad</label>
            <input
              type="text"
              value={formData.organismo.ciudad}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  organismo: { ...prev.organismo, ciudad: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Código DIVIPOLA / RUNT
            </label>
            <input
              type="text"
              value={formData.organismo.codigo}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  organismo: { ...prev.organismo, codigo: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-mono font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              Fecha de Trámite
            </label>
            <input
              type="date"
              value={formData.organismo.fechaTramite}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  organismo: { ...prev.organismo, fechaTramite: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* 2. Placa del Vehículo */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">2. Placa del Vehículo</h2>
            <p className="text-xs text-slate-500">
              Escriba las letras y números asignados (o placa provisional en trámite de matrícula)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Letras (3 caracteres)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={formData.placa.letras}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      placa: { ...prev.placa, letras: e.target.value.toUpperCase().replace(/[^A-Z]/g, '') },
                    }))
                  }
                  placeholder="AAA"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xl font-mono font-bold uppercase tracking-widest text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Números (o N° + Letra moto)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.placa.numeros}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      placa: { ...prev.placa, numeros: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') },
                    }))
                  }
                  placeholder="123 o 12A"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xl font-mono font-bold uppercase tracking-widest text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              Para vehículos automóviles: 3 letras y 3 números. Para motocicletas: 3 letras, 2 números y 1 letra final.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Visualización Placa Oficial RUNT
            </span>
            <ColombianPlate
              letras={formData.placa.letras}
              numeros={formData.placa.numeros}
              ciudad={formData.organismo.ciudad}
              tipoServicio={formData.tipoServicio}
              claseVehiculo={formData.claseVehiculo}
            />
          </div>
        </div>
      </div>

      {/* 3. Trámite Solicitado */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Trámite Solicitado</h2>
              <p className="text-xs text-slate-500">
                Señale con una equis (X) el cuadro correspondiente al trámite solicitado (Casillas 1 a 18)
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {formData.tramitesSeleccionados.length} trámite(s) seleccionado(s)
          </span>
        </div>

        {/* Notificación si Traspaso está activo */}
        {isTraspaso && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-blue-50/90 border border-blue-200/80 p-3.5 text-xs text-blue-900">
            <Tag className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Trámite de Traspaso seleccionado</p>
              <p className="text-blue-700 mt-0.5">
                En el Paso 4 deberá diligenciar obligatoriamente los datos del Comprador (o marcar &quot;Persona Indeterminada&quot; si aplica según la Resolución 3282).
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TRAMITES_LIST.map((tramite) => {
            const isSelected = formData.tramitesSeleccionados.includes(tramite.id);
            return (
              <button
                key={tramite.id}
                type="button"
                onClick={() => toggleTramite(tramite.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Cuadro estilo casilla oficial con X */}
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono font-bold text-sm transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white text-slate-300'
                  }`}
                >
                  {isSelected ? 'X' : ''}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      {tramite.id.toString().padStart(2, '0')}.
                    </span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {tramite.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{tramite.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Especifique si 'Otros' está seleccionado */}
        {isOtros && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Casilla 18: Especifique el Trámite &apos;Otros&apos;
            </label>
            <input
              type="text"
              value={formData.otroTramiteEspecificar}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  otroTramiteEspecificar: e.target.value,
                }))
              }
              placeholder="Indique con claridad el trámite especial..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        )}
      </div>
    </div>
  );
};
