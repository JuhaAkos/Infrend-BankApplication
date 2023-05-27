import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDTO, TransactionDTO } from 'models';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  constructor(   
    private accountService: AccountService,
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  account?: AccountDTO;
  senderTransactions: TransactionDTO[] =[];
  receiverTransactions: TransactionDTO[] =[];
  allTransactions: TransactionDTO[] = []; 

  sendershown = false;
  
  ngOnInit(): void {
      const id = this.activatedRoute.snapshot.params['id'];
      //account betolt, sendertransactions es receivertransactions nem jon vele
      this.accountService.getOne(id).subscribe({
        next: (account) => {
          this.account = account;

          //osszes tranzakcio betolt
          this.transactionService.getAll().subscribe({
          next: (allTransactions) => {
              this.allTransactions = allTransactions;

              //console.log(this.allTransactions.length); //itt írja ki egyedül, itt létezik
              //console.log(this.account?.id); 

              //megnezzuk, mely tranzakcioknal az account a sender/receiver, es felvesszuk oket a megfelelo tranzakcio listaba
              for(let i=0; i<this.allTransactions.length; i++){
                if(this.allTransactions[i].sender?.id == this.account?.id){
                    this.senderTransactions.push(this.allTransactions[i]);
                }
                if(this.allTransactions[i].receiver?.id == this.account?.id){
                    this.receiverTransactions.push(this.allTransactions[i]);
                }
              }
            
          }
          });  
        }
      });          
    }

  showSender() {    
    this.sendershown=true;
  }

  showReceiver() {   
    this.sendershown=false; 
  }
  
}
