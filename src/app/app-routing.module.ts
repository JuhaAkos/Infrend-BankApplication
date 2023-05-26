import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { AccountListComponent } from './account-list/account-list.component';

const routes: Routes = [
  {
    path: '',
    component: MainmenuComponent
  },
  {
    path: 'client-list',
    component: ClientListComponent
  },
  {
    path: 'client-form',
    component: ClientFormComponent
  },
  {
    path: 'account/:id',
    component: AccountListComponent
  },
  {
    path: 'transaction/:id',
    component: TransactionListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
