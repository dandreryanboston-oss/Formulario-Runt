import React from 'react';
import { Check, FileText, Car, ShieldAlert, Users, ClipboardCheck } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onSelectStep: (step: number) => void;
  completedSteps: number[];
}

export const STEPS_CONFIG = [
  { id: 1, title: 'Trámite & Placa', short: 'Trámite', icon: FileText, desc: 'Organismo y Trámite' },
  { id: 2, title: 'Datos del Vehículo', short: 'Vehículo', icon: Car, desc: 'Marca, Motor y Carrocería' },
  { id: 3, title: 'Seguridad & Servicio', short: 'Seguridad', icon: ShieldAlert, desc: 'Blindaje, Seriales y Alertas' },
  { id: 4, title: 'Propietario & Partes', short: 'Sujetos', icon: Users, desc: 'Propietario, Comprador y Firmas' },
  { id: 5, title: 'Revisión & Radicación', short: 'Revisión', icon: ClipboardCheck, desc: 'Observaciones y Radicado' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
}) => {
  const progressPercent = Math.round(((currentStep - 1) / (STEPS_CONFIG.length - 1)) * 100);

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      {/* Barra de progreso global sutil */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300"
          style={{ width: `${Math.max(10, progressPercent)}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Vista Desktop / Tablet */}
        <nav aria-label="Progreso del formulario" className="hidden md:flex items-center justify-between gap-2">
          {STEPS_CONFIG.map((step) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(step.id)}
                className={`group flex items-center gap-3 py-2 px-3 rounded-xl transition-all text-left flex-1 border ${
                  isCurrent
                    ? 'bg-blue-50/80 border-blue-200 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100'
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-semibold text-xs transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                  }`}
                >
                  {isCompleted && !isCurrent ? <Check className="h-4 w-4 stroke-[2.5]" /> : <Icon className="h-4 w-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Paso 0{step.id}
                    </span>
                    {isCompleted && !isCurrent && (
                      <span className="text-[10px] text-emerald-600 font-semibold">Listo</span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-bold truncate leading-tight ${
                      isCurrent ? 'text-blue-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Vista Móvil: Compacta y ergonómica */}
        <div className="flex md:hidden items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
              {currentStep}
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">
                {STEPS_CONFIG[currentStep - 1].title}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Paso {currentStep} de {STEPS_CONFIG.length} · {progressPercent}% completado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {STEPS_CONFIG.map((step) => (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`h-2.5 rounded-full transition-all ${
                  currentStep === step.id
                    ? 'w-6 bg-blue-600'
                    : completedSteps.includes(step.id)
                    ? 'w-2.5 bg-emerald-500'
                    : 'w-2.5 bg-slate-200'
                }`}
                aria-label={`Ir a paso ${step.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
