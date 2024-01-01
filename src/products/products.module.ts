import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabelsModule } from '../labels/labels.module';
import { Product } from './entity/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), LabelsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
