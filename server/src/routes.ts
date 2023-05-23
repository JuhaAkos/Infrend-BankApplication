import express  from "express";
import { ClientController } from "./controller/client.controller";
import { AccountController } from "./controller/account.controller";
import { TransactionController } from "./controller/transaction.controller";

export function getRoutes() {
    const router = express.Router();

    const clientController = new ClientController();

    router.get('/clients', clientController.getAll);
    router.get('/clientss/:id', clientController.getOne);
    router.post('/clients/', clientController.create);
    router.put('/clients/', clientController.update);
    router.delete('/clients/:id', clientController.delete);

    const accountController = new AccountController();

    router.get('/accounts', accountController.getAll);
    router.get('/accounts/:id', accountController.getOne);
    router.post('/accounts/', accountController.create);
    router.put('/accounts/', accountController.update);
    router.delete('/accounts/:id', accountController.delete);

    const transactionController = new TransactionController();

    router.get('/transactions', transactionController.getAll);
    router.get('/transactions/:id', transactionController.getOne);
    router.post('/transactions/', transactionController.create);
    router.put('/transactions/', transactionController.update);
    router.delete('/transactions/:id', transactionController.delete);

    return router;
}