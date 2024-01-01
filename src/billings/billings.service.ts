import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { Billing } from './entity/billing.entity';

@Injectable()
export class BillingsService {
  constructor(
    @InjectRepository(Billing) private billingRepository: Repository<Billing>,
  ) {}

  async findById(id: string) {
    const billing = await this.billingRepository.findOne({
      where: {
        id,
      },
    });

    if (!billing) {
      throw new NotFoundException('Billing not found');
    }

    return billing;
  }

  async create(queryRunner?: QueryRunner) {
    const newBilling = this.billingRepository.create();

    if (queryRunner) {
      return queryRunner.manager.save(Billing, newBilling);
    }

    return this.billingRepository.save(newBilling);
  }

  async delete(id: string, queryRunner?: QueryRunner) {
    const billing = await this.findById(id);

    if (queryRunner) {
      return queryRunner.manager.remove(Billing, billing);
    }

    return this.billingRepository.remove(billing);
  }
}
