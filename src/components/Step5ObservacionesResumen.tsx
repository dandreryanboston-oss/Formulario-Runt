import React from 'react';
import { RuntFormData } from '../types/runt';
import { TRAMITES_LIST } from '../data/runtCatalogs';
import { ColombianPlate } from './ColombianPlate';
import confetti from 'canvas-confetti';
import {
  FileCheck2,
  Save,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building,
  Car,
  User,
  Shield,
  FileSignature,
} from 'lucide-react';

interface Step5Props {
  formData: RuntFormData;
  updateFormData: (updater: (prev: RuntFormData) => RuntFormData) => void;
  onSaveDraft: () => Promise<void>;
  onSubmitOfficial: () => Promise<void>;
  onOpenOfficialPrintView: () => void;
  isSaving: boolean;
}

export const Step5ObservacionesResumen: React.FC<Step5Props> = ({
  formData,
  updateFormData,
  onSaveDraft,
  onSubmitOfficial,
  onOpenOfficialPrintView,
  isSaving,
}) => {
  const isTraspaso = formData.tramitesSeleccionados.includes(2);
  const selectedTramitesObj = TRAMITES_LIST.filter((t) =>
    formData.tramitesSeleccionados.includes(t.id)
  );

  const handleRadicarClick = async () => {
    await onSubmitOfficial();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* 23. Observaciones Oficiales */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            23
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">23. Observaciones y Aclaraciones</h2>
            <p className="text-xs text-slate-500">
              Especifique la palabra &apos;Otro&apos;, transformaciones técnicas o anotaciones de matrícula previa
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Especifique la palabra &apos;Otro&apos;, transformación efectuada al vehículo o amplíe el tipo de alerta:
            </label>
            <textarea
              rows={3}
              value={formData.observaciones.especificacionOtro}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  observaciones: {
                    ...prev.observaciones,
                    especificacionOtro: e.target.value,
                  },
                }))
              }
              placeholder="Indique aquí cualquier detalle sobre cambio de motor, cabina, blindaje, alertas judiciales o datos complementarios..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Observaciones (Para Traspaso de Vehículos Automotores Antes de RUNT)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Si su vehículo automotor ha sido matriculado antes del RUNT, transcriba en este campo el tipo de carrocería y la clase de vehículo que se encuentra registrada en su licencia de tránsito anterior:
            </p>
            <textarea
              rows={2}
              value={formData.observaciones.observacionesAntesRunt}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  observaciones: {
                    ...prev.observaciones,
                    observacionesAntesRunt: e.target.value,
                  },
                }))
              }
              placeholder="Transcripción textual de la licencia de tránsito anterior al RUNT si aplica..."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Resumen de Verificación Pre-Radicación */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Resumen de Radicación y Pre-Verificación
            </h2>
            <p className="text-xs text-slate-500">
              Verifique los datos consolidados antes de registrar en la base de datos oficial SQLite
            </p>
          </div>

          {formData.status === 'RADICADO' && formData.numeroRadicado && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              RADICADO N° {formData.numeroRadicado}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Tarjeta de Placa y Organismo */}
          <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
            <ColombianPlate
              letras={formData.placa.letras}
              numeros={formData.placa.numeros}
              ciudad={formData.organismo.ciudad}
              tipoServicio={formData.tipoServicio}
              claseVehiculo={formData.claseVehiculo}
              className="mb-3"
            />
            <p className="text-xs font-bold text-slate-800">{formData.organismo.nombre}</p>
            <p className="text-[11px] text-slate-500">
              {formData.organismo.ciudad} · Cód. DIVIPOLA {formData.organismo.codigo}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Fecha: {formData.organismo.fechaTramite}
            </p>
          </div>

          {/* Ficha Técnica y Trámites */}
          <div className="md:col-span-7 space-y-3">
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                Trámites Solicitados
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTramitesObj.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-white px-2.5 py-1 rounded-md border border-blue-200"
                  >
                    #{t.id} {t.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Vehículo</span>
                <span className="font-bold text-slate-800">{formData.claseVehiculo}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Marca & Línea</span>
                <span className="font-bold text-slate-800">{formData.marca} {formData.linea}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Modelo / Año</span>
                <span className="font-bold text-slate-800">{formData.modelo}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Combustible</span>
                <span className="font-bold text-slate-800">{formData.combustible}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Carrocería</span>
                <span className="font-bold text-slate-800">[{formData.carroceriaCodigo}] {formData.carroceriaTipo}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Servicio</span>
                <span className="font-bold text-slate-800">{formData.tipoServicio}</span>
              </div>
            </div>

            {/* Sujetos y Firmas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Propietario Actual</span>
                  <span className="font-bold text-slate-800">
                    {formData.propietario.nombres} {formData.propietario.primerApellido}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {formData.propietario.tipoDocumento}. {formData.propietario.numeroDocumento}
                  </span>
                </div>
                {formData.propietario.firmaDigital ? (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Firmado ✓
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                    Sin firma
                  </span>
                )}
              </div>

              {isTraspaso && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Comprador</span>
                    <span className="font-bold text-slate-800">
                      {formData.comprador.esIndeterminada
                        ? 'Persona Indeterminada (NN)'
                        : `${formData.comprador.nombres} ${formData.comprador.primerApellido}`}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {formData.comprador.tipoDocumento}. {formData.comprador.numeroDocumento}
                    </span>
                  </div>
                  {formData.comprador.firmaDigital || formData.comprador.esIndeterminada ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      Aceptado ✓
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                      Sin firma
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botonera de Acción */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenOfficialPrintView}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-600" />
            Vista Previa e Impresión Oficial (PDF Pág. 1)
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isSaving}
              onClick={onSaveDraft}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Guardar Borrador SQLite
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleRadicarClick}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <FileCheck2 className="h-4 w-4" />
              Radicar Solicitud RUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
