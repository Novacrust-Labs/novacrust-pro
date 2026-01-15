import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waitlist } from '../database/entities/waitlist.entity.js';
import { WaitlistService } from './waitlist.service.js';
import { WaitlistController } from './waitlist.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature([Waitlist])],
    controllers: [WaitlistController],
    providers: [WaitlistService],
})
export class WaitlistModule { }
