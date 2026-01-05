import { ApiProperty } from '@nestjs/swagger';

export class GenerateWalletDto {
    @ApiProperty({ description: 'The customer ID', example: 'CUST-123456' })
    customer_id: string;

    @ApiProperty({ description: 'The network ID or name', example: 'aff4b3da-fd7b-4202-b490-bda42e845173' })
    network_id: string;
}
