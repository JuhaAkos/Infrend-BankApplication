import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {ClientDTO } from 'models';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent {
  clients: ClientDTO[] = [];

  constructor(
    private ClientService: ClientService,
    private toastrService: ToastrService,
    private router: Router) { }
   
  ngOnInit(): void {
    this.ClientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
      }
      //,error: (err) => {this.toastrService.error('A termék hozzáadása nem sikerült.', 'Hiba');}
    });
  } 

  isInactive(client: ClientDTO): boolean {
    if (client.status == "inactive") {
      return true;
    }
    else{return false};
  }

  setDeletedClient(client: ClientDTO) {
    client.status="inactive";
  }

  deleteClient(client: ClientDTO) {
    this.setDeletedClient(client);

    this.ClientService.update(client).subscribe({
      next: (client) => {
        this.toastrService.success('Ügyfél sikeresen törölve' , 'Siker');
      },
      error: (err) => {
        this.toastrService.error('Hiba a törléskor', 'Hiba')
      }
    });
  }

  navigateToAccount(id : number) {
    this.router.navigate(['/account', id]);
  }
 
}
