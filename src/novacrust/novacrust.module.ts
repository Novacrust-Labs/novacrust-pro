import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NovacrustService } from './novacrust.service.js';
import { NovacrustController } from './novacrust.controller.js';
import { Customer } from '../database/entities/customer.entity.js';
import { Wallet } from '../database/entities/wallet.entity.js';
import { Order } from '../database/entities/order.entity.js';
import { Deposit } from '../database/entities/deposit.entity.js';
import { Payout } from '../database/entities/payout.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Customer, Wallet, Order, Deposit, Payout]),
        ConfigModule
    ],
    providers: [NovacrustService],
    controllers: [NovacrustController],
    exports: [NovacrustService],
})
export class NovacrustModule { }
