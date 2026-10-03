/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { RuntFormData } from './types/runt';
import { FORMULARIO_INICIAL, CASOS_EJEMPLO } from './data/runtCatalogs';
import { runtDb } from './services/db';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { Step1RadicacionTramite } from './components/Step1RadicacionTramite';
import { Step2DatosVehiculo } from './components/Step2DatosVehiculo';
import { Step3CaracteristicasSeguridad } from './components/Step3CaracteristicasSeguridad';
import { Step4Sujetos } from './components/Step4Sujetos';
import { Step5ObservacionesResumen } from './components/Step5ObservacionesResumen';
import { RuntOfficialSheet } from './components/RuntOfficialSheet';
import { SavedTramitesModal } from './components/SavedTramitesModal';
import { SqliteConsoleModal } from './components/SqliteConsoleModal';
import { DotnetArchitectureModal } from './components/DotnetArchitectureModal';
import { ArrowLeft, ArrowRight, Save, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState<RuntFormData>(() => {
    const saved = runtDb.getCurrentDraft();
    return saved || FORMULARIO_INICIAL;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [savedTramites, setSavedTramites] = useState<RuntFormData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Vistas y Modales
  const [viewMode, setViewMode] = useState<'FORM' | 'OFFICIAL_SHEET'>('FORM');
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSqliteModalOpen, setIsSqliteModalOpen] = useState(false);
  const [isDotnetModalOpen, setIsDotnetModalOpen] = useState(false);

  // Cargar lista de trámites desde SQLite
  const reloadTramites = useCallback(async () => {
    const list = await runtDb.getAllTramites();
    setSavedTramites(list);
  }, []);

  useEffect(() => {
    reloadTramites();
  }, [reloadTramites]);

  // Guardar borrador local en cada cambio
  useEffect(() => {
    runtDb.saveCurrentDraft(formData);
  }, [formData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const saved = await runtDb.saveTramite({
        ...formData,
        status: 'BORRADOR',
      });
      setFormData(saved);
      await reloadTramites();
      showToast('Borrador guardado en la base de datos SQLite');
    } catch {
      showToast('Error al guardar el borrador');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitOfficial = async () => {
    setIsSaving(true);
    try {
      const submitted = await runtDb.saveTramite({
        ...formData,
        status: 'RADICADO',
      });
      setFormData(submitted);
      await reloadTramites();
      showToast(`¡Solicitud RUNT radicada con éxito! Radicado N° ${submitted.numeroRadicado}`);
    } catch {
      showToast('Error al radicar el formulario RUNT');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewTramite = () => {
    setFormData(FORMULARIO_INICIAL);
    setCurrentStep(1);
    setCompletedSteps([1]);
    runtDb.clearCurrentDraft();
    showToast('Nuevo formulario RUNT en blanco iniciado');
  };

  const handleLoadExample = (example: RuntFormData) => {
    setFormData(example);
    setCurrentStep(1);
    setCompletedSteps([1, 2, 3, 4]);
    showToast(`Caso cargado: ${example.marca} ${example.linea} (${example.placa.letras}-${example.placa.numeros})`);
  };

  const handleDeleteTramite = async (id: string) => {
    await runtDb.deleteTramite(id);
    await reloadTramites();
    showToast('Registro eliminado de la base de datos SQLite');
  };

  if (viewMode === 'OFFICIAL_SHEET') {
    return (
      <RuntOfficialSheet
        formData={formData}
        onBack={() => setViewMode('FORM')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24 md:pb-12 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        onNewTramite={handleNewTramite}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenSqliteModal={() => setIsSqliteModalOpen(true)}
        onOpenDotnetModal={() => setIsDotnetModalOpen(true)}
        onOpenOfficialPrintView={() => setViewMode('OFFICIAL_SHEET')}
        onLoadExample={handleLoadExample}
        totalSavedCount={savedTramites.length}
      />

      {/* Interactive Step Bar */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={5}
        completedSteps={completedSteps}
        onSelectStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Contenido Principal del Formulario Interactivo */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentStep === 1 && (
          <Step1RadicacionTramite
            formData={formData}
            updateFormData={setFormData}
          />
        )}

        {currentStep === 2 && (
          <Step2DatosVehiculo
            formData={formData}
            updateFormData={setFormData}
          />
        )}

        {currentStep === 3 && (
          <Step3CaracteristicasSeguridad
            formData={formData}
            updateFormData={setFormData}
          />
        )}

        {currentStep === 4 && (
          <Step4Sujetos
            formData={formData}
            updateFormData={setFormData}
          />
        )}

        {currentStep === 5 && (
          <Step5ObservacionesResumen
            formData={formData}
            updateFormData={setFormData}
            onSaveDraft={handleSaveDraft}
            onSubmitOfficial={handleSubmitOfficial}
            onOpenOfficialPrintView={() => setViewMode('OFFICIAL_SHEET')}
            isSaving={isSaving}
          />
        )}
      </main>

      {/* Barra de Navegación Ergonómica Flotante Inferior (Thumb-Zone) */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Paso Anterior</span>
                <span className="sm:hidden">Atrás</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Save className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Guardar Borrador</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Save className="h-4 w-4 text-slate-500" />
              Guardar Borrador
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                <span>Continuar al Paso {currentStep + 1}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitOfficial}
                disabled={isSaving}
                className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-[0.98]"
              >
                <FileCheck className="h-4 w-4" />
                <span>Radicar Formulario RUNT</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modales */}
      <SavedTramitesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        tramites={savedTramites}
        onSelectTramite={(t) => {
          setFormData(t);
          setCurrentStep(1);
          showToast(`Trámite ${t.placa.letras}-${t.placa.numeros} cargado`);
        }}
        onDeleteTramite={handleDeleteTramite}
        onPrintTramite={(t) => {
          setFormData(t);
          setViewMode('OFFICIAL_SHEET');
        }}
      />

      <SqliteConsoleModal
        isOpen={isSqliteModalOpen}
        onClose={() => setIsSqliteModalOpen(false)}
      />

      <DotnetArchitectureModal
        isOpen={isDotnetModalOpen}
        onClose={() => setIsDotnetModalOpen(false)}
      />
    </div>
  );
}
