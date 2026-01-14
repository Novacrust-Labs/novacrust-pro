import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './customer.entity.js';
import { Deposit } from './deposit.entity.js';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'customer_id' })
    customer_id: string;

    @Column()
    crypto_currency: string;

    @Column({ type: 'decimal', precision: 20, scale: 8 })
    crypto_amount: number;

    @Column({ nullable: true })
    crypto_address: string;

    @Column()
    network: string;

    @Column()
    payout_currency: string;

    @Column({ type: 'decimal', precision: 20, scale: 2 })
    payout_value: number;

    @Column()
    payout_method: string;

    @Column({ type: 'jsonb' })
    payout_metadata: any;

    @Column({ default: 'PENDING' })
    status: string;

    @Column({ nullable: true })
    tx_reference: string;

    @Column({ nullable: true })
    recipient_email_address: string;

    @Column({ nullable: true })
    recipient_phone_number: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => Deposit, (deposit) => deposit.order)
    deposits: Deposit[];
}
