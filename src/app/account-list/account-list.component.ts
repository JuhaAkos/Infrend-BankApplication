import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClientDTO } from 'models';
import { ClientService } from '../services/client.service';

import { AccountDTO } from 'models';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {

  accounts: AccountDTO[] = [];

  constructor(   
    private clientService: ClientService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute) { }

  client?: ClientDTO;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.clientService.getOne(id).subscribe({
      next: (client) => {
        this.client = client;
        console.log(this.client.accounts);
      }
    });

    this.accountService.getAll().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      }
      //,error: (err) => {this.toastrService.error('A termék hozzáadása nem sikerült.', 'Hiba');}
    });
  }
}