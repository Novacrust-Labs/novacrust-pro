import { ApiProperty } from '@nestjs/swagger';

export enum PaymentFrom {
    EXTERNAL_WALLET = 'external_wallet',
    METAMASK = 'metamask',
    WALLETCONNECT = 'walletconnect',
}

export class CreateOffRampOrderDto {
    @ApiProperty({ description: 'The cryptocurrency to sell (e.g., USDT, USDC)', example: 'USDT' })
    crypto: string;

    @ApiProperty({ description: 'The network the crypto is on (e.g., ETH, BSC, LISK)', example: 'ETH' })
    network: string;

    @ApiProperty({ description: 'The crypto network ID (UUID)', example: 'aff4b3da-fd7b-4202-b490-bda42e845173', required: false })
    crypto_network_id?: string;

    @ApiProperty({ description: 'The amount of crypto to sell', example: '100.00' })
    crypto_amount: string;

    @ApiProperty({ description: 'The crypto address to receive funds (if applicable)', example: '0x123...', required: false })
    crypto_address?: string;

    @ApiProperty({
        description: 'The source of the payment',
        enum: PaymentFrom,
        example: PaymentFrom.EXTERNAL_WALLET
    })
    payment_from: PaymentFrom;

    @ApiProperty({ description: 'The currency to receive (e.g., NGN, KES)', example: 'NGN' })
    payout_currency: string;

    @ApiProperty({ description: 'The country for the payout (e.g., NG, KE)', example: 'NG' })
    payout_country: string;

    @ApiProperty({ description: 'The method of payout (e.g., bank_transfer)', example: 'bank_transfer' })
    payout_method: string;

    @ApiProperty({ description: 'The value to be paid out in fiat', example: '150000.00' })
    payout_value: string;

    @ApiProperty({
        description: 'Additional metadata for the payout method (e.g., account number, bank code)',
        example: { account_number: '1234567890', bank_code: '058' }
    })
    payout_method_metadata: Record<string, any>;

    @ApiProperty({ description: 'Recipient email address', example: 'recipient@example.com' })
    recipient_email_address: string;

    @ApiProperty({ description: 'Recipient phone number', example: '+2348123456789' })
    recipient_phone_number: string;

    @ApiProperty({ description: 'The merchant customer ID', example: 'CUST-123456', required: false })
    merchant_customer_id?: string;

    @ApiProperty({ description: 'The payment method ID (UUID)', example: 'aff4b3da-fd7b-4202-b490-bda42e845173', required: false })
    payment_method_id?: string;
}
