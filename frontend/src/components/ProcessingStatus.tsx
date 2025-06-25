'use client';

import { Loader2 } from 'lucide-react';

export function ProcessingStatus() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Procesando fichas técnicas...
          </h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p>🔍 Consultando base de datos para obtener rutas de archivos</p>
            <p>📁 Verificando existencia de fichas técnicas</p>
            <p>📦 Organizando archivos en grupos por tamaño (máx. 5MB por ZIP)</p>
            <p>📊 Generando archivo Excel de índice</p>
          </div>
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <span className="text-xs text-blue-600 font-medium">Procesando...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 