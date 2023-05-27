import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

import {AccountDTO, ClientDTO } from 'models';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  readytocreate = false;
  generatedid = 0;
  accounts: AccountDTO[] = [];

  isNewClient = true;

  clientForm = this.formBuilder.group({
    id: this.generatedid,
    lastname: this.formBuilder.control(''),
    firstname: this.formBuilder.control(''),
    address: this.formBuilder.control(''),
    phonenumber: this.formBuilder.control(''),
    idcardnumber: this.formBuilder.control(''),
    status: "active",
    accounts: null
  });

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private toastrService: ToastrService,
    ) { }

  isReady() {
    this.readytocreate = true;
    this.generateId();
  }

  generateId() {
    this.generatedid = Math.round(Math.random() * (999999 - 100000 + 1) + 100000);
  }

  saveClient() {
    const client = this.clientForm.value as ClientDTO;
    //this is needed because it otherwise doesn't get value
    client.id=this.generatedid;

    this.clientService.create(client).subscribe({
      next: (client) => {
        this.toastrService.success('Ügyfél hozzáadva, id:' + client.id , 'Siker');
      },
      error: (err) => { 
        this.toastrService.error('Ügyfél hozzáadása sikertleen');
      }
    });
  }
}
