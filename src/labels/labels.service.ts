import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Like, Repository } from 'typeorm';

import { MailService } from '../mail/mail.service';
import { User } from '../users/entity/user.entity';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entity/label.entity';
import { LabelStatus } from './enum/label-status.enum';

@Injectable()
export class LabelsService {
  constructor(
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(Label) private labelRepository: Repository<Label>,
  ) {}

  async findByName(name: string) {
    const label = await this.labelRepository.findOne({
      where: {
        name: Like(name),
      },
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return label;
  }

  async findById(id: string) {
    const label = await this.labelRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return label;
  }

  async create(user: User, name: string) {
    const labelWithName = await this.findByName(name).catch(() => {});

    if (labelWithName) {
      throw new ConflictException(`Label ${labelWithName.name} already exist`);
    }

    const newLabel = this.labelRepository.create({
      name: name.trim(),
      commissionRate: +this.configService.get<string>(
        'APP_DEFAULT_COMMISSION_RATE',
      ),
      user,
      slug: slugify(name, { lower: true }),
      status: LabelStatus.DRAFT,
    });

    await this.labelRepository.save(newLabel);

    await this.mailService.sendNewLabelNotification(newLabel.name);

    return newLabel;
  }

  async delete(id: string) {
    const label = await this.findById(id);
    await this.labelRepository.remove(label);

    return {
      ...label,
      id,
    };
  }

  async update(id: string, dto: UpdateLabelDto) {
    const label = await this.findById(id);

    label.name = dto.name ?? label.name;
    label.status = dto.status ?? label.status;

    if (dto.status === LabelStatus.ACTIVE) {
      await this.mailService.sendLabelActivatedNotification(
        label.user.email,
        label.name,
      );
    }

    if (dto.status === LabelStatus.SUSPENDED) {
      await this.mailService.sendLabelSuspendedNotification(
        label.user.email,
        label.name,
      );
    }

    return this.labelRepository.save(label);
  }
}
