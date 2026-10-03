import React from 'react';
import { RuntFormData, ImportType, ServiceType, AlertType } from '../types/runt';
import { TIPOS_SERVICIO } from '../data/runtCatalogs';
import { Shield, KeyRound, Building, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface Step3Props {
  formData: RuntFormData;
  updateFormData: (updater: (prev: RuntFormData) => RuntFormData) => void;
}

export const Step3CaracteristicasSeguridad: React.FC<Step3Props> = ({
  formData,
  updateFormData,
}) => {
  const isPublicoOEspeclal =
    formData.tipoServicio === 'PUBLICO' || formData.tipoServicio === 'ESPECIAL';

  return (
    <div className="space-y-6">
      {/* 16. Identificación Interna del Vehículo (Motor, Chasis, Serie, VIN) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
            16
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              16. Identificación Interna del Vehículo
            </h2>
            <p className="text-xs text-slate-500">
              Transcriba con exactitud los números de motor, chasis, serie y VIN. Si alguno fue regrabado, señale con X.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No. Motor */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">No. DE MOTOR</label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 text-[11px]">¿Regrabado?</span>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.identificacion.motorRegrabado}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        identificacion: {
                          ...prev.identificacion,
                          motorRegrabado: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">
                    {formData.identificacion.motorRegrabado ? 'SÍ' : 'NO'}
                  </span>
                </label>
              </div>
            </div>
            <input
              type="text"
              value={formData.identificacion.noMotor}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  identificacion: {
                    ...prev.identificacion,
                    noMotor: e.target.value.toUpperCase(),
                  },
                }))
              }
              placeholder="Número grabado en bloque..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono font-medium text-slate-900 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* No. Chasis */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">No. DE CHASIS</label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 text-[11px]">¿Regrabado?</span>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.identificacion.chasisRegrabado}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        identificacion: {
                          ...prev.identificacion,
                          chasisRegrabado: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">
                    {formData.identificacion.chasisRegrabado ? 'SÍ' : 'NO'}
                  </span>
                </label>
              </div>
            </div>
            <input
              type="text"
              value={formData.identificacion.noChasis}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  identificacion: {
                    ...prev.identificacion,
                    noChasis: e.target.value.toUpperCase(),
                  },
                }))
              }
              placeholder="Número de bastidor o chasis..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono font-medium text-slate-900 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* No. Serie */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">No. DE SERIE</label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 text-[11px]">¿Regrabado?</span>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.identificacion.serieRegrabada}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        identificacion: {
                          ...prev.identificacion,
                          serieRegrabada: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">
                    {formData.identificacion.serieRegrabada ? 'SÍ' : 'NO'}
                  </span>
                </label>
              </div>
            </div>
            <input
              type="text"
              value={formData.identificacion.noSerie}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  identificacion: {
                    ...prev.identificacion,
                    noSerie: e.target.value.toUpperCase(),
                  },
                }))
              }
              placeholder="Número de serie de fábrica..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono font-medium text-slate-900 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* No. VIN */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                No. DE VIN (Vehículos Automotores)
              </label>
              <span className="text-[11px] text-slate-400 font-mono">17 Caracteres</span>
            </div>
            <input
              type="text"
              maxLength={17}
              value={formData.identificacion.noVin}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  identificacion: {
                    ...prev.identificacion,
                    noVin: e.target.value.toUpperCase(),
                  },
                }))
              }
              placeholder="Vehicle Identification Number..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono font-medium text-slate-900 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* 18. Tipo de Servicio y 19. Empresa Vinculadora */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
            18-19
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              18. Tipo de Servicio y 19. Empresa Vinculadora
            </h2>
            <p className="text-xs text-slate-500">
              Régimen de operación del vehículo y afiliación empresarial obligatoria si aplica
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              18. Tipo de Servicio (Señale casilla con X)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {TIPOS_SERVICIO.map((serv) => {
                const isSelected = formData.tipoServicio === serv.key;
                return (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() =>
                      updateFormData((prev) => ({ ...prev, tipoServicio: serv.key }))
                    }
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all min-h-[58px] ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/30'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">0{serv.id}.</span>
                      <span className="text-xs">{serv.label}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] text-emerald-700 font-bold mt-1">Placa {serv.plateColor}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 19. Empresa Vinculadora si es Público o Especial */}
          <div className={`p-4 rounded-xl border transition-all ${
            isPublicoOEspeclal ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-80'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-4 w-4 text-slate-600" />
              <label className="text-xs font-bold text-slate-800">
                19. Empresa Vinculadora (Para servicio Público o Especial)
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Razón Social de la Empresa Vinculadora
                </label>
                <input
                  type="text"
                  value={formData.empresaVinculadora.nombre}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      empresaVinculadora: {
                        ...prev.empresaVinculadora,
                        nombre: e.target.value.toUpperCase(),
                      },
                    }))
                  }
                  placeholder="Ej: COOPERATIVA DE TRANSPORTES..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  NIT de la Empresa
                </label>
                <input
                  type="text"
                  value={formData.empresaVinculadora.nit}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      empresaVinculadora: {
                        ...prev.empresaVinculadora,
                        nit: e.target.value,
                      },
                    }))
                  }
                  placeholder="Ej: 890.301.456-2"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12. Blindaje y 13. Desmonte de Blindaje */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            12-13
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              12. Blindaje y 13. Desmonte de Blindaje
            </h2>
            <p className="text-xs text-slate-500">
              Resolución expedida por la Superintendencia de Vigilancia y Seguridad Privada
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blindaje */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">12. BLINDAJE</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateFormData((prev) => ({ ...prev, blindaje: false }))
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    !formData.blindaje
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  NO
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateFormData((prev) => ({ ...prev, blindaje: true }))
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    formData.blindaje
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  SÍ
                </button>
              </div>
            </div>

            {formData.blindaje && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Resolución No. SuperVigilancia
                  </label>
                  <input
                    type="text"
                    value={formData.resolucionBlindaje}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        resolucionBlindaje: e.target.value,
                      }))
                    }
                    placeholder="No. de Resolución"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Fecha de Resolución (DD/MM/AÑO)
                  </label>
                  <input
                    type="date"
                    value={formData.fechaBlindaje}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        fechaBlindaje: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desmonte Blindaje */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">13. DESMONTE DE BLINDAJE</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateFormData((prev) => ({ ...prev, desmonteBlindaje: false }))
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    !formData.desmonteBlindaje
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  NO
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateFormData((prev) => ({ ...prev, desmonteBlindaje: true }))
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    formData.desmonteBlindaje
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  SÍ
                </button>
              </div>
            </div>

            {formData.desmonteBlindaje && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Resolución No. Desmonte
                  </label>
                  <input
                    type="text"
                    value={formData.resolucionDesmonte}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        resolucionDesmonte: e.target.value,
                      }))
                    }
                    placeholder="No. de Resolución"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Fecha de Desmonte (DD/MM/AÑO)
                  </label>
                  <input
                    type="date"
                    value={formData.fechaDesmonte}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        fechaDesmonte: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 17. Importación o Remate y 20. Datos de Alerta */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 17. Importación o Remate */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800 font-bold text-xs">
              17
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">17. Importación o Remate</h2>
              <p className="text-[11px] text-slate-500">Documento de ingreso o adjudicación legal</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'NINGUNO', label: 'Sin Importación' },
                { key: 'MANIFIESTO_ACTA', label: '1. Manifiesto o Acta' },
                { key: 'DEC_IMPORT', label: '2. Dec. Importación' },
                { key: 'ACTA_REMATE', label: '3. Acta de Remate' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    updateFormData((prev) => ({
                      ...prev,
                      importacion: { ...prev.importacion, tipo: opt.key as ImportType },
                    }))
                  }
                  className={`px-2.5 py-1.5 text-xs rounded-lg font-medium border text-left truncate ${
                    formData.importacion.tipo === opt.key
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {formData.importacion.tipo !== 'NINGUNO' && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">No. Documento</label>
                    <input
                      type="text"
                      value={formData.importacion.noDocumento}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          importacion: { ...prev.importacion, noDocumento: e.target.value },
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">Fecha</label>
                    <input
                      type="date"
                      value={formData.importacion.fecha}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          importacion: { ...prev.importacion, fecha: e.target.value },
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">4. Entidad / DIAN</label>
                    <input
                      type="text"
                      value={formData.importacion.entidad}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          importacion: { ...prev.importacion, entidad: e.target.value },
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">5. Lugar / Ciudad</label>
                    <input
                      type="text"
                      value={formData.importacion.lugarCiudad}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          importacion: { ...prev.importacion, lugarCiudad: e.target.value },
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 20. Datos de Alerta */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-800 font-bold text-xs">
              20
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">20. Datos de Alerta</h2>
              <p className="text-[11px] text-slate-500">Hurto, prenda, embargo o limitaciones</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'NINGUNA', label: 'Sin Alerta' },
                { key: 'HURTO', label: '1. Hurto' },
                { key: 'LIM_PROPIEDAD', label: '2. Lim. Propiedad' },
                { key: 'EMBARGO', label: '3. Embargo' },
                { key: 'OTRO', label: '4. Otro' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    updateFormData((prev) => ({
                      ...prev,
                      alerta: { ...prev.alerta, tipo: opt.key as AlertType },
                    }))
                  }
                  className={`px-2.5 py-1.5 text-xs rounded-lg font-medium border text-left truncate ${
                    formData.alerta.tipo === opt.key
                      ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {formData.alerta.tipo !== 'NINGUNA' && (
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  5. A Favor de: (Persona Natural, Jurídica, Banco o Juzgado)
                </label>
                <input
                  type="text"
                  value={formData.alerta.aFavorDe}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      alerta: { ...prev.alerta, aFavorDe: e.target.value.toUpperCase() },
                    }))
                  }
                  placeholder="Entidad acreedora o juzgado de conocimiento..."
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-rose-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
