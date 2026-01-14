import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NovacrustModule } from './novacrust/novacrust.module.js';
import { Customer } from './database/entities/customer.entity.js';
import { Wallet } from './database/entities/wallet.entity.js';
import { Order } from './database/entities/order.entity.js';
import { Deposit } from './database/entities/deposit.entity.js';
import { Payout } from './database/entities/payout.entity.js';
import { MailModule } from './mail/mail.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Customer, Wallet, Order, Deposit, Payout],
        synchronize: true, // WARNING: Set to false in production
        logging: true,
      }),
      inject: [ConfigService],
    }),
    NovacrustModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
