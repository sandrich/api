import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';

export enum BankPaymentType {
  DFXPAYMENT = 'DFX-Payment',
  REPAYMENT = 'Repayment',
  BANKCOSTS = 'Bank-Costs',
}

@Entity()
export class BankPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, unique: true })
  bankName: string;

  @Column({ type: 'varchar', length: 256, unique: true })
  type: BankPaymentType;

  //TODO Spalten aus xml eintragen

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;
}
