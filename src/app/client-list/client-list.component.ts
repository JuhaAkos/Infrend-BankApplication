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
  selectedClients: ClientDTO[] = [];

  constructor(
    private ClientService: ClientService,
    private toastrService: ToastrService,
    private router: Router) { }
   
  ngOnInit(): void {
    this.ClientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.selectedClients.push(...this.clients);
      }
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

  navigateToForm(id : number) {
    this.router.navigate(['/client-list/form', id]);
  }

  public selectedValue?: String;
  public inputValue?: String;

  search() {

    if (this.selectedValue == "id" && this.inputValue != undefined && String(this.inputValue).length != 0) {

      this.selectedClients = [];

      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].id == Number(this.inputValue)) {
          this.selectedClients.push(this.clients[i]);
        }
      };

    } else if (this.selectedValue == "idcardnumber" && this.inputValue != undefined && String(this.inputValue).length != 0) {

     
      this.selectedClients = [];


      for (let i = 0; i < this.clients.length; i++) {

        if (this.clients[i].idcardnumber == this.inputValue) {
          this.selectedClients.push(this.clients[i]);
        }
      };

    } else if (this.selectedValue == "name" && this.inputValue != undefined && String(this.inputValue).length != 0) {

      this.selectedClients = [];

      for (let i = 0; i < this.clients.length; i++) {
        if (String(this.clients[i].lastname + this.clients[i].firstname).includes(String(this.inputValue))) {
          this.selectedClients.push(this.clients[i]);
        }
      };


    }
    if (this.selectedValue == undefined || this.inputValue == undefined || this.inputValue.length == 0) {
      console.log("should reload");
      //if options are missing reload all
      
      this.selectedClients = [];
      this.selectedClients.push(...this.clients);

    }
  } 
 
}
