import { Payment } from 'src/payment/models/payment/payment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';

export enum BankAccountType {
  DFXPAYMENT = 'DFX-Payment',
  REPAYMENT = 'Repayment',
  BANKCOSTS = 'Bank-Costs',
}

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, unique: true })
  bankName: string;

  @Column({ type: 'varchar', length: 256, unique: true })
  type: BankAccountType;

  //TODO Spalten aus xml eintragen

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;
}
