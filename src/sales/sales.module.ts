import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PdfService } from './pdf.service';
import { GuiaVenta } from '../entities/guia-venta.entity';
import { DetalleGuia } from '../entities/detalle-guia.entity';
import { DetalleColor } from '../entities/detalle-color.entity';
import { Producto } from '../entities/producto.entity';
import { Precio } from '../entities/precio.entity';
import { Color } from '../entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuiaVenta,
      DetalleGuia,
      DetalleColor,
      Producto,
      Precio,
      Color,
    ]),
  ],
  providers: [SalesService, PdfService],
  controllers: [SalesController]
})
export class SalesModule {}
