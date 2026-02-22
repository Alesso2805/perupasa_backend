import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { DetalleGuia } from './detalle-guia.entity';

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

  @Column('decimal', { precision: 10, scale: 2 })
  total_final: number;

  @OneToMany(() => DetalleGuia, (detalle) => detalle.guiaVenta, { cascade: true })
  detalles: DetalleGuia[];
}
