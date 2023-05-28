import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ActivatedRoute } from '@angular/router';
import { AccountDTO, TransactionDTO } from 'models';
import { TransactionService } from '../services/transaction.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  constructor(   
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    ) { }

  shownForm = "none";
  account?: AccountDTO;
  senderTransactions: TransactionDTO[] =[];
  receiverTransactions: TransactionDTO[] =[];
  allTransactions: TransactionDTO[] = [];
  accounts: AccountDTO[] = [];
  backupAccounts: AccountDTO[] = [];

  sendershown = false;

  public backupSenderTransactions: TransactionDTO[] = [];
  public backupReceiverTransactions: TransactionDTO[] = [];

  withDrawalForm = this.formBuilder.group({
    amount: this.formBuilder.control(0)
  });  

  depositForm = this.formBuilder.group({
    amount: this.formBuilder.control(0)
  }); 

  standardForm = this.formBuilder.group({
    amount: this.formBuilder.control(0),
    receiver: ['', [Validators.required]],
    description: this.formBuilder.control(''),
  }); 
  
  ngOnInit(): void {
      const id = this.activatedRoute.snapshot.params['id'];
      //account betolt, sendertransactions es receivertransactions nem jon vele
      this.accountService.getOne(id).subscribe({
        next: (account) => {
          this.account = account;

          this.accountService.getAll().subscribe({
            next: (accounts) => {
                this.backupAccounts = accounts;
                this.accounts = [];
                for(let i=0; i<this.backupAccounts.length; i++){  
                  if (this.backupAccounts[i].status == "active") {
                    this.accounts.push(this.backupAccounts[i]);
                  }
                }
                for(let i=0; i<this.accounts.length; i++){                  
                  if (this.accounts[i].id == this.account?.id) {                    
                    this.accounts.splice(i, 1);
                    break;
                  }
                }
            }
          });

          //osszes tranzakcio betolt
          this.loadAllTransactions();
          
        }
      });       
    }

  loadAllTransactions(){
    this.senderTransactions = [];
    this.backupSenderTransactions = [];
    this.receiverTransactions = [];
    this.backupReceiverTransactions = [];

    this.transactionService.getAll().subscribe({
      next: (allTransactions) => {
          this.allTransactions = allTransactions;           

          //megnezzuk, mely tranzakcioknal az account a sender/receiver, es felvesszuk oket a megfelelo tranzakcio listaba
          
          for(let i=0; i<this.allTransactions.length; i++){
            this.allTransactions[i].date=new Date(this.allTransactions[i].date);
            if(this.allTransactions[i].sender?.id == this.account?.id){
                this.senderTransactions.push(this.allTransactions[i]);
               
            }
            if(this.allTransactions[i].receiver?.id == this.account?.id){
                this.receiverTransactions.push(this.allTransactions[i]);
            }
          }

          this.backupSenderTransactions.push(...this.senderTransactions);
          this.backupReceiverTransactions.push(...this.receiverTransactions);            
      }
      });  
  }

  showSender() {    
    this.sendershown=true;
  }

  showReceiver() {   
    this.sendershown=false; 
  }
  
  openFormStandard() {
    if (this.shownForm != "standard") {
      this.shownForm = "standard";
    } else {
      this.shownForm = "none";
    }    
  }

  openFormWithDrawal() {
    if (this.shownForm != "withdrawal") {
      this.shownForm = "withdrawal";
    } else {
      this.shownForm = "none";
    }   
  }

  openFormDeposit() {
    if (this.shownForm != "deposit") {
      this.shownForm = "deposit";
    } else {
      this.shownForm = "none";
    }   
  }

  saveWithDrawal(){
    const transaction = this.withDrawalForm.value as TransactionDTO;

    if (transaction.amount <= 0) {
      this.toastrService.error('Negatív pénzösszeg nem vehető');
      return;
    }  

    transaction.date = new Date();    
    if (this.account != undefined ){
      transaction.sender = this.account;
    }    
    transaction.receiver = null;
    transaction.description = "Banki kifizetés";

    if (this.account != undefined) {
      var newBalance = this.account.balance-transaction.amount;
      if (newBalance<0){
        this.toastrService.error('Egyenleg túllépés');
        return;
      }
      this.account.balance = newBalance;
      this.updateBalance(this.account);
    }

    this.createTransaction(transaction);
  }

  saveDeposit(){
    const transaction = this.depositForm.value as TransactionDTO;
    if (transaction.amount <= 0) {
      this.toastrService.error('Negatív pénzösszeg nem fizethető be');
      return;
    }  

    transaction.date = new Date();
    if (this.account != undefined ){
      transaction.receiver = this.account;
    }    
    transaction.sender = null;
    transaction.description = "Banki befizetés";

    if (this.account != undefined) {
      var newBalance = +this.account.balance + +transaction.amount;     
      
      this.account.balance = newBalance;
      this.updateBalance(this.account);
    }

    this.createTransaction(transaction);
  }

  saveStandard(){    
    const transaction = this.standardForm.value as TransactionDTO; 
    if (transaction.amount <= 0) {
      this.toastrService.error('Negatív pénzösszeg nem utalható');
      return;
    }   

    transaction.date = new Date();
    if (this.account != undefined ){
      transaction.sender = this.account;
    } 

    if (this.account != undefined) {
      var newBalance = this.account.balance-transaction.amount;
      if (newBalance<0){
        this.toastrService.error('Egyenleg túllépés');
        return;
      }      
      
      if (transaction.receiver != undefined) {
        if (transaction.receiver.status == "inactive") {
          this.toastrService.error('A címzett számla inaktív');
          return;
        }
        transaction.receiver.balance += +transaction.amount;
        this.updateBalance(transaction.receiver);
      }
      console.log(transaction.date);
      this.account.balance = newBalance;
      this.updateBalance(this.account);
    }      
    
    this.createTransaction(transaction);
    
  }

  createTransaction(transaction: TransactionDTO){
    this.transactionService.create(transaction).subscribe({
      next: (transaction) => {
        this.toastrService.success('Tranzakció hozzáadva, id:' + transaction.id , 'Siker');
        this.loadAllTransactions();
      },
      error: (err) => { 
        this.toastrService.error('Tranzakció hozzáadása sikertleen');
      }
    });
  }

  updateBalance(account: AccountDTO){
    if (account != undefined) {
      this.accountService.update(account).subscribe({
        next: (account) => {}
      });
    }    
  }

  isItInactive(): boolean {
    if (this.account?.status=="inactive") {
      return true;
    } else {
      return false;
    }
  }

  public selectedValue?: String;
  public inputValue?: String;  

  searchReceiver() {

    if (this.selectedValue == "id" && this.inputValue != undefined && String(this.inputValue).length != 0) {

      this.receiverTransactions= [];

      for (let i = 0; i < this.backupReceiverTransactions.length; i++) {
        if (this.backupReceiverTransactions[i].sender?.id == Number(this.inputValue)) {
          this.receiverTransactions.push(this.backupReceiverTransactions[i]);
        }
      };


    } else if (this.selectedValue == "amount" && this.inputValue != undefined && String(this.inputValue).length != 0) {
     
      this.receiverTransactions= [];

      for (let i = 0; i < this.backupReceiverTransactions.length; i++) {

        if (String(this.backupReceiverTransactions[i].amount) == this.inputValue) {
          this.receiverTransactions.push(this.backupReceiverTransactions[i]);
        }
      };


    } else if (this.selectedValue == "date" && this.inputValue != undefined && String(this.inputValue).length != 0) {

      this.receiverTransactions= [];

      for (let i = 0; i < this.backupReceiverTransactions.length; i++) {
        if (String(this.backupReceiverTransactions[i].date).includes(String(this.inputValue))) {
          this.receiverTransactions.push(this.backupReceiverTransactions[i]);
        }
      };

    }

    if (this.selectedValue == undefined || this.inputValue == undefined || this.inputValue.length == 0) {
      //if options are missing reload all
      
      this.receiverTransactions= [];
      this.receiverTransactions.push(...this.backupReceiverTransactions);

    }
  }

  searchSender() {
    if (this.selectedValue == "id" && this.inputValue != undefined && String(this.inputValue).length != 0) {

      this.senderTransactions= [];

      for (let i = 0; i < this.backupSenderTransactions.length; i++) {
        if (this.backupSenderTransactions[i].receiver?.id == Number(this.inputValue)) {
          this.senderTransactions.push(this.backupSenderTransactions[i]);
        }
      };


    } else if (this.selectedValue == "amount" && this.inputValue != undefined && String(this.inputValue).length != 0) {
     
      this.senderTransactions= [];

      for (let i = 0; i < this.backupSenderTransactions.length; i++) {

        if (String(this.backupSenderTransactions[i].amount) == this.inputValue) {
          this.senderTransactions.push(this.backupSenderTransactions[i]);
        }
      };


    } else if (this.selectedValue == "date" && this.inputValue != undefined && String(this.inputValue).length != 0) {

      this.senderTransactions= [];

      for (let i = 0; i < this.backupSenderTransactions.length; i++) {
        if (String(this.backupSenderTransactions[i].date).includes(String(this.inputValue))) {
          this.senderTransactions.push(this.backupSenderTransactions[i]);
        }
      };


    }

    if (this.selectedValue == undefined || this.inputValue == undefined || this.inputValue.length == 0) {
      //if options are missing reload all
      
      this.senderTransactions= [];
      this.senderTransactions.push(...this.backupSenderTransactions);

    }
  }
}
