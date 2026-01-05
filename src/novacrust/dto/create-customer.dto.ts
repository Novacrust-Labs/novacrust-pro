import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ description: 'The first name of the customer', example: 'John', required: false })
    first_name?: string;

    @ApiProperty({ description: 'The last name of the customer', example: 'Doe', required: false })
    last_name?: string;

    @ApiProperty({ description: 'The email address of the customer', example: 'john.doe@example.com', required: false })
    email_address?: string;

    @ApiProperty({ description: 'The phone number of the customer', example: '+2348123456789', required: false })
    phone_number?: string;
}
