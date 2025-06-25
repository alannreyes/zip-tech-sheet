import { Module } from '@nestjs/common';
import { ZipController } from './zip.controller';
import { ZipService } from './zip.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ZipController],
  providers: [ZipService],
})
export class ZipModule {} 