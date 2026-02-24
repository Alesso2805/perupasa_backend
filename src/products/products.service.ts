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

  async findAll() {
    return this.productRepo.find({
      relations: ['precios'],
    });
  }

  async findAllColors() {
    return this.colorRepo.find({
      order: { numero_color: 'ASC' },
    });
  }

  async seed() {
    this.logger.log('Seeding database...');

    // 1. Seed Colors
    const colors = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
      46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 58, 60, 80, 81, 82,
    ];

    for (const num of colors) {
      const exists = await this.colorRepo.findOneBy({ numero_color: num });
      if (!exists) {
        await this.colorRepo.save({ numero_color: num });
      }
    }

    // 2. Full COPASA Catalog Items
    const catalog = [
      // GRECAS
      { code: '215-P', name: 'Greca 215-P x 10m', cat: 'Greca', price: 2.30 },
      { code: '238-P', name: 'Greca 238-P x 10m con punto', cat: 'Greca', price: 5.20 },
      { code: '240-P', name: 'Greca 240-P x 10m', cat: 'Greca', price: 4.50 },
      { code: '220', name: 'Greca 220 x 20m', cat: 'Greca', price: 26.00 },
      { code: '440-20', name: 'Greca 440 x 20m', cat: 'Greca', price: 29.50 },
      { code: '440-10', name: 'Greca 440 x 10m', cat: 'Greca', price: 15.50 },
      { code: '268', name: 'Greca 268 x 20m', cat: 'Greca', price: 26.00 },
      { code: '269', name: 'Greca de Mueble 269 x 10m', cat: 'Greca', price: 29.00 },
      { code: 'BLONDA-ANG', name: 'Blonda Ang. x Metro Poli', cat: 'Greca', price: 0.40 },
      { code: 'BLONDA-MARIA', name: 'Blonda Maria x Metro', cat: 'Greca', price: 0.80 },
      { code: 'BLONDA-TR-POLI', name: 'Blonda Trinche Poli x Metro', cat: 'Greca', price: 0.80 },
      { code: 'BLONDA-TR-PL', name: 'Blonda Trinche P/L x Metro', cat: 'Greca', price: 0.90 },
      { code: 'TRINCHECITO', name: 'Trinchecito Polipropileno', cat: 'Greca', price: 0.90 },
      { code: '442', name: 'Greca 442 (440 Doble) Seda x Metro', cat: 'Greca', price: 4.50 },
      
      // GRECAS DORADAS
      { code: '330-PL', name: 'Greca 330 P/L', cat: 'Greca Dorada', price: 5.30 },
      { code: '364', name: 'Greca 364', cat: 'Greca Dorada', price: 2.20 },
      { code: '383', name: 'Greca 383', cat: 'Greca Dorada', price: 2.50 },
      { code: '385', name: 'Greca 385', cat: 'Greca Dorada', price: 3.50 },
      { code: '387', name: 'Greca 387', cat: 'Greca Dorada', price: 4.50 },
      { code: '342-LP', name: 'Greca 342 L/P', cat: 'Greca Dorada', price: 25.00 },

      // FLECOS ACORDONADOS
      { code: '403', name: 'Fleco Acordonado 403 x 10m', cat: 'Fleco Seda', price: 19.90 },
      { code: '405', name: 'Fleco Acordonado 405 x 10m', cat: 'Fleco Seda', price: 25.50 },
      { code: '408', name: 'Fleco Acordonado 408 x 10m', cat: 'Fleco Seda', price: 37.00 },
      { code: '421', name: 'Fleco Acordonado 421 x 10m', cat: 'Fleco Seda', price: 41.50 },
      { code: '444', name: 'Fleco Acordonado 444 x 10m', cat: 'Fleco Seda', price: 24.50 },

      // FLECOS BANDERIN
      { code: '430-S', name: 'Fleco Banderin 430-S', cat: 'Fleco Banderin', price: 12.90 },
      { code: '430-S-LUR', name: 'Fleco Banderin 430-S Lurex', cat: 'Fleco Banderin', price: 13.50 },
      { code: '430-4-S', name: 'Fleco Banderin 430-4-S', cat: 'Fleco Banderin', price: 19.50 },
      { code: '430-2-P', name: 'Fleco Banderin 430-2-P', cat: 'Fleco Banderin', price: 10.90 },
      { code: '430-2-P-LUR', name: 'Fleco Banderin 430-2-P Lurex', cat: 'Fleco Banderin', price: 11.50 },
      { code: '430-4-P', name: 'Fleco Banderin 430-4-P', cat: 'Fleco Banderin', price: 12.90 },

      // FLECOS SHALL
      { code: '414', name: 'Fleco Shall 414 x 10m', cat: 'Fleco Shall', price: 19.90 },
      { code: '418', name: 'Fleco Shall 418 x 10m', cat: 'Fleco Shall', price: 35.90 },
      { code: '411', name: 'Fleco Shall 411 x 10m', cat: 'Fleco Shall', price: 41.90 },
      { code: '415', name: 'Fleco Shall 415 x 10m', cat: 'Fleco Shall', price: 75.90 },
      { code: '417', name: 'Fleco Shall 417 x 10m', cat: 'Fleco Shall', price: 95.90 },
      { code: 'CADENETA-100', name: 'Carrete Cadeneta 100gr (105)', cat: 'Fleco Shall', price: 25.00 },

      // FLECOS ALGODON
      { code: '490-C', name: 'Fleco Algodón 490 Crudo x 10m', cat: 'Fleco Algodón', price: 12.90 },
      { code: '490-B', name: 'Fleco Algodón 490 Blanco x 10m', cat: 'Fleco Algodón', price: 14.10 },
      { code: '491-C', name: 'Fleco Algodón 491 Crudo x 10m', cat: 'Fleco Algodón', price: 11.90 },
      { code: '491-B', name: 'Fleco Algodón 491 Blanco x 10m', cat: 'Fleco Algodón', price: 18.90 },
      { code: '492-C', name: 'Fleco Algodón 492 Crudo x 10m', cat: 'Fleco Algodón', price: 18.90 },
      { code: '492-B', name: 'Fleco Algodón 492 Blanco x 10m', cat: 'Fleco Algodón', price: 23.50 },
      { code: '493-C', name: 'Fleco Algodón 493 Crudo x 10m', cat: 'Fleco Algodón', price: 30.70 },
      { code: '493-B', name: 'Fleco Algodón 493 Blanco x 10m', cat: 'Fleco Algodón', price: 34.50 },
      { code: '494-C', name: 'Fleco Algodón 494 Crudo x 10m', cat: 'Fleco Algodón', price: 43.50 },
      { code: '494-B', name: 'Fleco Algodón 494 Blanco x 10m', cat: 'Fleco Algodón', price: 50.90 },

      // FLECOS POLY
      { code: '433', name: 'Fleco Poly 433 x 10m', cat: 'Fleco Poly', price: 12.50 },
      { code: '435', name: 'Fleco Poly 435 x 10m', cat: 'Fleco Poly', price: 18.50 },
      { code: '438', name: 'Fleco Poly 438 x 10m', cat: 'Fleco Poly', price: 25.90 },
      { code: '443', name: 'Fleco Poly 443 x 10m', cat: 'Fleco Poly', price: 19.00 },

      // FLECOS LUREX
      { code: '482-DP', name: 'Fleco 482 Lurex Dor/Plat x 10m', cat: 'Fleco Lurex', price: 11.50 },
      { code: '482-COL', name: 'Fleco 482 Lurex Color x 10m', cat: 'Fleco Lurex', price: 15.50 },
      { code: '483-DP', name: 'Fleco 483 Lurex Dor/Plat x 10m', cat: 'Fleco Lurex', price: 13.00 },
      { code: '483-COL', name: 'Fleco 483 Lurex Color x 10m', cat: 'Fleco Lurex', price: 17.00 },
      { code: '485-DP', name: 'Fleco 485 Lurex Dor/Plat x 10m', cat: 'Fleco Lurex', price: 17.00 },
      { code: '485-COL', name: 'Fleco 485 Lurex Color x 10m', cat: 'Fleco Lurex', price: 21.00 },
      { code: '487-DP', name: 'Fleco 487 Lurex Dor/Plat x 10m', cat: 'Fleco Lurex', price: 22.00 },
      { code: '487-COL', name: 'Fleco 487 Lurex Color x 10m', cat: 'Fleco Lurex', price: 26.00 },
      { code: '460', name: 'Fleco 460 Lurex x 10m', cat: 'Fleco Lurex', price: 21.00 },
      { code: '511-DP', name: 'Fleco 511 Lurex Dor/Plat x 10m', cat: 'Fleco Lurex', price: 32.00 },
      { code: '511-COL', name: 'Fleco 511 Lurex Color x 10m', cat: 'Fleco Lurex', price: 36.00 },

      // CINTAS RUFLETE
      { code: 'RUF-6-C', name: 'Ruflete 6 Pitas Crudo x Met', cat: 'Cinta', price: 4.80 },
      { code: 'RUF-6-B', name: 'Ruflete 6 Pitas Blanco x Met', cat: 'Cinta', price: 5.90 },
      { code: 'RUF-3-C', name: 'Ruflete 3 Pitas Crudo x Met', cat: 'Cinta', price: 2.90 },
      { code: 'RUF-3-B', name: 'Ruflete 3 Pitas Blanco x Met', cat: 'Cinta', price: 3.50 },

      // CENEFA PANAMINAS
      { code: 'PAN-ANG-C', name: 'Cenefa Angosta Crudo 5cm', cat: 'Cenefa', price: 3.90 },
      { code: 'PAN-ANG-B', name: 'Cenefa Angosta Blanco 5cm', cat: 'Cenefa', price: 4.90 },
      { code: 'PAN-ANC-C', name: 'Cenefa Ancha Crudo 6cm', cat: 'Cenefa', price: 4.70 },
      { code: 'PAN-ANC-B', name: 'Cenefa Ancha Blanco 6cm', cat: 'Cenefa', price: 5.80 },
      { code: 'PAN-ANCZ-C', name: 'Cenefa Anchaza Crudo 10cm', cat: 'Cenefa', price: 5.30 },
      { code: 'PAN-ANCZ-B', name: 'Cenefa Anchaza Blanco 10cm', cat: 'Cenefa', price: 7.90 },
      { code: 'PAN-ANGT-C', name: 'Cenefa Angostita Crudo 4cm', cat: 'Cenefa', price: 3.90 },
      { code: 'PAN-ANGT-B', name: 'Cenefa Angostita Blanco 4cm', cat: 'Cenefa', price: 4.90 },

      // ALZAPAÑOS & OTHERS
      { code: 'ALZ-LUREX', name: 'Alzapaño Lurex', cat: 'Alzapaño', price: 79.00 },
      { code: 'ALZ-TAM-1', name: 'Alzapaño Tamaño No 1 (Cord 12)', cat: 'Alzapaño', price: 86.50 },
      { code: 'ALZ-TAM-698', name: 'Alzapaño Tamaño No 698', cat: 'Alzapaño', price: 65.00 },
      { code: 'LLAVERO', name: 'Llavero', cat: 'Accesorio', price: 19.00 },
      { code: 'LLAVERITO', name: 'Llaverito', cat: 'Accesorio', price: 14.90 },
      { code: 'LLAVERITO-MINI', name: 'Mini Llaverito Movil', cat: 'Accesorio', price: 8.90 },
      { code: 'BOTON', name: 'Botón', cat: 'Accesorio', price: 19.50 },
      { code: 'BOTON-GR', name: 'Botón Grande', cat: 'Accesorio', price: 23.90 },
      { code: 'BOTON-SOLO', name: 'Botón Solo', cat: 'Accesorio', price: 14.90 },
      { code: 'PIÑA-698', name: 'Piña No 698 - Doble', cat: 'Accesorio', price: 109.90 },

      // CORDONES SEDA
      { code: '691-METRO', name: 'Cordón Seda 691 x Metro', cat: 'Cordón', price: 0.25 },
      { code: '692-10M', name: 'Cordón Seda 692 x 10m', cat: 'Cordón', price: 6.90 },
      { code: '692-PURA', name: 'Cordón Seda 692 Pura Seda 10m', cat: 'Cordón', price: 10.50 },
      { code: '692-ESP', name: 'Cordón Seda 692 Especial 10m', cat: 'Cordón', price: 8.90 },
      { code: '694-10M', name: 'Cordón Seda 694 x 10m', cat: 'Cordón', price: 15.00 },
      { code: '696-10M', name: 'Cordón Seda 696 x 10m', cat: 'Cordón', price: 20.00 },
      { code: '698-10M', name: 'Cordón Seda 698 x 10m', cat: 'Cordón', price: 28.00 },
      { code: '690-12', name: 'Cordón Seda 690-12 x Metro', cat: 'Cordón', price: 6.80 },

      // CORDONES POLY / LUREX / ALGODON
      { code: '674-10M', name: 'Cordón Poly 674 x 10m', cat: 'Cordón', price: 12.50 },
      { code: '676-10M', name: 'Cordón Poly 676 x 10m', cat: 'Cordón', price: 18.50 },
      { code: '678-20M', name: 'Cordón Poly 678 x 20m', cat: 'Cordón', price: 29.00 },
      { code: 'CUR-LUR-2', name: 'Cordón Lurex #2 x 10m', cat: 'Cordón', price: 6.50 },
      { code: '716-20-DP', name: 'Cordón Lurex 716 Dor/Pl x 20m', cat: 'Cordón', price: 37.00 },
      { code: '716-20-COL', name: 'Cordón Lurex 716 Col x 20m', cat: 'Cordón', price: 42.00 },
      { code: '716-18-DP', name: 'Cordón Lurex 716 Dor/Pl 18m', cat: 'Cordón', price: 30.00 },
      { code: '716-18-COL', name: 'Cordón Lurex 716 Col 18m', cat: 'Cordón', price: 35.00 },
      { code: 'ALG-8', name: 'Algodón #8 (Hábito) x 10m', cat: 'Cordón', price: 22.00 },
      { code: 'ALG-12', name: 'Algodón #12 (Hábito) x 10m', cat: 'Cordón', price: 26.00 },

      // SUPER SEDA / SESGO
      { code: 'FLE-SS-8', name: 'Fleco Super Seda 8cm x Met', cat: 'Fleco', price: 20.50 },
      { code: 'FLE-SS-11', name: 'Fleco Super Seda 11cm x Met', cat: 'Fleco', price: 22.50 },
      { code: 'FLE-SS-13', name: 'Fleco Super Seda 13cm x Met', cat: 'Fleco', price: 25.30 },
      { code: '353-2', name: 'Seda con Sesgo 353-2 x Metro', cat: 'Cordón', price: 1.70 },
      { code: '353-4', name: 'Seda con Sesgo 353-4 x Metro', cat: 'Cordón', price: 3.90 },
      { code: '353-6', name: 'Seda con Sesgo 353-6 x Metro', cat: 'Cordón', price: 4.60 },
      { code: '353-8', name: 'Seda con Sesgo 353-8 x Metro', cat: 'Cordón', price: 5.30 },
      { code: '353-12', name: 'Seda con Sesgo 353-12 x Metro', cat: 'Cordón', price: 7.90 },

      // PLUMILLA / POM POM / CINTA METAL
      { code: 'PLU-3000-DS', name: 'Plumilla 3000-4 D-S x Met', cat: 'Plumilla', price: 8.40 },
      { code: 'PLU-3000-DP', name: 'Plumilla 3000-4 D-P x Met', cat: 'Plumilla', price: 6.80 },
      { code: 'PLU-3000-S1', name: 'Plumilla 3000-4 Seda 1x1', cat: 'Plumilla', price: 18.50 },
      { code: 'POM-445-DS', name: 'Pom Pom 445 D-S x Metro', cat: 'Pom Pom', price: 7.60 },
      { code: 'POM-445-DP', name: 'Pom Pom 445 D-P x Metro', cat: 'Pom Pom', price: 5.60 },
      { code: '103', name: 'Cinta Metálica 103 x Metro', cat: 'Cinta', price: 3.50 },
      { code: '105', name: 'Cinta Metálica 105 x Metro', cat: 'Cinta', price: 4.00 },
      { code: '107', name: 'Cinta Metálica 107 x Metro', cat: 'Cinta', price: 5.00 },
    ];

    for (const item of catalog) {
      let product = await this.productRepo.findOneBy({ codigo_articulo: item.code });
      if (!product) {
        product = await this.productRepo.save({
          codigo_articulo: item.code,
          nombre: item.name,
          categoria: item.cat,
        });
      } else {
        product.nombre = item.name;
        product.categoria = item.cat;
        await this.productRepo.save(product);
      }

      // Upsert COPASA Price
      const copasaPrice = await this.priceRepo.findOneBy({
        producto: { id: product.id },
        tipo_lista: TipoLista.COPASA,
      });

      if (!copasaPrice) {
        await this.priceRepo.save({
          producto: product,
          tipo_lista: TipoLista.COPASA,
          valor_soles: item.price,
        });
      } else {
        copasaPrice.valor_soles = item.price;
        await this.priceRepo.save(copasaPrice);
      }

      // Upsert GENERAL Price (1.25 * Copasa)
      const generalPrice = await this.priceRepo.findOneBy({
        producto: { id: product.id },
        tipo_lista: TipoLista.GENERAL,
      });

      const generalVal = +(item.price * 1.25).toFixed(2);
      if (!generalPrice) {
        await this.priceRepo.save({
          producto: product,
          tipo_lista: TipoLista.GENERAL,
          valor_soles: generalVal,
        });
      } else {
        generalPrice.valor_soles = generalVal;
        await this.priceRepo.save(generalPrice);
      }
    }

    this.logger.log('Seeding complete');
  }
}
