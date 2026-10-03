import React from 'react';
import { ServiceType } from '../types/runt';

interface ColombianPlateProps {
  letras: string;
  numeros: string;
  ciudad?: string;
  tipoServicio?: ServiceType;
  claseVehiculo?: string;
  className?: string;
}

export const ColombianPlate: React.FC<ColombianPlateProps> = ({
  letras = '',
  numeros = '',
  ciudad = 'COLOMBIA',
  tipoServicio = 'PARTICULAR',
  claseVehiculo = 'AUTOMÓVIL',
  className = '',
}) => {
  const isMoto = claseVehiculo === 'MOTOCICLETA' || claseVehiculo === 'MOTOTRICICLO' || claseVehiculo === 'MOTOCARRO';
  const displayLetras = (letras || 'AAA').toUpperCase();
  const displayNumeros = (numeros || (isMoto ? '00A' : '000')).toUpperCase();
  const displayCiudad = (ciudad || 'BOGOTÁ D.C.').toUpperCase();

  // Estilos de placa según tipo de servicio en Colombia
  let bgGradient = 'from-amber-300 via-amber-400 to-amber-500'; // Particular: Amarillo
  let textColor = 'text-slate-900';
  let borderColor = 'border-amber-600/40';
  let screwColor = 'bg-amber-700/60';

  if (tipoServicio === 'PUBLICO') {
    bgGradient = 'from-slate-100 via-white to-slate-200'; // Público: Blanco
    textColor = 'text-slate-950';
    borderColor = 'border-slate-400';
    screwColor = 'bg-slate-400';
  } else if (tipoServicio === 'DIPLOMATICO') {
    bgGradient = 'from-blue-700 via-blue-800 to-blue-900'; // Diplomático: Azul
    textColor = 'text-white';
    borderColor = 'border-blue-950';
    screwColor = 'bg-blue-300';
  } else if (tipoServicio === 'OFICIAL') {
    bgGradient = 'from-zinc-100 via-zinc-200 to-zinc-300'; // Oficial: Blanco gris
    textColor = 'text-zinc-900';
    borderColor = 'border-zinc-400';
    screwColor = 'bg-zinc-500';
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-between rounded-xl border-4 ${borderColor} bg-gradient-to-b ${bgGradient} px-4 py-2.5 shadow-md shadow-slate-900/10 select-none ${className}`}
      style={{
        minWidth: isMoto ? '150px' : '220px',
        maxWidth: isMoto ? '170px' : '250px',
      }}
    >
      {/* Tornillos de fijación de placa */}
      <div className={`absolute top-2 left-2.5 h-2 w-2 rounded-full ${screwColor} shadow-inner`} />
      <div className={`absolute top-2 right-2.5 h-2 w-2 rounded-full ${screwColor} shadow-inner`} />
      <div className={`absolute bottom-2 left-2.5 h-2 w-2 rounded-full ${screwColor} shadow-inner`} />
      <div className={`absolute bottom-2 right-2.5 h-2 w-2 rounded-full ${screwColor} shadow-inner`} />

      {/* Contenido de la placa */}
      <div className="flex w-full items-center justify-center gap-1.5 pt-0.5">
        <span
          className={`font-mono text-2xl sm:text-3xl font-black tracking-widest ${textColor} drop-shadow-sm`}
          style={{ letterSpacing: '0.15em' }}
        >
          {displayLetras}
        </span>
        <span className={`text-base font-bold ${textColor} opacity-60`}>•</span>
        <span
          className={`font-mono text-2xl sm:text-3xl font-black tracking-widest ${textColor} drop-shadow-sm`}
          style={{ letterSpacing: '0.15em' }}
        >
          {displayNumeros}
        </span>
      </div>

      {/* Ciudad de radicación */}
      <div className="w-full text-center mt-1 border-t border-slate-900/15 pt-0.5">
        <p className={`text-[10px] font-extrabold tracking-widest ${textColor} uppercase truncate px-2`}>
          {displayCiudad}
        </p>
      </div>
    </div>
  );
};
