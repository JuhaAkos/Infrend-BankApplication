import { AppDataSource } from "../data-source";
import { Client } from "../entity/Client";
import { Controller } from "./base.controller";

export class ClientController extends Controller{
    repository = AppDataSource.getRepository(Client)
}