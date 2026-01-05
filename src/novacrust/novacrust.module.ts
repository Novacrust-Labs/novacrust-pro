import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NovacrustService } from './novacrust.service';
import { NovacrustController } from './novacrust.controller';

@Module({
    imports: [ConfigModule],
    providers: [NovacrustService],
    controllers: [NovacrustController],
    exports: [NovacrustService],
})
export class NovacrustModule { }
