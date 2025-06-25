import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private dbType: string;
  private connection: any;

  constructor(private configService: ConfigService) {
    this.dbType = this.configService.get('DB_TYPE', 'mssql');
  }

  async connect(): Promise<void> {
    try {
      switch (this.dbType.toLowerCase()) {
        case 'mssql':
          await this.connectMSSql();
          break;
        case 'mysql':
          await this.connectMySQL();
          break;
        case 'postgresql':
        case 'postgres':
          await this.connectPostgreSQL();
          break;
        default:
          throw new Error(`Tipo de base de datos no soportado: ${this.dbType}`);
      }
    } catch (error) {
      console.error('Error conectando a la base de datos:', error);
      throw error;
    }
  }

  async getTechnicalSheetPath(code: string): Promise<string | null> {
    if (!this.connection) {
      await this.connect();
    }

    const query = "SELECT ART_HOJAT_RUTA FROM AR0000_OTROS WHERE ART_CODART = ?";
    
    try {
      let result;
      
      switch (this.dbType.toLowerCase()) {
        case 'mssql':
          result = await this.connection.request()
            .input('code', code)
            .query("SELECT ART_HOJAT_RUTA FROM AR0000_OTROS WHERE ART_CODART = @code");
          return result.recordset[0]?.ART_HOJAT_RUTA || null;
          
        case 'mysql':
          const [rows] = await this.connection.execute(query, [code]);
          return rows[0]?.ART_HOJAT_RUTA || null;
          
        case 'postgresql':
        case 'postgres':
          result = await this.connection.query(
            "SELECT ART_HOJAT_RUTA FROM AR0000_OTROS WHERE ART_CODART = $1", 
            [code]
          );
          return result.rows[0]?.art_hojat_ruta || null;
          
        default:
          throw new Error(`Tipo de base de datos no soportado: ${this.dbType}`);
      }
    } catch (error) {
      console.error(`Error consultando ficha técnica para código ${code}:`, error);
      return null;
    }
  }

  private async connectMSSql(): Promise<void> {
    const sql = require('mssql');
    
    const config = {
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      server: this.configService.get('DB_HOST'),
      database: this.configService.get('DB_NAME'),
      options: {
        encrypt: this.configService.get('DB_ENCRYPT', 'false') === 'true',
        trustServerCertificate: true,
      },
    };

    this.connection = await sql.connect(config);
  }

  private async connectMySQL(): Promise<void> {
    const mysql = require('mysql2/promise');
    
    this.connection = await mysql.createConnection({
      host: this.configService.get('DB_HOST'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      port: this.configService.get('DB_PORT', 3306),
    });
  }

  private async connectPostgreSQL(): Promise<void> {
    const { Client } = require('pg');
    
    this.connection = new Client({
      host: this.configService.get('DB_HOST'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      port: this.configService.get('DB_PORT', 5432),
    });

    await this.connection.connect();
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        switch (this.dbType.toLowerCase()) {
          case 'mssql':
            await this.connection.close();
            break;
          case 'mysql':
            await this.connection.end();
            break;
          case 'postgresql':
          case 'postgres':
            await this.connection.end();
            break;
        }
      } catch (error) {
        console.error('Error desconectando de la base de datos:', error);
      }
    }
  }
} 