import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as https from 'https';
import { CreateOffRampOrderDto } from './dto/create-offramp-order.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GenerateWalletDto } from './dto/generate-wallet.dto';
import { DepositWebhookDto } from './dto/deposit-webhook.dto';

@Injectable()
export class NovacrustService {
    private readonly logger = new Logger(NovacrustService.name);
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly httpsAgent = new https.Agent({
        rejectUnauthorized: false, // Fix for SSL issues in some environments
    });

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('NOVACRUST_API_URL')!;
        this.apiKey = this.configService.get<string>('NOVACRUST_API_KEY')!;
        this.logger.log(`NovacrustService initialized with baseUrl: ${this.baseUrl}`);
    }

    async getAvailableChains() {
        try {
            const url = `${this.baseUrl}/business/open/crypto/networks`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                httpsAgent: this.httpsAgent,
            });
            return response.data;
        } catch (error) {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || error.message;
            this.logger.error(`Error fetching chains: ${message}`);
            throw new HttpException(message, status);
        }
    }

    async getPayoutMethods(countryCode: string) {
        try {
            const url = `${this.baseUrl}/business/open/payout_methods?country_code=${countryCode}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                httpsAgent: this.httpsAgent,
            });
            return response.data;
        } catch (error) {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || error.message;
            this.logger.error(`Error fetching payout methods: ${message}`);
            throw new HttpException(message, status);
        }
    }


    async getSupportedCurrencies() {
        return {
            success: true,
            data: [
                { currency: 'NGN', countryCode: 'NG' },
                { currency: 'KES', countryCode: 'KE' },
                { currency: 'GHS', countryCode: 'GH' },
                { currency: 'ZAR', countryCode: 'ZA' },
            ],
            message: 'Supported currencies retrieved successfully'
        };
    }

    async createOfframpOrder(data: CreateOffRampOrderDto) {
        this.logger.log(`Mock: Creating order with data: ${JSON.stringify(data)}`);
        // Mocking the response as requested
        return {
            success: true,
            message: 'Order created successfully (Mock)',
            data: {
                orderId: `NC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'pending',
                ...data,
                createdAt: new Date().toISOString(),
            }
        };
    }

    async createCustomer(data: CreateCustomerDto) {
        const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

        const firstName = data.first_name || firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = data.last_name || lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = data.email_address || `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;
        const phone = data.phone_number || `+234${Math.floor(1000000000 + Math.random() * 9000000000)}`;

        const customer = {
            id: `CUST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            first_name: firstName,
            last_name: lastName,
            email_address: email,
            phone_number: phone,
            createdAt: new Date().toISOString(),
        };

        this.logger.log(`Mock: Created customer: ${JSON.stringify(customer)}`);

        return {
            success: true,
            message: 'Customer created successfully (Mock)',
            data: customer
        };
    }
    async generateWallet(data: GenerateWalletDto) {
        try {
            const url = `${this.baseUrl}/business/open/crypto/wallet`;
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                httpsAgent: this.httpsAgent,
            });
            return response.data;
        } catch (error) {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || error.message;
            this.logger.error(`Error generating wallet: ${message}`);
            throw new HttpException(message, status);
        }
    }
    async processPayout(depositId: string) { return { data: {} }; }

    async createBeneficiary(data: any) {
        try {
            const url = `${this.baseUrl}/business/open/beneficiary`;
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                httpsAgent: this.httpsAgent,
            });
            return response.data;
        } catch (error) {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || error.message;
            this.logger.error(`Error creating beneficiary: ${message}`);
            throw new HttpException(message, status);
        }
    }

    async initiatePayout(data: any) {
        try {
            const url = `${this.baseUrl}/business/open/payouts`;
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                httpsAgent: this.httpsAgent,
            });
            return response.data;
        } catch (error) {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || error.message;
            this.logger.error(`Error initiating payout: ${message}`);
            throw new HttpException(message, status);
        }
    }

    async handleDepositWebhook(data: DepositWebhookDto) {
        this.logger.log(`Received deposit webhook: ${JSON.stringify(data)}`);

        // 1. Create Beneficiary (Mocking metadata extraction for now)
        // In a real scenario, you'd fetch the order details associated with the wallet/user
        const beneficiaryData = {
            currency: 'ngn', // Defaulting to NGN for now as per example
            metadata: {
                name: `${data.wallet.user.first_name} ${data.wallet.user.last_name}`,
                account_number: '01000000010', // Placeholder
                bank_code: '066' // Placeholder
            },
            payout_method_id: 'aff4b3da-fd7b-4202-b490-bda42e845173' // Mock UUID
        };

        const beneficiaryResponse = await this.createBeneficiary(beneficiaryData);
        const beneficiaryId = beneficiaryResponse?.data?.id || 'MOCK_BENEFICIARY_ID';

        // 2. Initiate Payout
        const payoutData = {
            currency: 'ngn',
            beneficiary_id: beneficiaryId,
            payout_method_id: 'aff4b3da-fd7b-4202-b490-bda42e845173', // Mock UUID
            amount: data.amount, // Using the amount from the webhook
            description: 'Order Payout',
            reference: data.transaction_reference
        };

        const payoutResponse = await this.initiatePayout(payoutData);

        return {
            success: true,
            message: 'Webhook processed and payout initiated',
            data: {
                event: data.event,
                transaction_reference: data.transaction_reference,
                beneficiary_id: beneficiaryId,
                payout_id: payoutResponse?.data?.id || 'MOCK_PAYOUT_ID',
                timestamp: new Date().toISOString()
            }
        };
    }
}
