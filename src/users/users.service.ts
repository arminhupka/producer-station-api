import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';

import { BillingsService } from '../billings/billings.service';
import { hashPassword } from '../libs/bcrypt';
import { randomToken } from '../libs/randomToken';
import { MailService } from '../mail/mail.service';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    private billingsService: BillingsService,
    private mailService: MailService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: Like(email),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: Like(username),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        billing: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(
    email: string,
    username: string,
    password: string,
    passwordConfirm: string,
  ) {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords are not equal');
    }

    const userWithEmail = await this.findByEmail(email).catch(() => {});

    if (userWithEmail) {
      throw new ConflictException(`Email ${email} is already registered`);
    }

    const userWithUsername = await this.findByUsername(email).catch(() => {});

    if (userWithUsername) {
      throw new ConflictException(`Username ${username} is already registered`);
    }

    const hashedPassword = await hashPassword(password);
    const activationToken = randomToken(32);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedUser: User | null = null;

    try {
      const newBilling = await this.billingsService.create(queryRunner);

      const newUser = this.userRepository.create({
        email,
        username,
        password: hashedPassword,
        activationToken,
        billing: newBilling,
      });

      savedUser = await queryRunner.manager.save(User, newUser);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }

    return savedUser;
  }

  async activateAccount(activationToken: string) {
    const userWithToken = await this.userRepository.findOne({
      where: {
        activationToken,
      },
    });

    if (!userWithToken) {
      throw new NotFoundException('Invalid or used token');
    }

    userWithToken.activationToken = null;
    userWithToken.activated = true;
    await this.userRepository.save(userWithToken);

    await this.mailService.sendAccountActivationConfirm(userWithToken.email);

    return userWithToken;
  }

  async requestResetPasswordToken(email: string) {
    const user = await this.findByEmail(email);
    user.resetPasswordToken = randomToken(32);
    await this.userRepository.save(user);
    await this.mailService.sendRequestResetPasswordToken(
      user.email,
      user.resetPasswordToken,
    );

    return user;
  }

  async changePasswordWithResetToken(
    token: string,
    password: string,
    passwordConfirm: string,
  ) {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords are not equal');
    }

    const userWithToken = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    const user = await this.findById(userWithToken.id);

    user.password = await hashPassword(password);
    user.resetPasswordToken = null;

    return this.userRepository.save(user);
  }

  async delete(uuid: string) {
    const user = await this.findById(uuid);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.billingsService.delete(user.billing.id);
      await queryRunner.manager.remove(User, user);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }

    await this.mailService.sendDeleteAccountConfirm(user.email);

    return user;
  }
}
