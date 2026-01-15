import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('waitlist')
export class Waitlist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;

    @Column()
    email: string;

    @Column()
    interest: string; // "cash-to-crypto" or "crypto-to-fiat-loan"

    @CreateDateColumn()
    created_at: Date;
}
