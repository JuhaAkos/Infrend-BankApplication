import { Entity, Column, OneToMany, PrimaryColumn} from "typeorm"
import { ClientDTO } from "../../../models";
import { Account } from "./Account";

@Entity()
export class Client implements ClientDTO{

    @PrimaryColumn()
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

    @OneToMany(type => Account, account => account.client, { eager: true })
    accounts: Account[];
}