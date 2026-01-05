import { ApiProperty } from '@nestjs/swagger';

class WebhookUserDto {
    @ApiProperty({ example: 'f6e5d4c3-b2a1-4098-8765-432109876543' })
    id: string;

    @ApiProperty({ example: 'alice.wong@company.com' })
    email: string;

    @ApiProperty({ example: 'Alice' })
    first_name: string;

    @ApiProperty({ example: 'Wong' })
    last_name: string;
}

class WebhookWalletDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-47a8-8901-23456789abcd' })
    id: string;

    @ApiProperty({ example: '0x3f17f1962B36e491b30A40b2405849e597Ba5FB5' })
    deposit_address: string;

    @ApiProperty({ type: WebhookUserDto })
    user: WebhookUserDto;
}

export class DepositWebhookDto {
    @ApiProperty({ example: 'CRYPTO_FUNDING_SUCCESS' })
    event: string;

    @ApiProperty({ example: 'txn_01J9W8R2S3T4U5V6W7X8Y9Z0A' })
    transaction_reference: string;

    @ApiProperty({ example: 'usdt' })
    currency: string;

    @ApiProperty({ example: '1250.00' })
    amount: string;

    @ApiProperty({ example: '4.85' })
    fee: string;

    @ApiProperty({ example: 'trc20' })
    network: string;

    @ApiProperty({ example: '0x8e9f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6' })
    network_txid: string;

    @ApiProperty({ example: 'confirmed' })
    status: string;

    @ApiProperty({ type: WebhookWalletDto })
    wallet: WebhookWalletDto;

    @ApiProperty({ example: '2025-12-06T14:07:33.456Z' })
    timestamp: string;
}
