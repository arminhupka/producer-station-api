import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { LabelsService } from '../labels/labels.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly labelsService: LabelsService,
  ) {}

  @Post('/')
  async create(@Body() dto: CreateProductDto) {
    const label = await this.labelsService.findById(dto.label);
    return this.productsService.create(label, dto.name);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch('/:id')
  async update(@Body() dto: UpdateProductDto, @Param('id') id: string) {
    return this.productsService.update(id, dto);
  }
}
