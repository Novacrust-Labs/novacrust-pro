import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Deposit } from './deposit.entity.js';

@Entity('payouts')
export class Payout {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Deposit, (deposit) => deposit.payouts)
    @JoinColumn({ name: 'deposit_id' })
    deposit: Deposit;

    @Column({ name: 'deposit_id' })
    deposit_id: string;

    @Column({ nullable: true })
    beneficiary_id: string;

    @Column({ nullable: true })
    novacrust_payout_id: string;

    @Column({ type: 'decimal', precision: 20, scale: 2 })
    amount: number;

    @Column({ default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
