import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { TransactionDTO } from "../../../models";
import { Account } from "./Account";

@Entity()
export class Transaction implements TransactionDTO{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column()
    date: Date;   
    
    @ManyToOne(type => Account, (account) => account.sendertransactions, { eager: true })
    sender: Account;

    @ManyToOne(type => Account, (account) => account.receivertransactions, { eager: true })
    receiver: Account;    

    @Column()
    description: string;
}