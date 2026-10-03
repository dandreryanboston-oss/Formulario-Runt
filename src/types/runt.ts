/**
 * Modelos de datos para el Formulario de Solicitud de Trámites
 * del Registro Nacional Automotor - RUNT (Ministerio de Transporte de Colombia)
 */

export type DocumentType = 'C' | 'N' | 'X' | 'P' | 'E' | 'T' | 'U' | 'D';

export interface DocumentTypeOption {
  code: DocumentType;
  label: string;
  fullName: string;
}

export type FuelType = 
  | 'GASOLINA'
  | 'DIESEL'
  | 'GAS'
  | 'MIXTO'
  | 'ELECTRICO'
  | 'HIDROGENO'
  | 'ETANOL'
  | 'BIODIESEL';

export type ServiceType = 
  | 'PARTICULAR'
  | 'PUBLICO'
  | 'DIPLOMATICO'
  | 'OFICIAL'
  | 'ESPECIAL'
  | 'OTROS';

export type AlertType = 
  | 'NINGUNA'
  | 'HURTO'
  | 'LIM_PROPIEDAD'
  | 'EMBARGO'
  | 'OTRO';

export type ImportType =
  | 'MANIFIESTO_ACTA'
  | 'DEC_IMPORT'
  | 'ACTA_REMATE'
  | 'NINGUNO';

export interface OrganismoTransito {
  nombre: string;
  ciudad: string;
  codigo: string;
  departamento: string;
}

export interface PersonaRunt {
  primerApellido: string;
  segundoApellido: string;
  nombres: string;
  tipoDocumento: DocumentType;
  numeroDocumento: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  firmaDigital?: string; // Data URL Base64 de la firma
  esIndeterminada?: boolean; // Para traspaso a persona indeterminada
}

export interface RuntFormData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'BORRADOR' | 'RADICADO';
  numeroRadicado?: string;

  // 1. Organismo de Tránsito
  organismo: {
    nombre: string;
    ciudad: string;
    codigo: string;
    fechaTramite: string; // YYYY-MM-DD
  };

  // 2. Placa
  placa: {
    letras: string; // 3 letras
    numeros: string; // 3 dígitos (o 2 dígitos + letra para motos)
  };

  // 3. Trámite Solicitado (Selección múltiple o principal)
  tramitesSeleccionados: number[]; // Casillas 1 a 18
  otroTramiteEspecificar: string;

  // 4. Clase de Vehículo
  claseVehiculo: string;

  // 5. Marca
  marca: string;

  // 6. Línea
  linea: string;

  // 7. Combustible
  combustible: FuelType;

  // 8. Colores (máximo 3)
  colores: string[];

  // 9. Modelo (Año)
  modelo: string;

  // 10. Cilindrada (cc)
  cilindrada: string;

  // 11. Capacidad
  capacidadKg: string;
  capacidadPsj: string;

  // 12. Blindaje
  blindaje: boolean;
  resolucionBlindaje: string;
  fechaBlindaje: string;

  // 13. Desmonte Blindaje
  desmonteBlindaje: boolean;
  resolucionDesmonte: string;
  fechaDesmonte: string;

  // 14. Potencia / HP
  potenciaHp: string;

  // 15. Carrocería
  carroceriaCodigo: string;
  carroceriaTipo: string;

  // 16. Identificación Interna del Vehículo
  identificacion: {
    noMotor: string;
    motorRegrabado: boolean;
    noChasis: string;
    chasisRegrabado: boolean;
    noSerie: string;
    serieRegrabada: boolean;
    noVin: string;
  };

  // 17. Importación o Remate
  importacion: {
    tipo: ImportType;
    noDocumento: string;
    fecha: string;
    entidad: string;
    lugarCiudad: string;
    codigoAduana: string;
  };

  // 18. Tipo de Servicio
  tipoServicio: ServiceType;

  // 19. Empresa Vinculadora
  empresaVinculadora: {
    nombre: string;
    nit: string;
  };

  // 20. Datos de Alerta
  alerta: {
    tipo: AlertType;
    aFavorDe: string;
  };

  // 21. Datos del Propietario
  propietario: PersonaRunt;

  // 22. Datos del Comprador (Traspaso)
  comprador: PersonaRunt;

  // 23. Observaciones
  observaciones: {
    especificacionOtro: string;
    observacionesAntesRunt: string;
  };
}
