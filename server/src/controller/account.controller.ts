import { AppDataSource } from "../data-source";
import { Account } from "../entity/Account";
import { Controller } from "./base.controller";

export class AccountController extends Controller{
    repository = AppDataSource.getRepository(Account)
}