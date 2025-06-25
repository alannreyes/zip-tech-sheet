# Usar Node.js 18 LTS
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Crear directorio para salidas
RUN mkdir -p /app/output

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001
ENV OUTPUT_DIR=/app/output

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"] 