import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GuiaVenta } from '../entities/guia-venta.entity';
import { DetalleGuia } from '../entities/detalle-guia.entity';
import { DetalleColor } from '../entities/detalle-color.entity';
import { Producto } from '../entities/producto.entity';
import { Precio, TipoLista } from '../entities/precio.entity';
import { Color } from '../entities/color.entity';

export class CreateGuiaDto {
  cliente_nombre: string;
  es_copasa: boolean;
  items: {
    productoId: number;
    cantidad: number;
    unidad?: string;
    colores: { colorId: number; cantidad: number }[];
  }[];
}

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(GuiaVenta)
    private guiaRepo: Repository<GuiaVenta>,
    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,
    @InjectRepository(Precio)
    private precioRepo: Repository<Precio>,
    @InjectRepository(Color)
    private colorRepo: Repository<Color>,
    private dataSource: DataSource,
  ) {}

  async createGuia(dto: CreateGuiaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const guia = new GuiaVenta();
      guia.cliente_nombre = dto.cliente_nombre;
      guia.es_copasa = dto.es_copasa;
      guia.detalles = [];
      let total = 0;

      for (const itemDto of dto.items) {
        // Validation: Sum check
        const sumColores = itemDto.colores.reduce((acc, curr) => acc + curr.cantidad, 0);
        if (sumColores !== itemDto.cantidad) {
          throw new BadRequestException(
            `Mismatch for Product ${itemDto.productoId}: Total ${itemDto.cantidad} != Sum ${sumColores}`,
          );
        }

        const producto = await this.productoRepo.findOneBy({ id: itemDto.productoId });
        if (!producto) throw new NotFoundException(`Product ${itemDto.productoId} not found`);

        const tipoLista = dto.es_copasa ? TipoLista.COPASA : TipoLista.GENERAL;
        const precioEntity = await this.precioRepo.findOneBy({
          producto: { id: itemDto.productoId },
          tipo_lista: tipoLista,
        });

        if (!precioEntity) {
           throw new BadRequestException(
            `Price not defined for Product ${itemDto.productoId} in list ${tipoLista}`,
          );
        }

        const detalle = new DetalleGuia();
        detalle.producto = producto;
        detalle.cantidad = itemDto.cantidad;
        detalle.unidad = itemDto.unidad || 'Piezas';
        detalle.precio_unitario = precioEntity.valor_soles;
        detalle.subtotal = detalle.cantidad * detalle.precio_unitario;
        detalle.colores = [];

        for (const colorDto of itemDto.colores) {
          const color = await this.colorRepo.findOneBy({ id: colorDto.colorId });
          if (!color) throw new NotFoundException(`Color ${colorDto.colorId} not found`);

          const detalleColor = new DetalleColor();
          detalleColor.color = color;
          detalleColor.cantidad = colorDto.cantidad;
          detalle.colores.push(detalleColor);
        }

        guia.detalles.push(detalle);
        total += detalle.subtotal;
      }

      guia.total_final = total;

      const savedGuia = await queryRunner.manager.save(guia);
      await queryRunner.commitTransaction();

      return savedGuia;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findNextNumber() {
    const lastGuia = await this.guiaRepo.findOne({
      where: {},
      order: { numero_guia: 'DESC' },
    });
    return (lastGuia?.numero_guia ?? 0) + 1;
  }

  async findAll() {
    return this.guiaRepo.find({
      relations: ['detalles', 'detalles.producto', 'detalles.colores', 'detalles.colores.color'],
    });
  }
}
