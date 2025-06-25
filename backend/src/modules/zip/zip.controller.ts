import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ZipService } from './zip.service';
import { ProcessCodesDto } from '../../dto/process-codes.dto';

@Controller('zip')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Post('process')
  async processCodes(@Body() processCodesDto: ProcessCodesDto) {
    try {
      if (!processCodesDto.codes || !Array.isArray(processCodesDto.codes)) {
        throw new HttpException(
          'Se requiere un array de códigos válido',
          HttpStatus.BAD_REQUEST
        );
      }

      if (processCodesDto.codes.length === 0) {
        throw new HttpException(
          'Debe proporcionar al menos un código',
          HttpStatus.BAD_REQUEST
        );
      }

      if (processCodesDto.codes.length > 500) {
        throw new HttpException(
          'No se pueden procesar más de 500 códigos a la vez',
          HttpStatus.BAD_REQUEST
        );
      }

      // Limpiar y validar códigos
      const cleanCodes = processCodesDto.codes
        .map(code => code.toString().trim())
        .filter(code => code.length > 0);

      if (cleanCodes.length === 0) {
        throw new HttpException(
          'No se encontraron códigos válidos',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.zipService.processCodesAndCreateZips(cleanCodes);
      
      return {
        success: true,
        message: 'Procesamiento completado exitosamente',
        data: result
      };

    } catch (error) {
      console.error('Error procesando códigos:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error interno del servidor al procesar los códigos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('download-zip')
  async downloadZip(@Body() body: { fileName: string }, @Res() res: Response) {
    try {
      if (!body.fileName) {
        throw new HttpException(
          'Se requiere el nombre del archivo',
          HttpStatus.BAD_REQUEST
        );
      }

      const filePath = await this.zipService.getZipFilePath(body.fileName);
      
      if (!filePath) {
        throw new HttpException(
          'Archivo no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      res.download(filePath, body.fileName);
    } catch (error) {
      console.error('Error descargando archivo ZIP:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error interno del servidor al descargar el archivo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('download-excel')
  async downloadExcel(@Body() body: { fileName: string }, @Res() res: Response) {
    try {
      if (!body.fileName) {
        throw new HttpException(
          'Se requiere el nombre del archivo Excel',
          HttpStatus.BAD_REQUEST
        );
      }

      const filePath = await this.zipService.getExcelFilePath(body.fileName);
      
      if (!filePath) {
        throw new HttpException(
          'Archivo Excel no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      res.download(filePath, body.fileName);
    } catch (error) {
      console.error('Error descargando archivo Excel:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error interno del servidor al descargar el archivo Excel',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 