import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity';

export enum TipoLista {
  GENERAL = 'GENERAL',
  COPASA = 'COPASA',
}

@Entity()
export class Precio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TipoLista,
    default: TipoLista.GENERAL,
  })
  tipo_lista: TipoLista;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_soles: number;

  @ManyToOne(() => Producto, (producto) => producto.precios)
  producto: Producto;
}
