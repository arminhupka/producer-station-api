import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Like, Repository } from 'typeorm';

import { Label } from '../labels/entity/label.entity';
import { LabelStatus } from '../labels/enum/label-status.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entity/product.entity';
import { ProductStatus } from './enum/product-status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async findByName(name: string) {
    const product = await this.productRepository.findOne({
      where: { name: Like(name) },
    });

    if (!product) {
      throw new NotFoundException(`Product ${name} not found`);
    }

    return product;
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(label: Label, name: string) {
    if (label.status !== LabelStatus.ACTIVE) {
      throw new ForbiddenException(
        `Label must be ${LabelStatus.ACTIVE} to create product`,
      );
    }

    const productWithName = await this.findByName(name).catch(() => {});

    if (productWithName) {
      throw new ConflictException(
        `Product ${productWithName.name} already exist`,
      );
    }

    const newProduct = this.productRepository.create({
      name,
      slug: slugify(name, { lower: true }),
      label,
    });

    return this.productRepository.save(newProduct);
  }

  async delete(id: string) {
    const product = await this.findById(id);
    await this.productRepository.remove(product);
    return {
      ...product,
      id,
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findById(id);

    product.name = dto.name ?? product.name;
    product.price = dto.price ?? product.price;
    product.salePrice = dto.salePrice ?? product.salePrice;
    product.status = dto.status ?? product.status;
    product.description = dto.description ?? product.description;
    product.shortDescription = dto.shortDescription ?? product.shortDescription;

    if (dto.status === ProductStatus.SUBMITTED) {
      product.submittedAt = new Date();
    }

    if (dto.price === null) {
      product.price = null;
    }

    if (dto.salePrice === null) {
      product.salePrice = null;
    }

    return this.productRepository.save(product);
  }
}
