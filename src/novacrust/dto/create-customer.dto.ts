import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ description: 'The first name of the customer', example: 'John', required: false })
    first_name?: string;

    @ApiProperty({ description: 'The last name of the customer', example: 'Doe', required: false })
    last_name?: string;

    @ApiProperty({ description: 'The email address of the customer', example: 'john.doe@example.com', required: false })
    email_address?: string;

    @ApiProperty({ description: 'The email address of the customer', example: 'john.doe@example.com', required: false })
    email?: string;

    @ApiProperty({ description: 'The phone number of the customer', example: '+2348123456789', required: false })
    phone_number?: string;

    @ApiProperty({ description: 'Country code', example: 'NG', required: false })
    country?: string;

    @ApiProperty({ description: 'Customer type', example: 'INDIVIDUAL', required: false })
    customer_type?: string;

    @ApiProperty({ description: 'Address', example: '123 Main St', required: false })
    address?: string;

    @ApiProperty({ description: 'Postal code', example: '100001', required: false })
    postal_code?: string;

    @ApiProperty({ description: 'State', example: 'Lagos', required: false })
    state?: string;

    @ApiProperty({ description: 'City', example: 'Ikeja', required: false })
    city?: string;

    @ApiProperty({ description: 'Metadata for KYC', example: { id_type: 'NIN' }, required: false })
    kyc_metadata?: any;
}
