import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelsService } from './labels.service';

@Controller('labels')
export class LabelsController {
  constructor(
    private readonly labelsService: LabelsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/')
  async create(@Body() { name }: CreateLabelDto) {
    const user = await this.usersService.findById(
      'e75e460f-60f0-4e60-9d89-153c6715fc3a',
    );
    return this.labelsService.create(user, name);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLabelDto) {
    return this.labelsService.update(id, dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.labelsService.delete(id);
  }
}
