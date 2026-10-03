import React from 'react';
import { RuntFormData } from '../types/runt';
import { Printer, ArrowLeft, Download } from 'lucide-react';

interface RuntOfficialSheetProps {
  formData: RuntFormData;
  onBack: () => void;
}

export const RuntOfficialSheet: React.FC<RuntOfficialSheetProps> = ({
  formData,
  onBack,
}) => {
  const parseDate = (dStr?: string) => {
    if (!dStr) return { dia: '', mes: '', anio: '' };
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        return { dia: parts[2], mes: parts[1], anio: parts[0] };
      }
    } catch {
      // ignore
    }
    return { dia: '', mes: '', anio: '' };
  };

  const fechaTramite = parseDate(formData.organismo.fechaTramite);
  const fechaBlindaje = parseDate(formData.fechaBlindaje);
  const fechaDesmonte = parseDate(formData.fechaDesmonte);
  const fechaImport = parseDate(formData.importacion.fecha);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 print:p-0 print:bg-white">
      {/* Barra de herramientas superior (oculta al imprimir) */}
      <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-300 shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Editor de Formulario
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="h-4 w-4" />
            Imprimir / Guardar PDF Oficial
          </button>
        </div>
      </div>

      {/* Hoja Oficial Réplica 1:1 del Formulario RUNT Página 1 */}
      <div className="max-w-5xl mx-auto bg-white border-2 border-black p-4 sm:p-6 text-black font-sans text-[11px] shadow-xl print:shadow-none print:border-black print:p-2 print:m-0 print:max-w-full">
        {/* Cabecera Principal */}
        <div className="grid grid-cols-12 border-2 border-black mb-1">
          {/* Logo y Ministerio */}
          <div className="col-span-6 flex items-center justify-between border-r-2 border-black p-2">
            <div className="flex items-center gap-2">
              {/* Escudo estilizado */}
              <div className="h-12 w-12 border border-slate-400 rounded-full flex flex-col items-center justify-center text-[7px] text-center font-bold leading-tight">
                <span>REPÚBLICA</span>
                <span>DE</span>
                <span>COLOMBIA</span>
              </div>
              <div className="leading-tight">
                <p className="font-extrabold text-[12px] uppercase tracking-wide">
                  MINISTERIO DE TRANSPORTE
                </p>
                <p className="text-[8px] font-serif italic text-slate-700">Libertad y Orden</p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xl font-black tracking-tighter text-blue-900">
                RUNT
              </span>
              <p className="text-[7px] leading-none text-slate-500">Registro Único Nacional de Tránsito</p>
            </div>
          </div>

          {/* Título Oficial */}
          <div className="col-span-6 flex flex-col items-center justify-center p-2 text-center">
            <h1 className="font-extrabold text-[11px] uppercase tracking-tight leading-tight">
              FORMULARIO DE SOLICITUD DE TRÁMITES DEL
              <br />
              REGISTRO NACIONAL AUTOMOTOR
            </h1>
            {formData.numeroRadicado && (
              <span className="mt-1 font-mono text-[9px] font-bold text-slate-700 border border-black px-1">
                RADICADO: {formData.numeroRadicado}
              </span>
            )}
          </div>
        </div>

        {/* Fila 1: Organismo de Tránsito y Placa */}
        <div className="grid grid-cols-12 border-2 border-black mb-1">
          {/* 1. Organismo de Tránsito */}
          <div className="col-span-9 border-r-2 border-black p-1">
            <div className="bg-slate-200 px-1 py-0.5 font-bold text-[9px] uppercase border-b border-black">
              1. ORGANISMO DE TRÁNSITO
            </div>
            <div className="grid grid-cols-12 text-[10px]">
              <div className="col-span-12 p-0.5 border-b border-black flex gap-1">
                <span className="font-bold text-[8px] uppercase">NOMBRE:</span>
                <span className="font-semibold uppercase truncate">{formData.organismo.nombre}</span>
              </div>
              <div className="col-span-5 p-0.5 border-r border-black flex gap-1">
                <span className="font-bold text-[8px] uppercase">CIUDAD:</span>
                <span className="font-semibold uppercase">{formData.organismo.ciudad}</span>
              </div>
              <div className="col-span-3 p-0.5 border-r border-black flex gap-1">
                <span className="font-bold text-[8px] uppercase">CÓDIGO:</span>
                <span className="font-mono font-bold">{formData.organismo.codigo}</span>
              </div>
              <div className="col-span-4 p-0.5">
                <span className="font-bold text-[8px] uppercase block text-center border-b border-slate-300 pb-0.5">
                  FECHA DE TRÁMITE
                </span>
                <div className="grid grid-cols-3 text-center font-mono font-bold pt-0.5 text-[9px]">
                  <span>{fechaTramite.dia || '--'}</span>
                  <span className="border-x border-black">{fechaTramite.mes || '--'}</span>
                  <span>{fechaTramite.anio || '----'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Placa */}
          <div className="col-span-3 p-1 flex flex-col justify-between">
            <div className="bg-slate-200 px-1 py-0.5 font-bold text-[9px] uppercase border-b border-black text-center">
              2. PLACA
            </div>
            <div className="grid grid-cols-2 text-center border border-black mt-1">
              <div className="border-r border-black p-1">
                <span className="block text-[8px] font-bold">LETRAS</span>
                <span className="font-mono text-base font-extrabold uppercase">
                  {formData.placa.letras || '---'}
                </span>
              </div>
              <div className="p-1">
                <span className="block text-[8px] font-bold">NÚMEROS</span>
                <span className="font-mono text-base font-extrabold uppercase">
                  {formData.placa.numeros || '---'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 2: 3. Trámite Solicitado */}
        <div className="border-2 border-black mb-1">
          <div className="bg-slate-200 px-1 py-0.5 font-bold text-[9px] uppercase border-b border-black">
            3. TRÁMITE SOLICITADO
          </div>
          <div className="grid grid-cols-6 divide-x divide-black text-[8px] font-bold">
            {/* Columna 1 */}
            <div className="divide-y divide-black">
              <div className="p-1 flex items-center justify-between">
                <span>1 MATRÍCULA / REGISTRO</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(1) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>7 REGRABAR MOTOR</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(7) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>13 CANCELACIÓN MATRÍCULA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(13) ? 'X' : ''}</span>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="divide-y divide-black">
              <div className="p-1 flex items-center justify-between">
                <span>2 TRASPASO</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(2) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>8 REGRABAR CHASIS</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(8) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>14 CAMBIO DE PLACAS</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(14) ? 'X' : ''}</span>
              </div>
            </div>

            {/* Columna 3 */}
            <div className="divide-y divide-black">
              <div className="p-1 flex items-center justify-between">
                <span>3 TRASLADO MATRÍCULA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(3) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>9 TRANSFORMACIÓN</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(9) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>15 DUPLICADO DE PLACAS</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(15) ? 'X' : ''}</span>
              </div>
            </div>

            {/* Columna 4 */}
            <div className="divide-y divide-black">
              <div className="p-1 flex items-center justify-between">
                <span>4 RADICADO MATRÍCULA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(4) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>10 DUPLICADO LICENCIA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(10) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>16 REMATRÍCULA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(16) ? 'X' : ''}</span>
              </div>
            </div>

            {/* Columna 5 */}
            <div className="divide-y divide-black">
              <div className="p-1 flex items-center justify-between">
                <span>5 CAMBIO DE COLOR</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(5) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>11 INSCRIPC. PRENDA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(11) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>17 CAMBIO DE CARROCERÍA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(17) ? 'X' : ''}</span>
              </div>
            </div>

            {/* Columna 6 */}
            <div className="divide-y divide-black">
              <div className="p-1 flex items-center justify-between">
                <span>6 CAMBIO DE SERVICIO</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(6) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>12 LEVANTA PRENDA</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(12) ? 'X' : ''}</span>
              </div>
              <div className="p-1 flex items-center justify-between">
                <span>18 OTROS: {formData.otroTramiteEspecificar ? formData.otroTramiteEspecificar.slice(0, 10) : ''}</span>
                <span className="border border-black px-1 font-mono">{formData.tramitesSeleccionados.includes(18) ? 'X' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 3: 4. Clase de Vehículo */}
        <div className="border-2 border-black mb-1">
          <div className="bg-slate-200 px-1 py-0.5 font-bold text-[9px] uppercase border-b border-black">
            4. CLASE DE VEHÍCULO
          </div>
          <div className="grid grid-cols-7 divide-x divide-black text-[8px] font-bold text-center">
            {[
              'AUTOMÓVIL',
              'BUS',
              'BUSETA',
              'CAMIÓN',
              'CAMIONETA',
              'CAMPERO',
              'MICROBÚS',
            ].map((clase) => (
              <div key={clase} className="p-1 flex items-center justify-between">
                <span className="truncate">{clase}</span>
                <span className="border border-black px-1 font-mono">
                  {formData.claseVehiculo === clase ? 'X' : ''}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-black border-t border-black text-[8px] font-bold text-center">
            {[
              'TRACTOCAMIÓN',
              'MOTOCICLETA',
              'MOTOCARRO',
              'MOTOTRICICLO',
              'CUATRIMOTO',
              'VOLQUETA',
              'OTRO',
            ].map((clase) => (
              <div key={clase} className="p-1 flex items-center justify-between">
                <span className="truncate">{clase}</span>
                <span className="border border-black px-1 font-mono">
                  {formData.claseVehiculo === clase ? 'X' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fila 4: 5. Marca, 6. Línea, 7. Combustible */}
        <div className="grid grid-cols-12 border-2 border-black mb-1">
          <div className="col-span-3 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">5. MARCA</span>
            <span className="font-bold text-[10px] uppercase truncate block">{formData.marca}</span>
          </div>
          <div className="col-span-3 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">6. LÍNEA</span>
            <span className="font-bold text-[10px] uppercase truncate block">{formData.linea}</span>
          </div>
          <div className="col-span-6 p-1">
            <span className="font-bold text-[8px] block mb-0.5">7. COMBUSTIBLE</span>
            <div className="grid grid-cols-8 text-[7px] font-bold text-center divide-x divide-black border border-black">
              {[
                { k: 'GASOLINA', n: '1. GAS' },
                { k: 'DIESEL', n: '2. DIES' },
                { k: 'GAS', n: '3. GNV' },
                { k: 'MIXTO', n: '4. MIX' },
                { k: 'ELECTRICO', n: '5. ELEC' },
                { k: 'HIDROGENO', n: '6. HIDR' },
                { k: 'ETANOL', n: '7. ETAN' },
                { k: 'BIODIESEL', n: '8. BIOD' },
              ].map((c) => (
                <div key={c.k} className="p-0.5">
                  <span className="block truncate">{c.n}</span>
                  <span className="font-mono font-bold">{formData.combustible === c.k ? 'X' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fila 5: 8. Colores, 9. Modelo, 10. Cilindrada */}
        <div className="grid grid-cols-12 border-2 border-black mb-1">
          <div className="col-span-6 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">8. COLORES</span>
            <span className="font-bold text-[10px] uppercase">{formData.colores.join(' / ')}</span>
          </div>
          <div className="col-span-3 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">9. MODELO</span>
            <span className="font-mono font-bold text-[11px]">{formData.modelo}</span>
          </div>
          <div className="col-span-3 p-1">
            <span className="font-bold text-[8px] block">10. CILINDRADA</span>
            <span className="font-mono font-bold text-[11px]">{formData.cilindrada} c.c.</span>
          </div>
        </div>

        {/* Fila 6: 11. Capacidad, 12. Blindaje, 13. Desmonte, 14. Potencia */}
        <div className="grid grid-cols-12 border-2 border-black mb-1">
          <div className="col-span-3 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">11. CAPACIDAD Kg / Psj</span>
            <div className="flex gap-2 font-mono font-bold text-[9px]">
              <span>Kg: {formData.capacidadKg || '---'}</span>
              <span>Psj: {formData.capacidadPsj || '---'}</span>
            </div>
          </div>
          <div className="col-span-3 border-r-2 border-black p-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[8px]">12. BLINDAJE</span>
              <span className="font-mono font-bold text-[9px]">
                SÍ [{formData.blindaje ? 'X' : ' '}] NO [{!formData.blindaje ? 'X' : ' '}]
              </span>
            </div>
            <span className="text-[7px] text-slate-500 block truncate">
              Res: {formData.resolucionBlindaje || 'N/A'} {formData.fechaBlindaje}
            </span>
          </div>
          <div className="col-span-3 border-r-2 border-black p-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[8px]">13. DESMONTE BLIND</span>
              <span className="font-mono font-bold text-[9px]">
                SÍ [{formData.desmonteBlindaje ? 'X' : ' '}] NO [{!formData.desmonteBlindaje ? 'X' : ' '}]
              </span>
            </div>
            <span className="text-[7px] text-slate-500 block truncate">
              Res: {formData.resolucionDesmonte || 'N/A'} {formData.fechaDesmonte}
            </span>
          </div>
          <div className="col-span-3 p-1">
            <span className="font-bold text-[8px] block">14. POTENCIA / HP</span>
            <span className="font-mono font-bold text-[10px]">{formData.potenciaHp} HP</span>
          </div>
        </div>

        {/* Fila 7: 15. Carrocería & 16. Identificación Interna */}
        <div className="grid grid-cols-12 border-2 border-black mb-1">
          <div className="col-span-4 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">15. CARROCERÍA</span>
            <div className="flex gap-2 items-center font-bold text-[9px]">
              <span className="border border-black px-1 font-mono">CÓD: {formData.carroceriaCodigo}</span>
              <span className="uppercase truncate">{formData.carroceriaTipo}</span>
            </div>
          </div>
          <div className="col-span-8 p-1">
            <span className="font-bold text-[8px] block mb-0.5">16. IDENTIFICACIÓN INTERNA DEL VEHÍCULO</span>
            <div className="grid grid-cols-2 gap-x-2 text-[8px]">
              <div className="flex justify-between border-b border-slate-300 py-0.5">
                <span>MOTOR: <strong className="font-mono">{formData.identificacion.noMotor}</strong></span>
                <span>REGRABADO [{formData.identificacion.motorRegrabado ? 'X' : ' '}]</span>
              </div>
              <div className="flex justify-between border-b border-slate-300 py-0.5">
                <span>CHASIS: <strong className="font-mono">{formData.identificacion.noChasis}</strong></span>
                <span>REGRABADO [{formData.identificacion.chasisRegrabado ? 'X' : ' '}]</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>SERIE: <strong className="font-mono">{formData.identificacion.noSerie}</strong></span>
                <span>REGRABADO [{formData.identificacion.serieRegrabada ? 'X' : ' '}]</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>VIN: <strong className="font-mono">{formData.identificacion.noVin}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 8: 17. Importación, 18. Tipo de Servicio, 19. Empresa Vinculadora */}
        <div className="grid grid-cols-12 border-2 border-black mb-1">
          <div className="col-span-5 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">17. IMPORTACIÓN O REMATE</span>
            <div className="text-[7.5px] leading-tight">
              <span>DOC: {formData.importacion.tipo} N° {formData.importacion.noDocumento || '---'}</span>
              <br />
              <span>ENTIDAD: {formData.importacion.entidad || '---'} · CIUDAD: {formData.importacion.lugarCiudad || '---'}</span>
            </div>
          </div>
          <div className="col-span-4 border-r-2 border-black p-1">
            <span className="font-bold text-[8px] block">18. TIPO DE SERVICIO</span>
            <div className="grid grid-cols-3 text-[7.5px] font-bold text-center gap-0.5 mt-0.5">
              <span>PART [{formData.tipoServicio === 'PARTICULAR' ? 'X' : ' '}]</span>
              <span>PÚBL [{formData.tipoServicio === 'PUBLICO' ? 'X' : ' '}]</span>
              <span>DIPL [{formData.tipoServicio === 'DIPLOMATICO' ? 'X' : ' '}]</span>
              <span>OFIC [{formData.tipoServicio === 'OFICIAL' ? 'X' : ' '}]</span>
              <span>ESPEC [{formData.tipoServicio === 'ESPECIAL' ? 'X' : ' '}]</span>
              <span>OTROS [{formData.tipoServicio === 'OTROS' ? 'X' : ' '}]</span>
            </div>
          </div>
          <div className="col-span-3 p-1">
            <span className="font-bold text-[8px] block">19. EMPRESA VINCULADORA</span>
            <p className="text-[8px] font-bold truncate uppercase">{formData.empresaVinculadora.nombre || 'N/A'}</p>
            <p className="text-[8px] font-mono">NIT: {formData.empresaVinculadora.nit || 'N/A'}</p>
          </div>
        </div>

        {/* Fila 9: 20. Datos de Alerta */}
        <div className="border-2 border-black mb-1 p-1">
          <div className="flex justify-between items-center text-[8px] font-bold">
            <span>20. DATOS DE ALERTA:</span>
            <span>HURTO [{formData.alerta.tipo === 'HURTO' ? 'X' : ' '}]</span>
            <span>LIM. PROPIEDAD [{formData.alerta.tipo === 'LIM_PROPIEDAD' ? 'X' : ' '}]</span>
            <span>EMBARGO [{formData.alerta.tipo === 'EMBARGO' ? 'X' : ' '}]</span>
            <span>OTRO [{formData.alerta.tipo === 'OTRO' ? 'X' : ' '}]</span>
            <span>A FAVOR DE: <strong className="uppercase">{formData.alerta.aFavorDe || 'NINGUNA'}</strong></span>
          </div>
        </div>

        {/* Fila 10: 21. Datos del Propietario */}
        <div className="border-2 border-black mb-1 p-1">
          <div className="bg-slate-200 px-1 py-0.5 font-bold text-[9px] uppercase border-b border-black flex justify-between">
            <span>21. DATOS DEL PROPIETARIO</span>
            <span className="text-[8px]">TIPO DOC: [{formData.propietario.tipoDocumento}]</span>
          </div>
          <div className="grid grid-cols-12 text-[8px] gap-1 py-1">
            <div className="col-span-4">
              <span className="block font-bold">1ER APELLIDO:</span>
              <span className="font-semibold uppercase">{formData.propietario.primerApellido}</span>
            </div>
            <div className="col-span-4">
              <span className="block font-bold">2DO APELLIDO:</span>
              <span className="font-semibold uppercase">{formData.propietario.segundoApellido || '---'}</span>
            </div>
            <div className="col-span-4">
              <span className="block font-bold">NOMBRES:</span>
              <span className="font-semibold uppercase">{formData.propietario.nombres}</span>
            </div>
            <div className="col-span-3">
              <span className="block font-bold">NO. DOCUMENTO:</span>
              <span className="font-mono font-bold">{formData.propietario.numeroDocumento}</span>
            </div>
            <div className="col-span-4">
              <span className="block font-bold">DIRECCIÓN:</span>
              <span className="truncate block uppercase">{formData.propietario.direccion}</span>
            </div>
            <div className="col-span-3">
              <span className="block font-bold">CIUDAD:</span>
              <span className="uppercase">{formData.propietario.ciudad}</span>
            </div>
            <div className="col-span-2">
              <span className="block font-bold">TELÉFONO:</span>
              <span className="font-mono">{formData.propietario.telefono}</span>
            </div>
          </div>
          <div className="border-t border-black pt-1 flex items-center justify-between">
            <span className="text-[8px] font-bold">FIRMA DEL PROPIETARIO:</span>
            <div className="h-10 w-44 border border-dashed border-black flex items-center justify-center bg-slate-50">
              {formData.propietario.firmaDigital ? (
                <img
                  src={formData.propietario.firmaDigital}
                  alt="Firma Propietario"
                  className="h-9 max-w-full object-contain"
                />
              ) : (
                <span className="text-[8px] text-slate-400">Sin firma registrada</span>
              )}
            </div>
          </div>
        </div>

        {/* Fila 11: 22. Datos del Comprador (Traspaso) */}
        <div className="border-2 border-black mb-1 p-1">
          <div className="bg-slate-200 px-1 py-0.5 font-bold text-[9px] uppercase border-b border-black flex justify-between">
            <span>22. DATOS DEL COMPRADOR (TRASPASO)</span>
            <span className="text-[8px]">TIPO DOC: [{formData.comprador.tipoDocumento}]</span>
          </div>
          <div className="grid grid-cols-12 text-[8px] gap-1 py-1">
            <div className="col-span-4">
              <span className="block font-bold">1ER APELLIDO:</span>
              <span className="font-semibold uppercase">{formData.comprador.primerApellido || '---'}</span>
            </div>
            <div className="col-span-4">
              <span className="block font-bold">2DO APELLIDO:</span>
              <span className="font-semibold uppercase">{formData.comprador.segundoApellido || '---'}</span>
            </div>
            <div className="col-span-4">
              <span className="block font-bold">NOMBRES:</span>
              <span className="font-semibold uppercase">
                {formData.comprador.esIndeterminada ? 'PERSONA INDETERMINADA (NN)' : formData.comprador.nombres || '---'}
              </span>
            </div>
            <div className="col-span-3">
              <span className="block font-bold">NO. DOCUMENTO:</span>
              <span className="font-mono font-bold">{formData.comprador.numeroDocumento || '---'}</span>
            </div>
            <div className="col-span-4">
              <span className="block font-bold">DIRECCIÓN:</span>
              <span className="truncate block uppercase">{formData.comprador.direccion || '---'}</span>
            </div>
            <div className="col-span-3">
              <span className="block font-bold">CIUDAD:</span>
              <span className="uppercase">{formData.comprador.ciudad || '---'}</span>
            </div>
            <div className="col-span-2">
              <span className="block font-bold">TELÉFONO:</span>
              <span className="font-mono">{formData.comprador.telefono || '---'}</span>
            </div>
          </div>
          <div className="border-t border-black pt-1 flex items-center justify-between">
            <span className="text-[8px] font-bold">FIRMA DEL COMPRADOR:</span>
            <div className="h-10 w-44 border border-dashed border-black flex items-center justify-center bg-slate-50">
              {formData.comprador.firmaDigital ? (
                <img
                  src={formData.comprador.firmaDigital}
                  alt="Firma Comprador"
                  className="h-9 max-w-full object-contain"
                />
              ) : formData.comprador.esIndeterminada ? (
                <span className="text-[8px] font-bold text-slate-600">PERSONA INDETERMINADA</span>
              ) : (
                <span className="text-[8px] text-slate-400">Sin firma registrada</span>
              )}
            </div>
          </div>
        </div>

        {/* Fila 12: 23. Observaciones */}
        <div className="border-2 border-black mb-1 p-1">
          <div className="bg-slate-200 px-1 py-0.5 font-bold text-[9px] uppercase border-b border-black">
            23. OBSERVACIONES
          </div>
          <p className="text-[7.5px] leading-tight mt-1">
            <strong>ESPECIFIQUE LA PALABRA OTRO Y TRANSFORMACIÓN EFECTUADA AL VEHÍCULO: </strong>
            {formData.observaciones.especificacionOtro || 'NINGUNA'}
          </p>
          <p className="text-[7.5px] leading-tight mt-1 pt-1 border-t border-slate-300">
            <strong>OBSERVACIONES (PARA TRASPASO ANTES DE RUNT): </strong>
            {formData.observaciones.observacionesAntesRunt || 'NINGUNA'}
          </p>
        </div>

        {/* Pie Oficial */}
        <div className="text-center font-bold text-[8px] uppercase tracking-wider pt-1">
          NOTA: VER INSTRUCCIONES AL RESPALDO · SISTEMA REGISTRO ÚNICO NACIONAL DE TRÁNSITO - RUNT
        </div>
      </div>
    </div>
  );
};
