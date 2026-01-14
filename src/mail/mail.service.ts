import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { payoutSuccessTemplate } from './templates/payout-success.template.js';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: this.configService.get<number>('SMTP_PORT') === 465, // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    async sendMail(to: string, subject: string, html: string, text?: string) {
        try {
            const from = this.configService.get<string>('SMTP_FROM');
            const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                text,
                html,
            });
            this.logger.log(`Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            this.logger.error(`Error sending email: ${error.message}`);
            throw error;
        }
    }

    async sendPayoutSuccessEmail(to: string, data: Parameters<typeof payoutSuccessTemplate>[0]) {
        const html = payoutSuccessTemplate(data);
        const subject = 'Payout Successful - Novacrust';
        return this.sendMail(to, subject, html, `Your payout of ${data.amount} ${data.currency} was successful.`);
    }
}
