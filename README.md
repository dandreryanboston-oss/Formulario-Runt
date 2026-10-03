# RUNT Digital — Formulario de Solicitud de Trámites (Página 1)
### Ministerio de Transporte de Colombia · Registro Nacional Automotor

Plataforma oficial digitalizada y modular para la radicación y gestión de trámites automotores, desarrollada con arquitectura desacoplada: **Backend en ASP.NET Core 8 Web API con Entity Framework Core y SQLite local**, y **Frontend interactivo mobile-friendly en React con Tailwind CSS**.

---

## 👨‍🏫 Guía Rápida para el Docente / Evaluador

Este repositorio está preparado para que el docente pueda clonarlo y ejecutarlo directamente en **Visual Studio 2022**, **Visual Studio Code** o mediante el **.NET CLI**.

### Opción 1: Abrir en Visual Studio 2022 (Recomendado para docentes Windows)
1. Clona el repositorio desde GitHub:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Haz doble clic en el archivo de solución de la raíz: **`RuntDigital.sln`** (o en `dotnet-backend-reference/RuntDigital.sln`).
3. Visual Studio cargará el proyecto `RuntDigital.Api` y restaurará automáticamente los paquetes NuGet requeridos:
   - `Microsoft.EntityFrameworkCore.Sqlite` (v8.0.0)
   - `Microsoft.EntityFrameworkCore.Design` (v8.0.0)
   - `Swashbuckle.AspNetCore` (v6.5.0)
4. Presiona **`F5`** (o haz clic en el botón verde **Iniciar / Debug**).
5. Visual Studio abrirá automáticamente tu navegador en la documentación interactiva:
   👉 **`http://localhost:5000/swagger`** (o `https://localhost:5001/swagger`).
6. La base de datos SQLite local **`runt_database.sqlite`** se creará automáticamente en la primera ejecución con las tablas e índices optimizados.

---

### Opción 2: Abrir en Visual Studio Code
1. Abre VS Code en la carpeta del repositorio:
   ```bash
   code .
   ```
   (o abre directamente la carpeta `dotnet-backend-reference`).
2. Abre una terminal (`Ctrl + ~`) y ejecuta:
   ```bash
   cd dotnet-backend-reference
   dotnet restore
   dotnet run
   ```
3. Accede a Swagger UI en: **`http://localhost:5000/swagger`**.

---

### Opción 3: Descarga Directa en formato .ZIP desde la Aplicación Web
Si el evaluador prefiere no usar Git:
1. Dentro de la aplicación web activa, en la barra superior haz clic en **`Descargar .NET (.ZIP)`**.
2. O ingresa al modal **`Arquitectura ASP.NET Core`** y haz clic en **`Descargar Proyecto (.ZIP)`**.
3. Descargará un archivo empaquetado con la solución completa lista para abrir en Visual Studio.

---

## 🏛️ Arquitectura del Sistema

```text
├── RuntDigital.sln                      # Archivo de solución de Visual Studio 2022
├── dotnet-backend-reference/            # Proyecto Backend ASP.NET Core 8 Web API
│   ├── Controllers/
│   │   └── TramitesController.cs        # Endpoints REST (CRUD, radicado oficial, estadísticas)
│   ├── Data/
│   │   └── RuntDbContext.cs             # DbContext de EF Core configurado con SQLite
│   ├── Models/
│   │   └── RuntTramite.cs               # Entidad y modelo con validaciones de tránsito
│   ├── Properties/
│   │   └── launchSettings.json          # Perfiles de inicio y apertura de Swagger en puerto 5000
│   ├── appsettings.json                 # Conexión local: "Data Source=runt_database.sqlite"
│   ├── RuntDigital.Api.csproj           # Archivo de proyecto .NET 8 con dependencias NuGet
│   └── README.md                        # Guía técnica específica del backend C#
│
├── runt_database.sqlite                 # Base de datos binaria SQLite persistente
├── src/                                 # Frontend React (Flujo en 5 pasos + Hoja Oficial RUNT)
│   ├── components/                      # Componentes de pasos, placa dinámica, firma digital
│   ├── data/runtCatalogs.ts             # Catálogos oficiales (DIVIPOLA, Carrocerías pág 2)
│   ├── services/db.ts                   # Servicio cliente de integración con SQLite
│   └── types/runt.ts                    # Tipos TypeScript de las 23 casillas oficiales
└── server.ts                            # Servidor Node/Express con emulador SQLite & API
```

---

## 📑 Cumplimiento del Formulario RUNT (Página 1 del PDF)

El sistema digitaliza fielmente las **23 casillas oficiales**:

1. **Organismo de Tránsito:** Catálogo nacional con códigos DIVIPOLA (SIM Bogotá 11001, Medellín 05001, Cali 76001, etc.) y fecha del trámite.
2. **Placa:** Validación de formato y renderizador gráfico interactivo que simula la placa metálica colombiana (particular, pública, oficial o diplomática).
3. **Trámite Solicitado:** 18 opciones oficiales con cuadrícula interactiva (Matrícula inicial, Traspaso, Duplicados, Cambio de servicio, etc.).
4. **Clase de Vehículo:** 14 clases oficiales (Automóvil, Camión, Motocicleta, Volqueta, etc.).
5. **Marca & 6. Línea:** Catálogo de marcas y líneas homologadas en Colombia.
6. **Combustible:** Gasolina, Diésel, Gas, Mixto/Híbrido, Eléctrico, Hidrógeno, Etanol, Biodiésel.
7. **Colores:** Hasta 3 colores predominantes con selector visual.
8. **Modelo, 10. Cilindrada, 11. Capacidad & 14. Potencia HP:** Especificaciones técnicas de la tarjeta de propiedad.
9. **Carrocería:** Filtrado en cascada automático según la **matriz oficial de la página 2 del PDF** (Sedán, Hatchback, Estacas, Furgón, etc.).
10. **Identificación Interna:** Números de Motor, Chasis, Serie y VIN con casillas de regrabación legal (SÍ/NO).
11. **Importación o Remate:** Manifiesto, declaración o acta con entidad y fecha.
12. **Tipo de Servicio & 19. Empresa Vinculadora:** Requerido para transporte público/especial con NIT y razón social.
13. **Datos de Alerta:** Hurto, limitación de la propiedad/prenda, embargo y entidad a favor.
14. **Datos del Propietario & 22. Datos del Comprador (Traspaso):** Tipos de documento oficiales (CC, NIT, NN, Pasaporte, CE, TI, NUIP, CD), direcciones, teléfonos y **canvas de firma digital táctil**. Permite traspaso a *Persona Indeterminada (NN)* según la Resolución 3282.
15. **Observaciones:** Aclaraciones técnicas y transcripción de licencias previas al RUNT.

---

## 🖨️ Vista Oficial e Impresión (Hoja 1:1)
La aplicación cuenta con una vista que recrea la hoja física del formulario RUNT con escudos de la República de Colombia, tipografía institucional y ubicación exacta de las firmas digitales, lista para imprimir en hoja carta/A4 o exportar a PDF con un clic (`Ctrl + P`).
