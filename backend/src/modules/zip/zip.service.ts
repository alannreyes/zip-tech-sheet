import { Injectable } from '@nestjs/common';

@Injectable()
export class ZipService {
  async processCodesAndCreateZips(codes: string[]) {
    return {
      totalCodes: codes.length,
      foundSheets: 0,
      notFoundSheets: codes.length,
      zipFiles: [],
      sheets: [],
      excelFileName: ''
    };
  }

  async getZipFilePath(fileName: string): Promise<string | null> {
    return null;
  }

  async getExcelFilePath(fileName: string): Promise<string | null> {
    return null;
  }
} 