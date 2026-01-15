import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WaitlistService } from './waitlist.service.js';
import { JoinWaitlistDto } from './dto/join-waitlist.dto.js';

@ApiTags('Waitlist')
@Controller('waitlist')
export class WaitlistController {
    constructor(private readonly waitlistService: WaitlistService) { }

    @Post('join')
    @ApiOperation({ summary: 'Join waitlist', description: 'Register interest for upcoming features.' })
    @ApiResponse({ status: 201, description: 'Successfully joined waitlist.' })
    @ApiResponse({ status: 409, description: 'Already on the waitlist.' })
    async join(@Body() joinWaitlistDto: JoinWaitlistDto) {
        return await this.waitlistService.join(joinWaitlistDto);
    }
}
