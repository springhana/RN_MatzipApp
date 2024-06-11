import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarkerColor } from './marker-color.enum';
import { ColumlnNumbericTransformer } from 'src/@common/transformers/numeric.transformer';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    transformer: new ColumlnNumbericTransformer(),
  })
  latitude: number;

  @Column({
    type: 'decimal',
    transformer: new ColumlnNumbericTransformer(),
  })
  longitude: number;

  @Column()
  color: MarkerColor;

  @Column()
  address: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column()
  score: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}