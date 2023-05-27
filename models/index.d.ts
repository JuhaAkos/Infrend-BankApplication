export interface ClientDTO {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    phonenumber: string;
    idcardnumber: string;
    status: "active" | "inactive";
    accounts: null | AccountDTO[];
}

export interface AccountDTO {
    id: number;
    startingBalance: number;
    balance: number;
    status: "active" | "inactive";
    sendertransactions: null | TransactionDTO[];
    receivertransactions: null | TransactionDTO[];
    client: ClientDTO;
}

export interface TransactionDTO {
    id: number;    
    amount: number;
    date: Date;
    sender: null | AccountDTO;
    receiver: null | AccountDTO;
    description: string;
}