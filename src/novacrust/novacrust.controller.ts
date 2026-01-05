import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { NovacrustService } from './novacrust.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('General')
@Controller('novacrust')
export class NovacrustController {
    constructor(private readonly novacrustService: NovacrustService) { }

    @Get('chains')
    @ApiOperation({ summary: 'List available crypto chains for USDT/USDC' })
    async getChains() {
        return await this.novacrustService.getAvailableChains();
    }

    @Get('currencies')
    @ApiOperation({ summary: 'List supported fiat currencies and country codes', description: 'Retrieve a list of supported fiat currencies and their corresponding country codes for payouts calculation.' })
    async getCurrencies() {
        return await this.novacrustService.getSupportedCurrencies();
    }

    @Get('payout-methods')
    @ApiOperation({ summary: 'Get payout methods', description: 'Retrieve available payout methods for a country.' })
    @ApiQuery({ name: 'countryCode', required: true, description: 'Country code (e.g. NG)', example: 'NG' })
    async getPayoutMethods(@Query('countryCode') countryCode: string) {
        return await this.novacrustService.getPayoutMethods(countryCode);
    }

}
