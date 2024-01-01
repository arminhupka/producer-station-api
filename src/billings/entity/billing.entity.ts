import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Billing {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  @Expose()
  id: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  firstName: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  lastName: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  street: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  postCode: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  city: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  country: string;

  @CreateDateColumn()
  @ApiProperty()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
