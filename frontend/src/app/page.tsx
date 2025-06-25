'use client';

import { useState } from 'react';
import { CodeInput } from '@/components/CodeInput';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ZipProcessResult } from '@/types';

export default function HomePage() {
  const [codes, setCodes] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ZipProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCodesChange = (newCodes: string[]) => {
    setCodes(newCodes);
    setResult(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (codes.length === 0) {
      setError('Debe ingresar al menos un código EFC');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/zip/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codes }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Error procesando los códigos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setCodes([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generador de Fichas Técnicas ZIP
        </h1>
        <p className="text-lg text-gray-600">
          Pegue hasta 500 códigos EFC para generar archivos ZIP organizados con sus fichas técnicas
        </p>
      </div>

      {/* Input Section */}
      <CodeInput 
        codes={codes}
        onChange={handleCodesChange}
        onProcess={handleProcess}
        onClear={handleClear}
        isProcessing={isProcessing}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && <ProcessingStatus />}

      {/* Results */}
      {result && <ResultsDisplay result={result} />}
    </div>
  );
} 