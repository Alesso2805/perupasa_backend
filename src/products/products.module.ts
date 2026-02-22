import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Producto } from '../entities/producto.entity';
import { Precio } from '../entities/precio.entity';
import { Color } from '../entities/color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Precio, Color])],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
