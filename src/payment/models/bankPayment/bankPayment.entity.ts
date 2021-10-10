import { Fiat } from 'src/shared/models/fiat/fiat.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

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

  @ManyToOne(() => Fiat, { eager: true })
  fiat: Fiat;

  @Column({ type: 'float', nullable: true })
  fiatValue: number;

  @Column({ length: 256, unique: true })
  bankTransactionId: string;

  @Column({ length: 256, nullable: true })
  iban: string;

  @Column({ length: 256 })
  bankUsage: string;

  @Column({ length: 256 })
  name: string;

  @Column({ length: 256 })
  location: string;

  @Column()
  bookingDate: Date;

  @Column()
  validationDate: Date;

  //TODO Spalten aus xml eintragen

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;
}
