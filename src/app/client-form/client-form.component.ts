import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

import { ClientDTO } from 'models';
import { ClientService } from '../services/client.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private toastrService: ToastrService,
    ) { }


  generatedid = 0;
  existingclient?: ClientDTO;
  clients: ClientDTO[] = [];

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

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
  
    if (id) {
      this.isNewClient = false;

      const id = this.activatedRoute.snapshot.params['id'];
      this.clientService.getOne(id).subscribe({
        //this.form.controls['dept'].setValue(selected.id);
        next: (existingclient) => {this.clientForm.controls['id'].setValue(existingclient.id);
        this.clientForm.controls['id'].setValue(existingclient.id);
        this.clientForm.controls['lastname'].setValue(existingclient.lastname);
        this.clientForm.controls['firstname'].setValue(existingclient.firstname);
        this.clientForm.controls['address'].setValue(existingclient.address);
        this.clientForm.controls['phonenumber'].setValue(existingclient.phonenumber);
        this.clientForm.controls['idcardnumber'].setValue(existingclient.idcardnumber);
        this.clientForm.controls['status'].setValue(existingclient.status);
        this.existingclient = existingclient;        
      }
    });   
    } else {
      this.clientService.getAll().subscribe({
        next: (clients) => {
          this.clients = clients;

          this.generateId();
        }
        //,error: (err) => {this.toastrService.error('A termék hozzáadása nem sikerült.', 'Hiba');}
      });
      
    }
  }

  generateId() {
    let ok = true;

    do {
      ok = true;
      this.generatedid = Math.round(Math.random() * (999999 - 100000 + 1) + 100000);

      for(let i=0; i<this.clients.length; i++){
        if (this.clients[i].id==this.generatedid) {
          ok=false;
          break;
        }
      }
    } while (!ok);
    
    this.clientForm.controls['id'].setValue(this.generatedid);
  }

  saveClient() {    
    const client = this.clientForm.value as ClientDTO;
    //this is needed because it otherwise doesn't get value

    if (this.isNewClient) {
      client.id=this.generatedid;
        this.clientService.create(client).subscribe({
          next: (client) => {
            this.toastrService.success('Ügyfél hozzáadva, id:' + client.id , 'Siker');
          },
          error: (err) => { 
            this.toastrService.error('Ügyfél hozzáadása sikertelen');
          }
        });
    } else if(this.existingclient != undefined) {
        if (client.status == "inactive"){
          this.toastrService.error('Inaktív ügyfél adatai nem módosíthatóak');
          return;
        }
        client.accounts=this.existingclient.accounts;
        this.clientService.update(client).subscribe({
          next: (client) => {
            this.toastrService.success('Ügyfél módosítva, id:' + client.id , 'Siker');
          },
          error: (err) => { 
            this.toastrService.error('Ügyfél módosítása sikertelen');
          }
        });
    } else {
      this.toastrService.error('Ügyfélkezelés sikertelen!');
    }
  }
}
