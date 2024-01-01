import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingsModule } from './billings/billings.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { ProductsModule } from './products/products.module';
import { LabelsModule } from './labels/labels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    MailModule,
    UsersModule,
    BillingsModule,
    AccountModule,
    ProductsModule,
    LabelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
