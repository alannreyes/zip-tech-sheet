'use client';

import { useState } from 'react';
import { Download, FileText, Archive, CheckCircle, XCircle, Eye } from 'lucide-react';
import { ZipProcessResult, TechnicalSheet } from '@/types';

interface ResultsDisplayProps {
  result: ZipProcessResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'found' | 'notfound'>('summary');

  const handleDownloadZip = async (fileName: string) => {
    try {
      const response = await fetch('/api/zip/download-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error descargando el archivo ZIP');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error descargando el archivo ZIP');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch('/api/zip/download-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: result.excelFileName }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = result.excelFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error descargando el archivo Excel');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error descargando el archivo Excel');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const foundSheets = result.sheets.filter(sheet => sheet.exists);
  const notFoundSheets = result.sheets.filter(sheet => !sheet.exists);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Resultados del Procesamiento
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{result.totalCodes}</div>
          <div className="text-sm text-blue-700">Códigos Procesados</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{result.foundSheets}</div>
          <div className="text-sm text-green-700">Fichas Encontradas</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{result.notFoundSheets}</div>
          <div className="text-sm text-red-700">No Encontradas</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{result.zipFiles.length}</div>
          <div className="text-sm text-purple-700">Archivos ZIP</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Descargas Disponibles</h3>
        
        <div className="flex flex-wrap gap-2">
          {result.zipFiles.map((zipFile, index) => (
            <button
              key={index}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Archive className="h-4 w-4 mr-2" />
              {zipFile}
            </button>
          ))}
          
          {result.excelFileName && (
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
              <FileText className="h-4 w-4 mr-2" />
              {result.excelFileName}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 