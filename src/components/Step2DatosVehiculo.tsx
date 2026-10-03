import React, { useMemo } from 'react';
import { RuntFormData, FuelType } from '../types/runt';
import {
  CLASES_VEHICULO,
  CARROCERIAS_RUNT,
  COMBUSTIBLES,
  COLORES_RUNT,
  MARCAS_LINEAS_COLOMBIA,
} from '../data/runtCatalogs';
import { Car, Gauge, Fuel, Palette, Layers, Plus, X } from 'lucide-react';

interface Step2Props {
  formData: RuntFormData;
  updateFormData: (updater: (prev: RuntFormData) => RuntFormData) => void;
}

export const Step2DatosVehiculo: React.FC<Step2Props> = ({
  formData,
  updateFormData,
}) => {
  // Filtrar carrocerías válidas para la clase de vehículo seleccionada según la matriz oficial de la pág. 2
  const availableCarrocerias = useMemo(() => {
    return CARROCERIAS_RUNT.filter((c) =>
      c.clasesPermitidas.includes(formData.claseVehiculo) || c.clasesPermitidas.includes('OTRO')
    );
  }, [formData.claseVehiculo]);

  // Líneas sugeridas para la marca seleccionada
  const suggestedLineas = useMemo(() => {
    const brandUpper = (formData.marca || '').toUpperCase().trim();
    return MARCAS_LINEAS_COLOMBIA[brandUpper] || [];
  }, [formData.marca]);

  const handleClaseChange = (clase: string) => {
    updateFormData((prev) => {
      // Buscar primera carrocería compatible
      const firstCompatible = CARROCERIAS_RUNT.find((c) => c.clasesPermitidas.includes(clase));
      return {
        ...prev,
        claseVehiculo: clase,
        carroceriaCodigo: firstCompatible?.codigo || prev.carroceriaCodigo,
        carroceriaTipo: firstCompatible?.tipo || prev.carroceriaTipo,
      };
    });
  };

  const handleCarroceriaChange = (codigo: string) => {
    const carr = CARROCERIAS_RUNT.find((c) => c.codigo === codigo);
    if (carr) {
      updateFormData((prev) => ({
        ...prev,
        carroceriaCodigo: carr.codigo,
        carroceriaTipo: carr.tipo,
      }));
    }
  };

  const handleAddColor = (color: string) => {
    if (formData.colores.length < 3 && !formData.colores.includes(color)) {
      updateFormData((prev) => ({
        ...prev,
        colores: [...prev.colores, color],
      }));
    }
  };

  const handleRemoveColor = (color: string) => {
    if (formData.colores.length > 1) {
      updateFormData((prev) => ({
        ...prev,
        colores: prev.colores.filter((c) => c !== color),
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* 4. Clase de Vehículo */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            4
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">4. Clase de Vehículo</h2>
            <p className="text-xs text-slate-500">
              Señale con una equis (X) el campo correspondiente a la clase de vehículo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {CLASES_VEHICULO.map((clase) => {
            const isSelected = formData.claseVehiculo === clase;
            return (
              <button
                key={clase}
                type="button"
                onClick={() => handleClaseChange(clase)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all min-h-[58px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500/30'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <span className="text-[11px] leading-tight uppercase font-semibold">{clase}</span>
                {isSelected && (
                  <span className="mt-1 text-[10px] font-bold text-blue-600 flex items-center gap-0.5">
                    ✓ Activo
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Marca, 6. Línea y 15. Carrocería */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
            5-6-15
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Marca, Línea y Carrocería</h2>
            <p className="text-xs text-slate-500">
              Mapeado con validación de carrocería oficial RUNT para {formData.claseVehiculo}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* 5. Marca */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>5. Marca del Vehículo</span>
              <span className="text-[11px] font-normal text-slate-400">Ej: CHEVROLET, RENAULT</span>
            </label>
            <input
              type="text"
              list="marcas-list"
              value={formData.marca}
              onChange={(e) =>
                updateFormData((prev) => ({ ...prev, marca: e.target.value.toUpperCase() }))
              }
              placeholder="Escriba o seleccione marca..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold uppercase text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <datalist id="marcas-list">
              {Object.keys(MARCAS_LINEAS_COLOMBIA).map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>

          {/* 6. Línea */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>6. Línea del Vehículo</span>
              <span className="text-[11px] font-normal text-slate-400">Ej: ONIX, DUSTER, HILUX</span>
            </label>
            <input
              type="text"
              list="lineas-list"
              value={formData.linea}
              onChange={(e) =>
                updateFormData((prev) => ({ ...prev, linea: e.target.value }))
              }
              placeholder="Línea comercial..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {suggestedLineas.length > 0 && (
              <datalist id="lineas-list">
                {suggestedLineas.map((linea) => (
                  <option key={linea} value={linea} />
                ))}
              </datalist>
            )}
          </div>

          {/* 15. Carrocería */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>15. Tipo de Carrocería</span>
              <span className="text-[10px] font-mono text-blue-700 font-bold">
                Cód: {formData.carroceriaCodigo}
              </span>
            </label>
            <select
              value={formData.carroceriaCodigo}
              onChange={(e) => handleCarroceriaChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {availableCarrocerias.map((carr) => (
                <option key={carr.codigo} value={carr.codigo}>
                  [{carr.codigo}] {carr.tipo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 7. Combustible y 8. Colores */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 7. Combustible */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
              7
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">7. Tipo de Combustible</h2>
              <p className="text-[11px] text-slate-500">Señale con X el combustible utilizado</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {COMBUSTIBLES.map((comb) => {
              const isSelected = formData.combustible === comb.key;
              return (
                <button
                  key={comb.id}
                  type="button"
                  onClick={() =>
                    updateFormData((prev) => ({ ...prev, combustible: comb.key }))
                  }
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/30'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono font-bold text-xs ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected ? 'X' : ''}
                  </div>
                  <span>{comb.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Colores */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-pink-800 font-bold text-xs">
                8
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">8. Colores Predominantes</h2>
                <p className="text-[11px] text-slate-500">Especifique hasta tres (3) colores</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {formData.colores.length} de 3
            </span>
          </div>

          {/* Colores seleccionados */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.colores.map((color, idx) => (
              <span
                key={color}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-800 border border-slate-200"
              >
                <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                {color}
                {formData.colores.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="hover:text-rose-600 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {formData.colores.length < 3 && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Agregar color predominante:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COLORES_RUNT.filter((c) => !formData.colores.includes(c))
                  .slice(0, 8)
                  .map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleAddColor(color)}
                      className="text-[11px] font-medium px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    >
                      + {color}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 9. Modelo, 10. Cilindrada, 11. Capacidad, 14. Potencia */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800 font-bold text-xs">
            9-14
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Especificaciones Técnicas (Modelo, Cilindrada, Capacidad y Potencia)
            </h2>
            <p className="text-xs text-slate-500">Datos registrados en la ficha de homologación del vehículo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* 9. Modelo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              9. Modelo (Año)
            </label>
            <input
              type="number"
              min={1950}
              max={2030}
              value={formData.modelo}
              onChange={(e) =>
                updateFormData((prev) => ({ ...prev, modelo: e.target.value }))
              }
              placeholder="Ej: 2024"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* 10. Cilindrada */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              10. Cilindrada (cc)
            </label>
            <input
              type="number"
              value={formData.cilindrada}
              onChange={(e) =>
                updateFormData((prev) => ({ ...prev, cilindrada: e.target.value }))
              }
              placeholder="Ej: 1600"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* 11. Capacidad Kg */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              11. Capacidad Carga (Kg)
            </label>
            <input
              type="number"
              value={formData.capacidadKg}
              onChange={(e) =>
                updateFormData((prev) => ({ ...prev, capacidadKg: e.target.value }))
              }
              placeholder="Carga en Kg"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* 11. Capacidad Pasajeros */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              11. Capacidad Pasajeros (Psj)
            </label>
            <input
              type="number"
              value={formData.capacidadPsj}
              onChange={(e) =>
                updateFormData((prev) => ({ ...prev, capacidadPsj: e.target.value }))
              }
              placeholder="Ej: 5"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* 14. Potencia HP */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              14. Potencia (HP)
            </label>
            <input
              type="number"
              value={formData.potenciaHp}
              onChange={(e) =>
                updateFormData((prev) => ({ ...prev, potenciaHp: e.target.value }))
              }
              placeholder="Ej: 120"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
