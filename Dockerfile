# Dockerfile simplificado para EasyPanel
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar y construir backend primero
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copiar y construir frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copiar código fuente del backend y construir
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm run build

# Copiar código fuente del frontend y construir
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm run build

# Volver al directorio principal
WORKDIR /app

# Crear directorio para salidas
RUN mkdir -p /app/output

# Copiar script de inicio
COPY start.sh /app/start.sh

# Hacer el script ejecutable
RUN chmod +x /app/start.sh

# Exponer puertos
EXPOSE 3000 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV OUTPUT_DIR=/app/output

# Comando para iniciar la aplicación
CMD ["/app/start.sh"] 