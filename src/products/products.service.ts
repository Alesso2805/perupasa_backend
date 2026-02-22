import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Precio, TipoLista } from '../entities/precio.entity';
import { Color } from '../entities/color.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Producto)
    private productRepo: Repository<Producto>,
    @InjectRepository(Precio)
    private priceRepo: Repository<Precio>,
    @InjectRepository(Color)
    private colorRepo: Repository<Color>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const productsCount = await this.productRepo.count();
    if (productsCount > 0) {
      this.logger.log('Database already seeded');
      return;
    }

    this.logger.log('Seeding database...');

    // Colors
    const colors = [1, 23, 43, 53, 82];
    for (const num of colors) {
      await this.colorRepo.save({ numero_color: num });
    }

    // Product 1: Art 383
    const p1 = await this.productRepo.save({
      codigo_articulo: '383',
      nombre: 'Fleco Rayon 5cm',
      categoria: 'Fleco',
    });

    await this.priceRepo.save([
      { producto: p1, tipo_lista: TipoLista.GENERAL, valor_soles: 50.0 },
      { producto: p1, tipo_lista: TipoLista.COPASA, valor_soles: 45.0 },
    ]);

    // Product 2: Art 500
    const p2 = await this.productRepo.save({
      codigo_articulo: '500',
      nombre: 'Cordon de Seda',
      categoria: 'Cordon',
    });

    await this.priceRepo.save([
      { producto: p2, tipo_lista: TipoLista.GENERAL, valor_soles: 120.0 },
      { producto: p2, tipo_lista: TipoLista.COPASA, valor_soles: 100.0 },
    ]);

    this.logger.log('Seeding complete');
  }
}
