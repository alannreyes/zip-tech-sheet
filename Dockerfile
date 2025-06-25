# Multi-stage Dockerfile para ZTS - Zip Technical Sheets
# Construye tanto el backend como el frontend en un solo contenedor

FROM node:18-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# ============================================
# Stage 1: Build Frontend
# ============================================
FROM base AS frontend-builder

WORKDIR /app/frontend

# Copiar archivos de dependencias del frontend
COPY frontend/package*.json ./

# Instalar dependencias del frontend
RUN npm ci

# Copiar código fuente del frontend
COPY frontend/ ./

# Construir el frontend
RUN npm run build

# ============================================
# Stage 2: Build Backend
# ============================================
FROM base AS backend-builder

WORKDIR /app/backend

# Copiar archivos de dependencias del backend
COPY backend/package*.json ./

# Instalar dependencias del backend
RUN npm ci

# Copiar código fuente del backend
COPY backend/ ./

# Construir el backend
RUN npm run build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:18-alpine AS production

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copiar backend construido
COPY --from=backend-builder --chown=appuser:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=appuser:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=appuser:nodejs /app/backend/package*.json ./backend/

# Copiar frontend construido
COPY --from=frontend-builder --chown=appuser:nodejs /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder --chown=appuser:nodejs /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder --chown=appuser:nodejs /app/frontend/public ./frontend/public

# Crear directorio para salidas
RUN mkdir -p /app/output && chown appuser:nodejs /app/output

# Crear script de inicio
COPY --chown=appuser:nodejs <<EOF /app/start.sh
#!/bin/sh
set -e

echo "🚀 Starting ZTS - Zip Technical Sheets"

# Iniciar backend en segundo plano
echo "📡 Starting backend on port \${PORT:-3001}..."
cd /app/backend && node dist/main.js &
BACKEND_PID=\$!

# Esperar un momento para que el backend inicie
sleep 3

# Iniciar frontend
echo "🎨 Starting frontend on port 3000..."
cd /app/frontend && node server.js &
FRONTEND_PID=\$!

# Función para manejar señales de terminación
cleanup() {
    echo "🛑 Shutting down services..."
    kill \$BACKEND_PID \$FRONTEND_PID 2>/dev/null || true
    wait \$BACKEND_PID \$FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Configurar manejo de señales
trap cleanup SIGTERM SIGINT

# Esperar a que los procesos terminen
wait \$BACKEND_PID \$FRONTEND_PID
EOF

# Hacer el script ejecutable
RUN chmod +x /app/start.sh

# Cambiar a usuario no-root
USER appuser

# Exponer puertos
EXPOSE 3000 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001
ENV OUTPUT_DIR=/app/output
ENV BACKEND_URL=http://localhost:3001

# Comando para iniciar la aplicación
CMD ["/app/start.sh"] 