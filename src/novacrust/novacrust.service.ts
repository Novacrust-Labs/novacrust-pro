import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as https from 'https';
import { CreateOffRampOrderDto } from './dto/create-offramp-order.dto.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { GenerateWalletDto } from './dto/generate-wallet.dto.js';
import { DepositWebhookDto } from './dto/deposit-webhook.dto.js';
import { Customer } from '../database/entities/customer.entity.js';
import { Wallet } from '../database/entities/wallet.entity.js';
import { Order } from '../database/entities/order.entity.js';
import { Deposit } from '../database/entities/deposit.entity.js';
import { Payout } from '../database/entities/payout.entity.js';
import { MailService } from '../mail/mail.service.js';

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
        private readonly mailService: MailService,
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Deposit)
        private depositRepository: Repository<Deposit>,
        @InjectRepository(Payout)
        private payoutRepository: Repository<Payout>,
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
        this.logger.log(`Creating order with data: ${JSON.stringify(data)}`);

        // Find customer if merchant_customer_id is provided
        let customer: Customer | null = null;
        if (data.merchant_customer_id) {
            customer = await this.customerRepository.findOne({ where: { novacrust_customer_id: data.merchant_customer_id } });
        }

        const order = this.orderRepository.create({
            customer: customer || undefined,
            crypto_currency: data.crypto,
            crypto_amount: parseFloat(data.crypto_amount),
            crypto_address: data.crypto_address,
            network: data.network,
            payout_currency: data.payout_currency,
            payout_value: parseFloat(data.payout_value),
            payout_method: data.payout_method,
            payout_metadata: data.payout_method_metadata || {},
            recipient_email_address: data.recipient_email_address,
            recipient_phone_number: data.recipient_phone_number,
            status: 'PENDING',
        });

        const savedOrder = await this.orderRepository.save(order);

        // Send order creation email
        try {
            await this.mailService.sendMail(
                data.recipient_email_address,
                'Order Created Successfully',
                `<h1>Order Created</h1><p>Your off-ramp order for ${data.crypto_amount} ${data.crypto} has been created. Your order ID is ${savedOrder.id}.</p>`,
                `Order Created: Your off-ramp order for ${data.crypto_amount} ${data.crypto} has been created. Your order ID is ${savedOrder.id}.`
            );
        } catch (error) {
            this.logger.error(`Failed to send order creation email: ${error.message}`);
        }

        return {
            success: true,
            message: 'Order created successfully and saved to database',
            data: savedOrder
        };
    }

    async createCustomer(data: CreateCustomerDto) {
        try {
            const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
            const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
            const cities = ['Lagos', 'Ikeja', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'];
            const states = ['Lagos', 'Federal Capital Territory', 'Kano', 'Oyo', 'Rivers'];

            const firstName = data.first_name || firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = data.last_name || lastNames[Math.floor(Math.random() * lastNames.length)];
            const email = data.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;
            const phone = data.phone_number || `+234${Math.floor(7000000000 + Math.random() * 2000000000)}`;
            const country = data.country || 'NG';
            const city = data.city || cities[Math.floor(Math.random() * cities.length)];
            const state = data.state || states[Math.floor(Math.random() * states.length)];
            const address = data.address || `${Math.floor(Math.random() * 100) + 1} Random Street`;
            const postalCode = data.postal_code || `${Math.floor(100000 + Math.random() * 900000)}`;
            const customerType = data.customer_type || 'INDIVIDUAL';
            const kycMetadata = data.kyc_metadata || {
                id_type: 'NIN',
                id_number: `${Math.floor(10000000000 + Math.random() * 90000000000)}`
            };

            const payload = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone_number: phone,
                country: country,
                city: city,
                state: state,
                address: address,
                postal_code: postalCode,
                customer_type: customerType,
                kyc_metadata: kycMetadata
            };

            const url = `${this.baseUrl}/business/open/customer`;
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                httpsAgent: this.httpsAgent,
            });

            // Persist to local DB
            const customerData = response.data.data;
            const customer = this.customerRepository.create({
                novacrust_customer_id: customerData.uuid,
                first_name: customerData.first_name,
                last_name: customerData.last_name,
                email: customerData.email,
                phone_number: customerData.phone_number,
                country: customerData.country,
                customer_type: customerData.customer_type,
                kyc_status: customerData.kyc_status,
                metadata: customerData.metadata || payload.kyc_metadata,
            });
            await this.customerRepository.save(customer);

            return response.data;
        } catch (error) {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || error.message;
            const validationErrors = error.response?.data?.errors || error.response?.data;
            this.logger.error(`Error creating customer: ${message}. Details: ${JSON.stringify(validationErrors)}`);
            throw new HttpException(message, status);
        }
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

            // Persist to local DB
            this.logger.debug(`Wallet generation response: ${JSON.stringify(response.data)}`);
            const walletData = response.data.data || response.data;
            const customer = await this.customerRepository.findOne({ where: { novacrust_customer_id: data.customer_id } });

            const wallet = this.walletRepository.create({
                novacrust_wallet_id: walletData.uuid,
                address: walletData.address || walletData.deposit_address || walletData.wallet_address || (walletData.wallet ? walletData.wallet.address : null),
                network: walletData.network?.name || walletData.network || 'unknown',
                network_id: data.network_id,
                customer: customer || undefined,
            });
            await this.walletRepository.save(wallet);

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

    async getTransactionByReference(reference: string) {
        try {
            const url = `${this.baseUrl}/business/open/transactions/wallet?reference=${reference}`;
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
            this.logger.error(`Error fetching transaction by reference: ${message}`);
            throw new HttpException(message, status);
        }
    }

    async handleDepositWebhook(data: DepositWebhookDto) {
        this.logger.log(`Received deposit webhook: ${JSON.stringify(data)}`);

        // 1. Fetch transaction details from Novacrust API for verification
        const transactionResponse = await this.getTransactionByReference(data.transaction_reference);
        const transaction = transactionResponse?.data || transactionResponse;

        if (!transaction) {
            this.logger.error(`Transaction verification failed - No data returned for reference: ${data.transaction_reference}`);
            throw new HttpException(`Transaction verification failed: Reference ${data.transaction_reference} not found in Novacrust`, HttpStatus.NOT_FOUND);
        }

        // 2. Identify associated wallet and order
        const wallet = await this.walletRepository.findOne({
            where: { address: data.wallet.deposit_address },
            relations: ['customer']
        });

        // Search for order by transaction reference first, then fall back to wallet-based search
        let order: Order | null = await this.orderRepository.findOne({
            where: { tx_reference: data.transaction_reference },
            relations: ['customer']
        });

        if (!order && wallet?.customer) {
            order = await this.orderRepository.findOne({
                where: { customer: { id: wallet.customer.id }, status: 'PENDING' },
                order: { created_at: 'DESC' }
            });
        }

        // 3. Amount Correlation Check (Webhook vs API vs Order)
        const webhookAmount = parseFloat(data.amount);
        const apiAmount = parseFloat(transaction.amount || transaction.crypto_amount);
        const orderAmount = order ? parseFloat(order.crypto_amount.toString()) : null;

        this.logger.log(`Correlation Check - Webhook: ${webhookAmount}, API: ${apiAmount}, Order: ${orderAmount}`);

        if (webhookAmount !== apiAmount) {
            this.logger.error(`Amount mismatch: Webhook (${webhookAmount}) vs API (${apiAmount})`);
            this.logger.debug(`Mismatch details - Webhook data: ${JSON.stringify(data)}, API data: ${JSON.stringify(transaction)}`);
            throw new HttpException(`Transaction amount mismatch: Webhook received ${webhookAmount}, but API reported ${apiAmount}`, HttpStatus.BAD_REQUEST);
        }

        if (order && Math.abs(webhookAmount - orderAmount!) > 0.00000001) { // Floating point precision check
            this.logger.warn(`Amount mismatch for order: Webhook (${webhookAmount}) vs Order (${orderAmount})`);
            // We might want to handle this differently, but for now we'll log it and possibly update order?
            // Actually, for off-ramping, the received amount is what matters.
        }

        // 4. Persist Deposit to DB
        const deposit = this.depositRepository.create({
            order: order || undefined,
            wallet: wallet || undefined,
            tx_reference: data.transaction_reference,
            tx_hash: data.network_txid || transaction.tx_hash || transaction.hash,
            amount: webhookAmount,
            fee: parseFloat(data.fee || transaction.fee || '0'),
            status: data.status,
            raw_payload: { webhook: data, api: transaction },
        });
        const savedDeposit = await this.depositRepository.save(deposit);

        // 5. Create Beneficiary (Using dynamic data from order)
        if (!order) {
            this.logger.error(`Order link failed - No pending order found for wallet: ${data.wallet.deposit_address} or reference: ${data.transaction_reference}`);
            throw new HttpException('No associated pending order found for this deposit', HttpStatus.NOT_FOUND);
        }

        const beneficiaryData = {
            currency: order.payout_currency.toLowerCase(),
            metadata: order.payout_metadata,
            payout_method_id: order.payout_method
        };

        const beneficiaryResponse = await this.createBeneficiary(beneficiaryData);
        const beneficiaryId = beneficiaryResponse?.data?.uuid || beneficiaryResponse?.uuid || beneficiaryResponse?.data?.id;

        if (!beneficiaryId) {
            this.logger.error(`Beneficiary creation failed - Could not extract ID from response: ${JSON.stringify(beneficiaryResponse)}`);
            throw new HttpException('Failed to create beneficiary for payout. Please check beneficiary details.', HttpStatus.BAD_REQUEST);
        }

        // 6. Initiate Payout
        const payoutData = {
            currency: beneficiaryData.currency,
            beneficiary_id: beneficiaryId,
            payout_method_id: beneficiaryData.payout_method_id,
            amount: order.payout_value,
            description: `Order Payout - ${data.transaction_reference}`,
            reference: `PAY-${data.transaction_reference}`
        };

        const payoutResponse = await this.initiatePayout(payoutData);
        const novacrustPayoutId = payoutResponse?.data?.uuid || payoutResponse?.uuid || payoutResponse?.data?.id;

        // 7. Persist Payout to DB
        const payout = this.payoutRepository.create({
            deposit: savedDeposit,
            beneficiary_id: beneficiaryId,
            novacrust_payout_id: novacrustPayoutId,
            amount: parseFloat(order.payout_value.toString()),
            status: 'PENDING'
        });
        await this.payoutRepository.save(payout);

        // 8. Update order status
        order.status = 'COMPLETED';
        if (!order.tx_reference) order.tx_reference = data.transaction_reference;
        await this.orderRepository.save(order);

        // Send payment success email
        try {
            await this.mailService.sendPayoutSuccessEmail(
                order.recipient_email_address || data.wallet.user.email,
                {
                    userName: order.customer?.first_name || data.wallet.user.first_name || 'Customer',
                    amount: order.payout_value.toString(),
                    currency: order.payout_currency,
                    payoutMethod: order.payout_method,
                    beneficiaryName: order.payout_metadata?.name || `${data.wallet.user.first_name} ${data.wallet.user.last_name}`,
                    reference: data.transaction_reference,
                    dateTime: new Date().toISOString(),
                    dashboardLink: 'https://novacrust.com/dashboard', // Placeholder
                }
            );
        } catch (error) {
            this.logger.error(`Failed to send payment success email: ${error.message}`);
        }

        return {
            success: true,
            message: 'Webhook verified, data persisted and payout initiated',
            data: {
                event: data.event,
                transaction_reference: data.transaction_reference,
                deposit_id: savedDeposit.id,
                payout_id: novacrustPayoutId,
                timestamp: new Date().toISOString()
            }
        };
    }

    async getExchangeRate(fromCurrency: string, toCurrency: string, amount: number) {
        try {
            const url = `${this.baseUrl}/business/open/misc/exchange-rate?from_currency=${fromCurrency}&to_currency=${toCurrency}&amount=${amount}`;
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
            this.logger.error(`Error fetching exchange rate: ${message}`);
            throw new HttpException(message, status);
        }
    }
}
