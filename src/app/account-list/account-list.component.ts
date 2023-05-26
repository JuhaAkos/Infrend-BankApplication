import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ClientDTO } from 'models';
import { ClientService } from '../services/client.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {
  isItSender: boolean = false;

  constructor(   
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  client?: ClientDTO;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.clientService.getOne(id).subscribe({
      next: (client) => {
        this.client = client;
        //console.log(this.client.accounts);

        //console.log(client.accounts);
      }
    });    
  }

  navigateToTransaction(id : number) {
    this.router.navigate(['/transaction', id]);
  }

  
}