using Microsoft.EntityFrameworkCore;
using RuntDigital.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuración de Base de Datos SQLite Local
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=runt_database.sqlite";

builder.Services.AddDbContext<RuntDbContext>(options =>
    options.UseSqlite(connectionString));

// Controladores y documentación Swagger/OpenAPI
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "RUNT Digital Web API - Ministerio de Transporte",
        Version = "v1",
        Description = "API REST de alta disponibilidad para el Formulario de Solicitud de Trámites del Registro Nacional Automotor."
    });
});

// Configurar CORS para permitir el frontend web/móvil
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Asegurar creación automática de la base de datos SQLite y migraciones
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RuntDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "RUNT API v1"));
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
