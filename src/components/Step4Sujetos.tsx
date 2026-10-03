import React from 'react';
import { RuntFormData, DocumentType } from '../types/runt';
import { TIPOS_DOCUMENTO } from '../data/runtCatalogs';
import { SignaturePad } from './SignaturePad';
import { User, UserCheck, ShieldCheck, HelpCircle } from 'lucide-react';

interface Step4Props {
  formData: RuntFormData;
  updateFormData: (updater: (prev: RuntFormData) => RuntFormData) => void;
}

export const Step4Sujetos: React.FC<Step4Props> = ({
  formData,
  updateFormData,
}) => {
  const isTraspaso = formData.tramitesSeleccionados.includes(2);

  const handlePropietarioDocChange = (docType: DocumentType) => {
    updateFormData((prev) => ({
      ...prev,
      propietario: { ...prev.propietario, tipoDocumento: docType },
    }));
  };

  const handleCompradorDocChange = (docType: DocumentType) => {
    updateFormData((prev) => ({
      ...prev,
      comprador: { ...prev.comprador, tipoDocumento: docType },
    }));
  };

  const handleToggleIndeterminada = (checked: boolean) => {
    updateFormData((prev) => ({
      ...prev,
      comprador: {
        ...prev.comprador,
        esIndeterminada: checked,
        tipoDocumento: checked ? 'X' : 'C',
        primerApellido: checked ? 'PERSONA' : prev.comprador.primerApellido,
        segundoApellido: checked ? 'INDETERMINADA' : prev.comprador.segundoApellido,
        nombres: checked ? 'INDETERMINADA' : prev.comprador.nombres,
        numeroDocumento: checked ? '0000000000' : prev.comprador.numeroDocumento,
        direccion: checked ? 'DESCONOCIDA' : prev.comprador.direccion,
        ciudad: checked ? prev.organismo.ciudad : prev.comprador.ciudad,
        telefono: checked ? '0000000' : prev.comprador.telefono,
      },
    }));
  };

  const propietarioFullName = `${formData.propietario.nombres} ${formData.propietario.primerApellido} ${formData.propietario.segundoApellido}`.trim();
  const compradorFullName = `${formData.comprador.nombres} ${formData.comprador.primerApellido} ${formData.comprador.segundoApellido}`.trim();

  return (
    <div className="space-y-6">
      {/* 21. Datos del Propietario */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            21
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">21. Datos del Propietario Actual</h2>
            <p className="text-xs text-slate-500">
              Titular del derecho de propiedad inscrito en el Registro Nacional Automotor
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primer Apellido *
              </label>
              <input
                type="text"
                value={formData.propietario.primerApellido}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    propietario: { ...prev.propietario, primerApellido: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="Primer apellido..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Segundo Apellido
              </label>
              <input
                type="text"
                value={formData.propietario.segundoApellido}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    propietario: { ...prev.propietario, segundoApellido: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="Segundo apellido..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombres Completos *
              </label>
              <input
                type="text"
                value={formData.propietario.nombres}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    propietario: { ...prev.propietario, nombres: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="Nombres..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Tipo y Número de Documento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipo de Documento de Identidad (Señale casilla RUNT)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-2.5">
              {TIPOS_DOCUMENTO.map((doc) => {
                const isSelected = formData.propietario.tipoDocumento === doc.code;
                return (
                  <button
                    key={doc.code}
                    type="button"
                    onClick={() => handlePropietarioDocChange(doc.code)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title={doc.fullName}
                  >
                    <span className="text-xs font-bold">{doc.label}</span>
                    <span className="text-[9px] font-mono text-slate-400">[{doc.code}]</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  value={formData.propietario.numeroDocumento}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      propietario: { ...prev.propietario, numeroDocumento: e.target.value },
                    }))
                  }
                  placeholder="Número de cédula o NIT..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dirección de Residencia / Domicilio
                </label>
                <input
                  type="text"
                  value={formData.propietario.direccion}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      propietario: { ...prev.propietario, direccion: e.target.value },
                    }))
                  }
                  placeholder="Dirección con nomenclatura..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.propietario.ciudad}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      propietario: { ...prev.propietario, ciudad: e.target.value },
                    }))
                  }
                  placeholder="Ciudad..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.propietario.telefono}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      propietario: { ...prev.propietario, telefono: e.target.value },
                    }))
                  }
                  placeholder="Celular o fijo..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Firma Digital del Propietario */}
          <div className="pt-2">
            <SignaturePad
              label="Firma del Propietario Actual"
              sublabel="Diligencie su firma en pantalla o use rúbrica legal digital"
              legalName={propietarioFullName}
              initialSignature={formData.propietario.firmaDigital}
              onChange={(dataUrl) =>
                updateFormData((prev) => ({
                  ...prev,
                  propietario: { ...prev.propietario, firmaDigital: dataUrl },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* 22. Datos del Comprador (Traspaso) */}
      <div
        className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all ${
          isTraspaso ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200 opacity-90'
        }`}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
              22
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                22. Datos del Comprador (Traspaso)
              </h2>
              <p className="text-xs text-slate-500">
                {isTraspaso
                  ? 'Requerido para perfeccionar la transferencia del dominio automotor'
                  : 'Opcional (Habilitado automáticamente si seleccionó el trámite de Traspaso)'}
              </p>
            </div>
          </div>

          {/* Switch de Persona Indeterminada */}
          <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={!!formData.comprador.esIndeterminada}
              onChange={(e) => handleToggleIndeterminada(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-xs font-semibold text-slate-700">
              Traspaso a Persona Indeterminada (NN)
            </span>
          </label>
        </div>

        <div className="space-y-4">
          {/* Nombres y Apellidos del Comprador */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primer Apellido Comprador
              </label>
              <input
                type="text"
                disabled={formData.comprador.esIndeterminada}
                value={formData.comprador.primerApellido}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    comprador: { ...prev.comprador, primerApellido: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="Primer apellido..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Segundo Apellido
              </label>
              <input
                type="text"
                disabled={formData.comprador.esIndeterminada}
                value={formData.comprador.segundoApellido}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    comprador: { ...prev.comprador, segundoApellido: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="Segundo apellido..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombres Completos
              </label>
              <input
                type="text"
                disabled={formData.comprador.esIndeterminada}
                value={formData.comprador.nombres}
                onChange={(e) =>
                  updateFormData((prev) => ({
                    ...prev,
                    comprador: { ...prev.comprador, nombres: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="Nombres..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Tipo y Número de Documento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipo de Documento del Comprador
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-2.5">
              {TIPOS_DOCUMENTO.map((doc) => {
                const isSelected = formData.comprador.tipoDocumento === doc.code;
                return (
                  <button
                    key={doc.code}
                    type="button"
                    disabled={formData.comprador.esIndeterminada}
                    onClick={() => handleCompradorDocChange(doc.code)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all disabled:opacity-50 ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-500/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title={doc.fullName}
                  >
                    <span className="text-xs font-bold">{doc.label}</span>
                    <span className="text-[9px] font-mono text-slate-400">[{doc.code}]</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Número de Documento
                </label>
                <input
                  type="text"
                  disabled={formData.comprador.esIndeterminada}
                  value={formData.comprador.numeroDocumento}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      comprador: { ...prev.comprador, numeroDocumento: e.target.value },
                    }))
                  }
                  placeholder="Número de documento..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono font-medium text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-100"
                />
              </div>

              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dirección del Comprador
                </label>
                <input
                  type="text"
                  disabled={formData.comprador.esIndeterminada}
                  value={formData.comprador.direccion}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      comprador: { ...prev.comprador, direccion: e.target.value },
                    }))
                  }
                  placeholder="Dirección..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none disabled:bg-slate-100"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ciudad
                </label>
                <input
                  type="text"
                  disabled={formData.comprador.esIndeterminada}
                  value={formData.comprador.ciudad}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      comprador: { ...prev.comprador, ciudad: e.target.value },
                    }))
                  }
                  placeholder="Ciudad..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none disabled:bg-slate-100"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  disabled={formData.comprador.esIndeterminada}
                  value={formData.comprador.telefono}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      comprador: { ...prev.comprador, telefono: e.target.value },
                    }))
                  }
                  placeholder="Teléfono celular..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Firma Digital del Comprador */}
          {!formData.comprador.esIndeterminada && (
            <div className="pt-2">
              <SignaturePad
                label="Firma del Comprador (Traspaso)"
                sublabel="Firma requerida para aceptar la titularidad legal del vehículo"
                legalName={compradorFullName}
                initialSignature={formData.comprador.firmaDigital}
                onChange={(dataUrl) =>
                  updateFormData((prev) => ({
                    ...prev,
                    comprador: { ...prev.comprador, firmaDigital: dataUrl },
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
