namespace RuntDigital.Api.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Modelo de Entidad para el Formulario de Solicitud RUNT
/// Mapeado a la base de datos local SQLite mediante EF Core.
/// </summary>
[Table("TramitesRunt")]
public class RuntTramite
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "BORRADOR"; // BORRADOR | RADICADO

    [MaxLength(50)]
    public string? NumeroRadicado { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // 1. Organismo de Tránsito
    [Required]
    [MaxLength(150)]
    public string OrganismoNombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string OrganismoCiudad { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string OrganismoCodigo { get; set; } = string.Empty;

    public DateTime FechaTramite { get; set; } = DateTime.UtcNow;

    // 2. Placa
    [Required]
    [MaxLength(3)]
    [RegularExpression(@"^[A-Z]{3}$", ErrorMessage = "Las letras de la placa deben ser 3 caracteres alfabéticos")]
    public string PlacaLetras { get; set; } = string.Empty;

    [Required]
    [MaxLength(4)]
    public string PlacaNumeros { get; set; } = string.Empty;

    // 3. Trámite Solicitado (IDs separados por coma, e.g. "2,5")
    [Required]
    public string TramitesSeleccionadosJson { get; set; } = "[2]";

    [MaxLength(255)]
    public string? OtroTramiteEspecificar { get; set; }

    // 4. Clase de Vehículo
    [Required]
    [MaxLength(50)]
    public string ClaseVehiculo { get; set; } = "AUTOMÓVIL";

    // 5. Marca y 6. Línea
    [Required]
    [MaxLength(80)]
    public string Marca { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string Linea { get; set; } = string.Empty;

    // 7. Combustible
    [Required]
    [MaxLength(30)]
    public string Combustible { get; set; } = "GASOLINA";

    // 8. Colores (Json array de hasta 3 colores)
    public string ColoresJson { get; set; } = "[\"BLANCO\"]";

    // 9. Modelo
    [Required]
    [MaxLength(4)]
    public string Modelo { get; set; } = string.Empty;

    // 10. Cilindrada
    [MaxLength(10)]
    public string? Cilindrada { get; set; }

    // 11. Capacidad
    [MaxLength(20)]
    public string? CapacidadKg { get; set; }

    [MaxLength(20)]
    public string? CapacidadPsj { get; set; }

    // 12. Blindaje y 13. Desmonte
    public bool Blindaje { get; set; } = false;
    public string? ResolucionBlindaje { get; set; }
    public string? FechaBlindaje { get; set; }

    public bool DesmonteBlindaje { get; set; } = false;
    public string? ResolucionDesmonte { get; set; }
    public string? FechaDesmonte { get; set; }

    // 14. Potencia
    [MaxLength(10)]
    public string? PotenciaHp { get; set; }

    // 15. Carrocería
    [MaxLength(10)]
    public string CarroceriaCodigo { get; set; } = "01";

    [MaxLength(80)]
    public string CarroceriaTipo { get; set; } = "SEDÁN";

    // 16. Identificación Interna
    [MaxLength(50)]
    public string? NoMotor { get; set; }
    public bool MotorRegrabado { get; set; } = false;

    [MaxLength(50)]
    public string? NoChasis { get; set; }
    public bool ChasisRegrabado { get; set; } = false;

    [MaxLength(50)]
    public string? NoSerie { get; set; }
    public bool SerieRegrabada { get; set; } = false;

    [MaxLength(50)]
    public string? NoVin { get; set; }

    // 17. Importación o Remate
    [MaxLength(30)]
    public string ImportacionTipo { get; set; } = "NINGUNO";
    public string? ImportacionNoDocumento { get; set; }
    public string? ImportacionFecha { get; set; }
    public string? ImportacionEntidad { get; set; }
    public string? ImportacionLugarCiudad { get; set; }
    public string? ImportacionCodigoAduana { get; set; }

    // 18. Tipo de Servicio
    [MaxLength(30)]
    public string TipoServicio { get; set; } = "PARTICULAR";

    // 19. Empresa Vinculadora
    public string? EmpresaVinculadoraNombre { get; set; }
    public string? EmpresaVinculadoraNit { get; set; }

    // 20. Datos de Alerta
    [MaxLength(30)]
    public string AlertaTipo { get; set; } = "NINGUNA";
    public string? AlertaAFavorDe { get; set; }

    // 21. Datos del Propietario
    [Required]
    [MaxLength(60)]
    public string PropietarioPrimerApellido { get; set; } = string.Empty;

    [MaxLength(60)]
    public string? PropietarioSegundoApellido { get; set; }

    [Required]
    [MaxLength(100)]
    public string PropietarioNombres { get; set; } = string.Empty;

    [Required]
    [MaxLength(2)]
    public string PropietarioTipoDocumento { get; set; } = "C";

    [Required]
    [MaxLength(30)]
    public string PropietarioNumeroDocumento { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? PropietarioDireccion { get; set; }

    [MaxLength(100)]
    public string? PropietarioCiudad { get; set; }

    [MaxLength(30)]
    public string? PropietarioTelefono { get; set; }

    public string? PropietarioFirmaBase64 { get; set; }

    // 22. Datos del Comprador (Traspaso)
    public bool AplicaComprador { get; set; } = false;
    public bool CompradorEsIndeterminada { get; set; } = false;
    public string? CompradorPrimerApellido { get; set; }
    public string? CompradorSegundoApellido { get; set; }
    public string? CompradorNombres { get; set; }
    public string? CompradorTipoDocumento { get; set; }
    public string? CompradorNumeroDocumento { get; set; }
    public string? CompradorDireccion { get; set; }
    public string? CompradorCiudad { get; set; }
    public string? CompradorTelefono { get; set; }
    public string? CompradorFirmaBase64 { get; set; }

    // 23. Observaciones
    public string? ObservacionesEspecificacionOtro { get; set; }
    public string? ObservacionesAntesRunt { get; set; }

    // Payload JSON completo estructurado para exportación fiel RUNT
    public string? FullPayloadJson { get; set; }
}
