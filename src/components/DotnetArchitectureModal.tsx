import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Server,
  ShieldCheck,
  Database,
  Download,
  Terminal,
  FileCode,
  FolderArchive,
  ExternalLink,
} from 'lucide-react';

interface DotnetArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DotnetArchitectureModal: React.FC<DotnetArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'guide' | 'controller' | 'model' | 'context' | 'program' | 'csproj' | 'appsettings'
  >('guide');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const guideMarkdown = `# Guía Rápida: Cómo Abrir y Ejecutar el Backend en Visual Studio Code

1. Haz clic en el botón superior "Descargar Proyecto para VS Code (.ZIP)".
2. Descomprime el archivo ZIP en tu computador (e.g. en Documentos o tu carpeta de proyectos).
3. Abre Visual Studio Code:
   - Ve a: Archivo > Abrir carpeta... (File > Open Folder...)
   - Selecciona la carpeta descomprimida "RuntDigital.Api".
4. Instala la extensión oficial de Microsoft:
   - "C# Dev Kit" (o "C#").
5. Abre la Terminal Integrada de VS Code (Ctrl + ~) y ejecuta:

   $ dotnet restore
   $ dotnet run

6. El servidor web iniciará y creará automáticamente la base de datos SQLite 'runt_database.sqlite'.
7. Abre Swagger en tu navegador:
   👉 https://localhost:7123/swagger
   Allí podrás probar todos los endpoints REST con la documentación interactiva OpenAPI.`;

  const csprojCode = `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>RuntDigital.Api</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>

</Project>`;

  const appsettingsCode = `{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=runt_database.sqlite"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "AllowedHosts": "*"
}`;

  const controllerCode = `// Controllers/TramitesController.cs
namespace RuntDigital.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RuntDigital.Api.Data;
using RuntDigital.Api.Models;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TramitesController : ControllerBase
{
    private readonly RuntDbContext _context;
    private readonly ILogger<TramitesController> _logger;

    public TramitesController(RuntDbContext context, ILogger<TramitesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RuntTramite>>> GetAll([FromQuery] string? placa, [FromQuery] string? status)
    {
        var query = _context.Tramites.AsQueryable();
        if (!string.IsNullOrWhiteSpace(placa))
        {
            var clean = placa.ToUpper().Replace("-", "").Trim();
            query = query.Where(t => (t.PlacaLetras + t.PlacaNumeros).Contains(clean));
        }
        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(t => t.Status == status.ToUpper());
        }

        return Ok(await query.OrderByDescending(t => t.UpdatedAt).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RuntTramite>> GetById(string id)
    {
        var item = await _context.Tramites.FindAsync(id);
        return item == null ? NotFound(new { message = $"Trámite {id} no encontrado" }) : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<RuntTramite>> Upsert([FromBody] RuntTramite tramite)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (tramite.Status == "RADICADO" && string.IsNullOrWhiteSpace(tramite.NumeroRadicado))
        {
            tramite.NumeroRadicado = $"RNA-{DateTime.UtcNow.Year}-{Random.Shared.Next(10000000, 99999999)}";
        }

        var existing = await _context.Tramites.FindAsync(tramite.Id);
        if (existing == null)
        {
            tramite.CreatedAt = DateTime.UtcNow;
            tramite.UpdatedAt = DateTime.UtcNow;
            await _context.Tramites.AddAsync(tramite);
        }
        else
        {
            tramite.UpdatedAt = DateTime.UtcNow;
            _context.Entry(existing).CurrentValues.SetValues(tramite);
        }

        await _context.SaveChangesAsync();
        return Ok(tramite);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var item = await _context.Tramites.FindAsync(id);
        if (item == null) return NotFound();
        _context.Tramites.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}`;

  const modelCode = `// Models/RuntTramite.cs
namespace RuntDigital.Api.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    // 1. Organismo
    [Required, MaxLength(150)]
    public string OrganismoNombre { get; set; } = string.Empty;
    [Required, MaxLength(100)]
    public string OrganismoCiudad { get; set; } = string.Empty;
    [Required, MaxLength(20)]
    public string OrganismoCodigo { get; set; } = string.Empty;
    public DateTime FechaTramite { get; set; } = DateTime.UtcNow;

    // 2. Placa
    [Required, MaxLength(3)]
    public string PlacaLetras { get; set; } = string.Empty;
    [Required, MaxLength(4)]
    public string PlacaNumeros { get; set; } = string.Empty;

    // 3. Trámite Solicitado
    public string TramitesSeleccionadosJson { get; set; } = "[2]";
    public string? OtroTramiteEspecificar { get; set; }

    // 4. Vehículo
    [Required, MaxLength(50)]
    public string ClaseVehiculo { get; set; } = "AUTOMÓVIL";
    [Required, MaxLength(80)]
    public string Marca { get; set; } = string.Empty;
    [Required, MaxLength(80)]
    public string Linea { get; set; } = string.Empty;
    [Required, MaxLength(30)]
    public string Combustible { get; set; } = "GASOLINA";
    public string ColoresJson { get; set; } = "[\"BLANCO\"]";
    [Required, MaxLength(4)]
    public string Modelo { get; set; } = string.Empty;
    public string? Cilindrada { get; set; }
    public string? CapacidadKg { get; set; }
    public string? CapacidadPsj { get; set; }
    public string? PotenciaHp { get; set; }
    public string CarroceriaCodigo { get; set; } = "01";
    public string CarroceriaTipo { get; set; } = "SEDÁN";

    // 16. Identificación Interna
    public string? NoMotor { get; set; }
    public bool MotorRegrabado { get; set; } = false;
    public string? NoChasis { get; set; }
    public bool ChasisRegrabado { get; set; } = false;
    public string? NoSerie { get; set; }
    public bool SerieRegrabada { get; set; } = false;
    public string? NoVin { get; set; }

    // 21. Propietario
    [Required, MaxLength(60)]
    public string PropietarioPrimerApellido { get; set; } = string.Empty;
    public string? PropietarioSegundoApellido { get; set; }
    [Required, MaxLength(100)]
    public string PropietarioNombres { get; set; } = string.Empty;
    [Required, MaxLength(2)]
    public string PropietarioTipoDocumento { get; set; } = "C";
    [Required, MaxLength(30)]
    public string PropietarioNumeroDocumento { get; set; } = string.Empty;
    public string? PropietarioDireccion { get; set; }
    public string? PropietarioCiudad { get; set; }
    public string? PropietarioTelefono { get; set; }
    public string? PropietarioFirmaBase64 { get; set; }

    // 22. Comprador
    public bool AplicaComprador { get; set; } = false;
    public bool CompradorEsIndeterminada { get; set; } = false;
    public string? CompradorPrimerApellido { get; set; }
    public string? CompradorNombres { get; set; }
    public string? CompradorTipoDocumento { get; set; }
    public string? CompradorNumeroDocumento { get; set; }
    public string? CompradorFirmaBase64 { get; set; }

    // 23. Observaciones y Payload
    public string? ObservacionesEspecificacionOtro { get; set; }
    public string? ObservacionesAntesRunt { get; set; }
    public string? FullPayloadJson { get; set; }
}`;

  const contextCode = `// Data/RuntDbContext.cs
namespace RuntDigital.Api.Data;

using Microsoft.EntityFrameworkCore;
using RuntDigital.Api.Models;

public class RuntDbContext : DbContext
{
    public RuntDbContext(DbContextOptions<RuntDbContext> options) : base(options) { }

    public DbSet<RuntTramite> Tramites => Set<RuntTramite>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Índices para acelerar búsquedas RUNT
        modelBuilder.Entity<RuntTramite>()
            .HasIndex(t => new { t.PlacaLetras, t.PlacaNumeros })
            .HasDatabaseName("IX_Tramites_Placa");

        modelBuilder.Entity<RuntTramite>()
            .HasIndex(t => t.PropietarioNumeroDocumento)
            .HasDatabaseName("IX_Tramites_PropietarioDoc");

        modelBuilder.Entity<RuntTramite>()
            .HasIndex(t => t.NumeroRadicado)
            .HasDatabaseName("IX_Tramites_Radicado");
    }
}`;

  const programCode = `// Program.cs
using Microsoft.EntityFrameworkCore;
using RuntDigital.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuración Base de Datos Local SQLite
builder.Services.AddDbContext<RuntDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=runt_database.sqlite"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new() {
        Title = "RUNT Digital Web API - Ministerio de Transporte",
        Version = "v1"
    });
});

builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RuntDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.MapControllers();
app.Run();`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'guide':
        return guideMarkdown;
      case 'controller':
        return controllerCode;
      case 'model':
        return modelCode;
      case 'context':
        return contextCode;
      case 'program':
        return programCode;
      case 'csproj':
        return csprojCode;
      case 'appsettings':
        return appsettingsCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-purple-950 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Backend ASP.NET Core 8 & SQLite para Visual Studio Code
              </h2>
              <p className="text-xs text-purple-300">
                Ubicación local en el repositorio: <code className="font-mono text-white">/dotnet-backend-reference/</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón principal de descarga del ZIP */}
            <a
              href="/api/dotnet/download"
              download="RuntDigital-AspNetCore-Backend.zip"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
              title="Descargar el proyecto completo empaquetado en .ZIP para abrirlo en VS Code"
            >
              <Download className="h-4 w-4" />
              <span>Descargar Proyecto (.ZIP)</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Resumen de Arquitectura */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-purple-50/50 border-b border-slate-200 text-xs">
          <div className="p-3 rounded-xl bg-white border border-purple-100 flex items-start gap-2.5">
            <Server className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">ASP.NET Core 8 Web API</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Controladores asíncronos REST con validación estricta y Swagger OpenAPI.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-purple-100 flex items-start gap-2.5">
            <Database className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">SQLite & Entity Framework Core</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Base de datos local ligera y portable sin requerir SQL Server ni servidores externos.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-purple-100 flex items-start gap-2.5">
            <FolderArchive className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">100% Compatible con VS Code</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Incluye <code className="font-mono text-purple-700">.csproj</code> para ejecutar directamente con <code className="font-mono text-slate-700">dotnet run</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Pestañas de Archivos C# */}
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {[
              { key: 'guide', label: '📖 Guía VS Code' },
              { key: 'controller', label: 'TramitesController.cs' },
              { key: 'model', label: 'RuntTramite.cs' },
              { key: 'context', label: 'RuntDbContext.cs' },
              { key: 'program', label: 'Program.cs' },
              { key: 'csproj', label: 'RuntDigital.Api.csproj' },
              { key: 'appsettings', label: 'appsettings.json' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-purple-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Visor de Código / Contenido */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200">
          <pre className="leading-relaxed whitespace-pre-wrap">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>
            Puedes abrir la carpeta <code className="font-mono text-purple-700">dotnet-backend-reference</code> en VS Code o descargar el .ZIP
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
