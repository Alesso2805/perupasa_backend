import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity';
import { ColumnNumericTransformer } from '../utils/typeorm-transformers';

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

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  valor_soles: number;

  @ManyToOne(() => Producto, (producto) => producto.precios)
  producto: Producto;
}
