import { AppDataSource } from "../data-source";
import { Transaction } from "../entity/Transaction";
import { Controller } from "./base.controller";

export class TransactionController extends Controller{
    repository = AppDataSource.getRepository(Transaction)
}