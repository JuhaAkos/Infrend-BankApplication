import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { ClientDTO } from "../../../models";
import { Account } from "./Account";

@Entity()
export class Client implements ClientDTO{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    address: string;

    @Column()
    phonenumber: string;

    @Column()
    idcardnumber: string;

    @Column()
    status: "active" | "inactive";

    @OneToMany(type => Account, account => account.client)
    accounts: Account[];
}