'use client';

import { useState, useRef } from 'react';
import { FileText, Trash2, Play } from 'lucide-react';

interface CodeInputProps {
  codes: string[];
  onChange: (codes: string[]) => void;
  onProcess: () => void;
  onClear: () => void;
  isProcessing: boolean;
}

export function CodeInput({ codes, onChange, onProcess, onClear, isProcessing }: CodeInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Procesar códigos en tiempo real
    const lines = value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const uniqueCodes = Array.from(new Set(lines));
    onChange(uniqueCodes);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text');
    const currentValue = inputValue;
    const newValue = currentValue + (currentValue ? '\n' : '') + pastedData;
    handleInputChange(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Códigos EFC
          </h2>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Total: {codes.length}</span>
          {codes.length > 0 && (
            <span className="text-green-600">• Válidos: {codes.length}</span>
          )}
          {codes.length > 500 && (
            <span className="text-red-600">• Máximo: 500</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="codes-input" className="block text-sm font-medium text-gray-700 mb-2">
            Pegue aquí los códigos EFC (uno por línea):
          </label>
          <textarea
            ref={textareaRef}
            id="codes-input"
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder="01010114&#10;01010115&#10;01010116&#10;..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onPaste={handlePaste}
            disabled={isProcessing}
          />
          
          <div className="mt-2 text-xs text-gray-500">
            💡 Consejo: Puede pegar múltiples códigos desde Excel o cualquier texto. 
            Los códigos duplicados se eliminarán automáticamente.
          </div>
        </div>

        {codes.length > 0 && (
          <div className="bg-gray-50 rounded-md p-3">
            <div className="text-sm text-gray-700 mb-2">
              Vista previa ({Math.min(codes.length, 10)} de {codes.length} códigos):
            </div>
            <div className="font-mono text-xs text-gray-600 space-y-1">
              {codes.slice(0, 10).map((code, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400">{index + 1}.</span>
                  <span>{code}</span>
                </div>
              ))}
              {codes.length > 10 && (
                <div className="text-gray-400 italic">
                  ... y {codes.length - 10} códigos más
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleClear}
            disabled={isProcessing || codes.length === 0}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar
          </button>

          <button
            onClick={onProcess}
            disabled={isProcessing || codes.length === 0 || codes.length > 500}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Procesando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generar ZIP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 