import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClientDTO } from 'models';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {

  constructor(   
    private ClientService: ClientService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute) { }

  client!: ClientDTO;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ClientService.getOne(id).subscribe({
      next: (client) => this.client = client
    });
  }
}
