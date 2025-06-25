# Dockerfile simplificado para EasyPanel
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Instalar dependencias del workspace
RUN npm install

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm ci --only=production

# Instalar dependencias del frontend
WORKDIR /app/frontend
RUN npm ci

# Volver al directorio principal
WORKDIR /app

# Copiar todo el código fuente
COPY . .

# Construir el backend
WORKDIR /app/backend
RUN npm run build

# Construir el frontend
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