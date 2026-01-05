import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { NovacrustService } from './novacrust.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOffRampOrderDto } from './dto/create-offramp-order.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GenerateWalletDto } from './dto/generate-wallet.dto';
import { DepositWebhookDto } from './dto/deposit-webhook.dto';

@Controller('novacrust')
export class NovacrustController {
    constructor(private readonly novacrustService: NovacrustService) { }

    @ApiTags('General')
    @Get('chains')
    @ApiOperation({ summary: 'List available crypto chains for USDT/USDC' })
    async getChains() {
        return await this.novacrustService.getAvailableChains();
    }

    @ApiTags('General')
    @Get('currencies')
    @ApiOperation({ summary: 'List supported fiat currencies and country codes', description: 'Retrieve a list of supported fiat currencies and their corresponding country codes for payouts calculation.' })
    async getCurrencies() {
        return await this.novacrustService.getSupportedCurrencies();
    }

    @ApiTags('General')
    @Get('payout-methods')
    @ApiOperation({ summary: 'Get payout methods', description: 'Retrieve available payout methods for a country.' })
    @ApiQuery({ name: 'countryCode', required: true, description: 'Country code (e.g. NG)', example: 'NG' })
    async getPayoutMethods(@Query('countryCode') countryCode: string) {
        return await this.novacrustService.getPayoutMethods(countryCode);
    }

    @ApiTags('General')
    @Post('customer')
    @ApiOperation({
        summary: 'Create merchant customer',
        description: 'Create a new merchant customer. If first name, last name, email address, or phone number are not provided, they will be randomized.'
    })
    @ApiBody({ type: CreateCustomerDto })
    @ApiResponse({ status: 201, description: 'Customer successfully created.' })
    async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
        return await this.novacrustService.createCustomer(createCustomerDto);
    }

    @ApiTags('Off-ramp')
    @Post('off-ramp/order')
    @ApiOperation({
        summary: 'Create crypto-to-cash order',
        description: 'Initiate a request to sell cryptocurrency for cash. This involves specifies the crypto, network, payment source, and payout details.'
    })
    @ApiResponse({ status: 201, description: 'Order successfully initiated.' })
    async createOfframpOrder(@Body() createOrderDto: CreateOffRampOrderDto) {
        return await this.novacrustService.createOfframpOrder(createOrderDto);
    }

    @ApiTags('General')
    @Post('webhook/deposit')
    @ApiOperation({
        summary: 'Receive deposit details (Webhook)',
        description: 'Endpoint to receive real-time notifications about successful crypto funding/deposits. This is used to track incoming crypto payments and update user balances.'
    })
    @ApiBody({ type: DepositWebhookDto })
    @ApiResponse({ status: 200, description: 'Webhook acknowledged.' })
    async handleDepositWebhook(@Body() depositWebhookDto: DepositWebhookDto) {
        return await this.novacrustService.handleDepositWebhook(depositWebhookDto);
    }

    @ApiTags('Off-ramp')
    @Post('wallet/generate')
    @ApiOperation({
        summary: 'Generate crypto wallet',
        description: 'Generate a new crypto wallet address for a customer on a specific network. This is typically used to provide a deposit address for off-ramping.'
    })
    @ApiBody({ type: GenerateWalletDto })
    @ApiResponse({ status: 201, description: 'Wallet successfully generated.' })
    async generateWallet(@Body() generateWalletDto: GenerateWalletDto) {
        return await this.novacrustService.generateWallet(generateWalletDto);
    }

}
