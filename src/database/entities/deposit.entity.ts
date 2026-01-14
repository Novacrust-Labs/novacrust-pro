import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity.js';
import { Wallet } from './wallet.entity.js';
import { Payout } from './payout.entity.js';

@Entity('deposits')
export class Deposit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.deposits, { nullable: true })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'order_id', nullable: true })
    order_id: string;

    @ManyToOne(() => Wallet)
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;

    @Column({ name: 'wallet_id' })
    wallet_id: string;

    @Column({ unique: true })
    tx_reference: string;

    @Column({ nullable: true })
    tx_hash: string;

    @Column({ type: 'decimal', precision: 20, scale: 8 })
    amount: number;

    @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
    fee: number;

    @Column()
    status: string;

    @Column({ type: 'jsonb' })
    raw_payload: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => Payout, (payout) => payout.deposit)
    payouts: Payout[];
}
