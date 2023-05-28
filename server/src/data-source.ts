import "reflect-metadata"
import { DataSource } from "typeorm"
import { Client } from "./entity/Client"
import { Account } from "./entity/Account"
import { Transaction } from "./entity/Transaction"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    database: "bankapp",
    synchronize: true,
    logging: true,
    entities: [User, Client, Account, Transaction],
    migrations: [],
    subscribers: [],
    timezone: "+02:00",
})
