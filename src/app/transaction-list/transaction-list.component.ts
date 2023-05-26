import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDTO } from 'models';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  constructor(   
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  account?: AccountDTO;
  allaccounts: AccountDTO[] = [];

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.accountService.getOne(id).subscribe({
      next: (account) => {
        this.account = account;
        //console.log(this.client.accounts);

        //console.log(client.accounts);
      }
    });    

    this.accountService.getAll().subscribe({
      next: (allaccounts) => {
        this.allaccounts = allaccounts;
      }
      //,error: (err) => {this.toastrService.error('A termék hozzáadása nem sikerült.', 'Hiba');}
    });    
  }
}
