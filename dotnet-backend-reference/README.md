# RUNT Digital - Backend ASP.NET Core 8 & SQLite

Este proyecto contiene el backend completo en **C# / ASP.NET Core 8 Web API** con persistencia en base de datos local **SQLite** mediante **Entity Framework Core**, diseñado para el Formulario de Solicitud de Trámites del Registro Nacional Automotor (RUNT - Ministerio de Transporte de Colombia).

---

## 🚀 Cómo abrir y ejecutar en Visual Studio Code

### 1. Requisitos Previos
- **.NET 8 SDK** instalado ([Descargar .NET 8](https://dotnet.microsoft.com/download/dotnet/8.0))
- **Visual Studio Code** ([Descargar VS Code](https://code.visualstudio.com/))
- Extensión recomendada en VS Code: **C# Dev Kit** o **C# (OmniSharp)** de Microsoft.

---

### 2. Abrir el Proyecto en VS Code
1. Abre **Visual Studio Code**.
2. Ve a `Archivo (File)` -> `Abrir carpeta... (Open Folder...)`.
3. Selecciona la carpeta `dotnet-backend-reference` (o descomprime el ZIP descargado).
4. VS Code detectará automáticamente el archivo `RuntDigital.Api.csproj` y restaurará los paquetes NuGet.

---

### 3. Ejecutar el Servidor desde la Terminal Integrada de VS Code
Abre la terminal integrada en VS Code (`Ctrl + ~` o `Terminal -> Nueva Terminal`) y ejecuta:

```bash
# 1. Restaurar dependencias
dotnet restore

# 2. Compilar el proyecto
dotnet build

# 3. Iniciar el servidor API
dotnet run
```

Verás una salida similar a:
```text
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7123
      Now listening on: http://localhost:5123
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

---

### 4. Probar la API en Swagger UI
Abre tu navegador en:
👉 **`https://localhost:7123/swagger`** o **`http://localhost:5123/swagger`**

Allí podrás probar interactivamente los endpoints:
- `GET /api/tramites`: Listar todos los trámites radicados o borradores.
- `GET /api/tramites/{id}`: Obtener un trámite por ID.
- `POST /api/tramites`: Radicar o guardar un nuevo formulario RUNT con validación.
- `DELETE /api/tramites/{id}`: Eliminar un trámite.
- `GET /api/tramites/stats`: Estadísticas de la base de datos SQLite.

---

### 5. Base de Datos SQLite Local (`runt_database.sqlite`)
- La base de datos SQLite se crea automáticamente en la raíz del proyecto al iniciar la aplicación mediante `db.Database.EnsureCreated()`.
- No requiere instalar SQL Server, Docker ni servicios externos adicionales.
- Puedes inspeccionar las tablas con la extensión de VS Code **SQLite Viewer** (de Florian Klampfer).

---

## 📂 Estructura del Proyecto C#
```text
dotnet-backend-reference/
├── Controllers/
│   └── TramitesController.cs     # API REST endpoints con EF Core
├── Data/
│   └── RuntDbContext.cs          # Contexto DbContext con índices para Placa y Cédula
├── Models/
│   └── RuntTramite.cs            # Entidad fuertemente tipada con DataAnnotations
├── Program.cs                    # Configuración de Swagger, CORS y DI
├── appsettings.json              # Cadena de conexión Data Source=runt_database.sqlite
└── RuntDigital.Api.csproj        # Definición del proyecto .NET 8 y paquetes NuGet
```
