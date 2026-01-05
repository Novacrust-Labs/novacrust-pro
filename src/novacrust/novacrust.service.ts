import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as https from 'https';

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

    async createCustomer(data: any) { return { data: {} }; }
    async generateWallet(chainId: string, customerId: string) { return { data: {} }; }
    async processPayout(depositId: string) { return { data: {} }; }
}
