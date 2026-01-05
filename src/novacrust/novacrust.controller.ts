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
    @ApiOperation({ summary: 'List supported fiat currencies', description: 'Retrieve a list of supported fiat currencies for payouts calculation.' })
    async getCurrencies() {
        return await this.novacrustService.getSupportedCurrencies();
    }

    @Get('payout-methods')
    @ApiOperation({ summary: 'Get payout methods', description: 'Retrieve available payout methods for a currency.' })
    @ApiQuery({ name: 'currency', required: true, description: 'Currency code (e.g. NGN)', example: 'NGN' })
    async getPayoutMethods(@Query('currency') currency: string) {
        return await this.novacrustService.getPayoutMethods(currency);
    }

    @Get('payout-metadata')
    @ApiOperation({ summary: 'Get payout method metadata', description: 'Retrieve required fields for a specific payout method.' })
    @ApiQuery({ name: 'currency', required: true, description: 'Currency code (e.g. NGN)', example: 'NGN' })
    @ApiQuery({ name: 'method', required: true, description: 'Payment method (e.g. bank_transfer)', example: 'bank_transfer' })
    async getPayoutMetadata(
        @Query('currency') currency: string,
        @Query('method') method: string,
    ) {
        return await this.novacrustService.getPayoutMethodMetadata(currency, method);
    }
}
