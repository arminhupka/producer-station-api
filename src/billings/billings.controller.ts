import { Controller } from '@nestjs/common';
import { BillingsService } from './billings.service';

@Controller('billings')
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) {}
}
