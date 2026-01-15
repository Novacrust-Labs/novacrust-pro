import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity.js';

@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    novacrust_wallet_id: string;

    @Column({ nullable: true })
    address: string;

    @Column()
    network: string;

    @Column({ type: 'uuid', nullable: true })
    network_id: string;

    @ManyToOne(() => Customer, (customer) => customer.wallets)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'customer_id' })
    customer_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
