import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Wallet } from './wallet.entity.js';
import { Order } from './order.entity.js';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    novacrust_customer_id: string;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ nullable: true })
    country: string;

    @Column({ type: 'varchar', nullable: true })
    customer_type: string;

    @Column({ nullable: true })
    kyc_status: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => Wallet, (wallet) => wallet.customer)
    wallets: Wallet[];

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}
