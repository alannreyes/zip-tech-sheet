import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡ZTS - Zip Technical Sheets API funcionando correctamente!';
  }
} 