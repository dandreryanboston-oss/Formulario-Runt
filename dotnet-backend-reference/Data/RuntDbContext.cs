namespace RuntDigital.Api.Data;

using Microsoft.EntityFrameworkCore;
using RuntDigital.Api.Models;

/// <summary>
/// Contexto de Base de Datos Entity Framework Core configurado para SQLite local.
/// </summary>
public class RuntDbContext : DbContext
{
    public RuntDbContext(DbContextOptions<RuntDbContext> options) : base(options)
    {
    }

    public DbSet<RuntTramite> Tramites => Set<RuntTramite>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Índices para búsquedas ultra-rápidas por Placa, Cédula del Propietario y Número de Radicado
        modelBuilder.Entity<RuntTramite>()
            .HasIndex(t => new { t.PlacaLetras, t.PlacaNumeros })
            .HasDatabaseName("IX_Tramites_Placa");

        modelBuilder.Entity<RuntTramite>()
            .HasIndex(t => t.PropietarioNumeroDocumento)
            .HasDatabaseName("IX_Tramites_PropietarioDoc");

        modelBuilder.Entity<RuntTramite>()
            .HasIndex(t => t.NumeroRadicado)
            .IsUnique(false)
            .HasDatabaseName("IX_Tramites_Radicado");
    }
}
