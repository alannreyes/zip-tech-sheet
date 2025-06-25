#!/bin/sh
set -e

echo "🚀 Starting ZTS - Zip Technical Sheets"

# Iniciar backend en segundo plano
echo "📡 Starting backend on port ${PORT:-3001}..."
cd /app/backend && node dist/main.js &
BACKEND_PID=$!

# Esperar un momento para que el backend inicie
echo "⏳ Waiting for backend to start..."
sleep 5

# Iniciar frontend
echo "🎨 Starting frontend on port 3000..."
cd /app/frontend && node server.js &
FRONTEND_PID=$!

# Función para manejar señales de terminación
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Configurar manejo de señales
trap cleanup SIGTERM SIGINT

echo "✅ Both services started successfully"
echo "📡 Backend running on port ${PORT:-3001}"
echo "🎨 Frontend running on port 3000"

# Esperar a que los procesos terminen
wait $BACKEND_PID $FRONTEND_PID 