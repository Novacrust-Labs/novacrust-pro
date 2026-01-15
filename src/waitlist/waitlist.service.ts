import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Waitlist } from '../database/entities/waitlist.entity.js';
import { JoinWaitlistDto } from './dto/join-waitlist.dto.js';

@Injectable()
export class WaitlistService {
    private readonly logger = new Logger(WaitlistService.name);

    constructor(
        @InjectRepository(Waitlist)
        private waitlistRepository: Repository<Waitlist>,
    ) { }

    async join(data: JoinWaitlistDto) {
        try {
            // Check if email already exists in waitlist (optional, but good practice)
            const existing = await this.waitlistRepository.findOne({ where: { email: data.email, interest: data.interest } });
            if (existing) {
                throw new ConflictException('You are already on the waitlist for this interest');
            }

            const entry = this.waitlistRepository.create(data);
            await this.waitlistRepository.save(entry);

            return {
                success: true,
                message: 'Successfully joined the waitlist',
            };
        } catch (error) {
            this.logger.error(`Error joining waitlist: ${error.message}`);
            throw error;
        }
    }
}
