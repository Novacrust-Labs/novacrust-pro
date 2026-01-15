import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum WaitlistInterest {
    CASH_TO_CRYPTO = 'cash-to-crypto',
    CRYPTO_TO_FIAT_LOAN = 'crypto-to-fiat-loan',
}

export class JoinWaitlistDto {
    @ApiProperty({ example: 'Goodness', description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ example: 'goodness@example.com', description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'cash-to-crypto',
        description: 'Area of interest',
        enum: WaitlistInterest
    })
    @IsEnum(WaitlistInterest)
    @IsNotEmpty()
    interest: WaitlistInterest;
}
