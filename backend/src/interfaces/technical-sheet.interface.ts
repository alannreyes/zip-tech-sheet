export interface TechnicalSheet {
  code: string;
  filePath?: string;
  fileName?: string;
  exists: boolean;
  fileSize?: number;
  zipFileName?: string;
  error?: string;
}

export interface ZipProcessResult {
  totalCodes: number;
  foundSheets: number;
  notFoundSheets: number;
  zipFiles: string[];
  sheets: TechnicalSheet[];
  excelFileName: string;
} 