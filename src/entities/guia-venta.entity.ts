import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { DetalleGuia } from './detalle-guia.entity';
import { ColumnNumericTransformer } from '../utils/typeorm-transformers';

@Entity()
export class GuiaVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ generated: 'increment', unique: true })
  numero_guia: number;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  cliente_nombre: string;

  @Column({ default: false })
  es_copasa: boolean;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  total_final: number;

  @OneToMany(() => DetalleGuia, (detalle) => detalle.guiaVenta, { cascade: true })
  detalles: DetalleGuia[];
}
