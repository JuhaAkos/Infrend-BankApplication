import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne} from "typeorm"
import { AccountDTO } from "../../../models";
import { Transaction } from "./Transaction";
import { Client } from "./Client";

@Entity()
export class Account implements AccountDTO{

    @PrimaryColumn({ type: "decimal" })
    id: number;

    @Column()
    startingBalance: number;

    @Column()
    balance: number;

    @Column()
    status: "active" | "inactive";

    @ManyToOne(type => Client, (client) => client.accounts)
    client: Client;

    @OneToMany(type => Transaction, (transaction) => transaction.sender)
    sendertransactions: Transaction[];

    @OneToMany(type => Transaction, (transaction) => transaction.receiver)
    receivertransactions: Transaction[];
}