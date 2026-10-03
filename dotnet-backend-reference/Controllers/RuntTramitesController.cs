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

    /// <summary>
    /// Obtiene todos los trámites registrados o borradores en la base de datos SQLite.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RuntTramite>>> GetAll([FromQuery] string? placa, [FromQuery] string? status)
    {
        var query = _context.Tramites.AsQueryable();

        if (!string.IsNullOrWhiteSpace(placa))
        {
            var cleanPlaca = placa.ToUpper().Replace("-", "").Trim();
            query = query.Where(t => (t.PlacaLetras + t.PlacaNumeros).Contains(cleanPlaca));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(t => t.Status == status.ToUpper());
        }

        var results = await query
            .OrderByDescending(t => t.UpdatedAt)
            .ToListAsync();

        return Ok(results);
    }

    /// <summary>
    /// Obtiene un trámite específico por su identificador único.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<RuntTramite>> GetById(string id)
    {
        var item = await _context.Tramites.FindAsync(id);
        if (item == null)
        {
            return NotFound(new { message = $"Trámite con ID {id} no fue encontrado." });
        }
        return Ok(item);
    }

    /// <summary>
    /// Crea o actualiza un trámite en la base de datos SQLite con validación RUNT.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<RuntTramite>> Upsert([FromBody] RuntTramite tramite)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Generar número de radicado oficial si el estado pasa a RADICADO
        if (tramite.Status == "RADICADO" && string.IsNullOrWhiteSpace(tramite.NumeroRadicado))
        {
            var year = DateTime.UtcNow.Year;
            var randomSuffix = Random.Shared.Next(10000000, 99999999);
            tramite.NumeroRadicado = $"RNA-{year}-{randomSuffix}";
        }

        var existing = await _context.Tramites.FindAsync(tramite.Id);
        if (existing == null)
        {
            tramite.CreatedAt = DateTime.UtcNow;
            tramite.UpdatedAt = DateTime.UtcNow;
            await _context.Tramites.AddAsync(tramite);
            _logger.LogInformation("Nuevo trámite RUNT guardado en SQLite con ID: {Id}", tramite.Id);
        }
        else
        {
            tramite.UpdatedAt = DateTime.UtcNow;
            _context.Entry(existing).CurrentValues.SetValues(tramite);
            _logger.LogInformation("Trámite RUNT actualizado en SQLite: {Id}", tramite.Id);
        }

        await _context.SaveChangesAsync();
        return Ok(tramite);
    }

    /// <summary>
    /// Elimina un trámite de la base de datos local SQLite.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var item = await _context.Tramites.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        _context.Tramites.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Estadísticas de la base de datos SQLite para monitoreo.
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var total = await _context.Tramites.CountAsync();
        var radicados = await _context.Tramites.CountAsync(t => t.Status == "RADICADO");
        var borradores = total - radicados;

        return Ok(new
        {
            TotalRecords = total,
            Radicados = radicados,
            Borradores = borradores,
            DatabaseEngine = "Microsoft.Data.Sqlite / Entity Framework Core",
            Timestamp = DateTime.UtcNow
        });
    }
}
