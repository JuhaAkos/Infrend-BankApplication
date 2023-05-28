import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ClientDTO, AccountDTO, TransactionDTO } from 'models';
import { ClientService } from '../services/client.service';

import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {
  constructor(   
    private clientService: ClientService,
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  client?: ClientDTO;  
  generatedid = 0;
  newFormOpened = false;

  accountForm = this.formBuilder.group({
    id: 1,
    startingBalance: this.formBuilder.control(0),
  });  

  ngOnInit(): void {
    this.loadClientData();
  }

  loadClientData() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.clientService.getOne(id).subscribe({
      next: (client) => {
        this.client = client;
        this.generateId();
        //console.log(this.client.accounts);

        //console.log(client.accounts);       
      }
    });
  }

  navigateToTransaction(id : number) {
    this.router.navigate(['/transaction', id]);
  }

  isInactive(account: AccountDTO): boolean {
    if (account.status == "inactive") {
      return true;
    }
    else{return false};
  }

  makeAccountInactive(account: AccountDTO){
    this.makeInactiveTransaction(account);

    account.status="inactive";
    account.balance=0;    

    this.accountService.update(account).subscribe({
    next: (account) => {
      this.toastrService.success('Számla státusza inaktívra módosítva' , 'Siker');
      },
      error: (err) => {
        this.toastrService.error('Számla módosítása nem sikerült', 'Hiba')
      }
    });    
  }

  makeInactiveTransaction(account: AccountDTO){
    let transaction: TransactionDTO = {id: 0, amount: account.balance, date: new Date(), sender: account, receiver: null, description: "Számla kinullázás"};       

    this.transactionService.create(transaction).subscribe({
      next: (transaction) => {}        
    });    
    
  }

  openForm(){
    if (this.newFormOpened) {
      this.newFormOpened = false;
    } else {
      this.newFormOpened = true;
    }    
  }

  generateId() {
    let ok = true;
    if (this.client != undefined && this.client.accounts != undefined) {
      do {
        ok = true;
        this.generatedid = this.client.id * 10000 + Math.round(Math.random() * (9999 - 1000 + 1) + 1000);

        for (let i = 0; i < this.client.accounts.length; i++) {
          if (this.client.accounts[i].id == this.generatedid) {
            ok = false;
            break;
          }
        }
      } while (!ok);

      this.accountForm.controls['id'].setValue(this.generatedid);
    } else if (this.client != undefined) {
      this.generatedid = this.client.id * 10000 + Math.round(Math.random() * (9999 - 1000 + 1) + 1000);
      this.accountForm.controls['id'].setValue(this.generatedid);
    }
  }

  createNewAccount(){    

    const account = this.accountForm.value as AccountDTO;

    account.id = this.generatedid;
    account.balance = account.startingBalance;
    if (this.client != undefined) {
      account.client = this.client;
    }   
    account.status="active";
    console.log(account.startingBalance);
    this.accountService.create(account).subscribe({
      next: (account) => {
        this.loadClientData();
        window.location.reload();
      },
      error: (err) => {
        this.toastrService.error('Ügyfél hozzáadása sikertleen');
      }
    });   
    
  }
  
}