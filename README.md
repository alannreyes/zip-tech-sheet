# ZTS - Zip Technical Sheets

Sistema para generar archivos ZIP organizados con fichas técnicas basándose en códigos EFC.

## 🌟 Características

- **Carga masiva**: Procesa hasta 500 códigos EFC simultáneamente
- **Organización inteligente**: Genera archivos ZIP que no superan los 5MB
- **Múltiples formatos**: Soporta PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
- **Reportes Excel**: Genera índices detallados con el estado de cada ficha técnica
- **Interfaz responsive**: Diseño moderno y fácil de usar
- **Múltiples bases de datos**: Compatible con SQL Server, MySQL y PostgreSQL

## 🏗️ Arquitectura

- **Frontend**: Next.js 14 con TypeScript y Tailwind CSS
- **Backend**: NestJS con TypeScript
- **Base de datos**: Configurable (SQL Server, MySQL, PostgreSQL)
- **Despliegue**: Docker/Docker Compose

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- Docker y Docker Compose (para despliegue)
- Acceso a base de datos con la tabla `AR0000_OTROS`

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd zts-zip-technical-sheets
```

### 2. Configurar variables de entorno

Copie el archivo de ejemplo y configure sus variables:

```bash
cp backend/env.example backend/.env
```

Edite `backend/.env` con sus datos:

```env
# Configuración del servidor
PORT=3001

# Configuración de la base de datos
DB_TYPE=mssql                    # mssql, mysql, o postgresql
DB_HOST=localhost
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_PORT=1433                     # 1433 para SQL Server, 3306 para MySQL, 5432 para PostgreSQL
DB_ENCRYPT=false                 # Solo para SQL Server

# Directorio de salida
OUTPUT_DIR=./output

# Ruta base de fichas técnicas (opcional)
TECH_SHEETS_BASE_PATH=/ruta/a/fichas/tecnicas
```

### 3. Instalación de dependencias

```bash
npm run install:all
```

### 4. Desarrollo local

```bash
npm run dev
```

Esto iniciará:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:3000`

## 🐳 Despliegue con Docker

### 1. Configurar variables de entorno

Cree un archivo `.env` en la raíz del proyecto:

```env
DB_TYPE=mssql
DB_HOST=tu_servidor_bd
DB_NAME=tu_base_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_PORT=1433
DB_ENCRYPT=false
TECH_SHEETS_BASE_PATH=/ruta/a/fichas/tecnicas
```

### 2. Construir y ejecutar

```bash
docker-compose up -d
```

La aplicación estará disponible en:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

## 📊 Estructura de Base de Datos

El sistema consulta la tabla `AR0000_OTROS` con la siguiente estructura:

```sql
SELECT ART_HOJAT_RUTA FROM AR0000_OTROS WHERE ART_CODART = 'CODIGO_EFC'
```

- `ART_CODART`: Código EFC del producto
- `ART_HOJAT_RUTA`: Ruta completa al archivo de ficha técnica

## 🎯 Uso de la Aplicación

### 1. Cargar códigos EFC
- Pegue los códigos en el área de texto (uno por línea)
- El sistema elimina automáticamente duplicados
- Máximo: 500 códigos por procesamiento

### 2. Procesar
- Haga clic en "Generar ZIP"
- El sistema buscará cada ficha técnica en la base de datos
- Verificará la existencia de los archivos físicos
- Organizará los archivos en ZIPs de máximo 5MB

### 3. Descargar resultados
- Descargue los archivos ZIP generados
- Descargue el archivo Excel con el índice detallado

## 📁 Nomenclatura de Archivos

### Archivos ZIP
```
YYYY_MM_DD_001.zip
YYYY_MM_DD_002.zip
...
```

### Archivo Excel
```
YYYY_MM_DD_indice.xlsx
```

## 🔧 Configuración Avanzada

### Extensiones de Archivo Soportadas

Por defecto, el sistema soporta:
- `.pdf`
- `.doc`, `.docx`
- `.jpg`, `.jpeg`, `.png`
- `.txt`

Para modificar las extensiones, edite `backend/src/modules/zip/zip.service.ts`:

```typescript
private readonly supportedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'];
```

### Tamaño Máximo de ZIP

Para cambiar el límite de 5MB por ZIP, modifique:

```typescript
private readonly maxZipSize = 5 * 1024 * 1024; // 5MB en bytes
```

## 🧪 Testing

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 📝 API Endpoints

### POST `/zip/process`
Procesa una lista de códigos EFC y genera archivos ZIP.

**Body:**
```json
{
  "codes": ["01010114", "01010115", "01010116"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Procesamiento completado exitosamente",
  "data": {
    "totalCodes": 3,
    "foundSheets": 2,
    "notFoundSheets": 1,
    "zipFiles": ["2024_01_15_001.zip"],
    "sheets": [...],
    "excelFileName": "2024_01_15_indice.xlsx"
  }
}
```

### POST `/zip/download-zip`
Descarga un archivo ZIP específico.

### POST `/zip/download-excel`
Descarga el archivo Excel de índice.

## 🚨 Solución de Problemas

### Error de conexión a la base de datos
1. Verifique las credenciales en `.env`
2. Asegúrese de que el servidor de BD sea accesible
3. Confirme el tipo de base de datos (`DB_TYPE`)

### Archivos no encontrados
1. Verifique que las rutas en `ART_HOJAT_RUTA` sean correctas
2. Confirme que el usuario tenga permisos de lectura
3. Monte los volúmenes correctamente en Docker

### Errores de memoria
1. Procese menos códigos por lote
2. Aumente la memoria disponible para Docker
3. Optimice el tamaño de los archivos de fichas técnicas

## 🤝 Contribuir

1. Fork el proyecto
2. Cree una rama para su feature (`git checkout -b feature/AmazingFeature`)
3. Commit sus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abra un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Vea el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas, abra un issue en el repositorio o contacte al equipo de desarrollo.

---

Desarrollado con ❤️ para optimizar la gestión de fichas técnicas. 