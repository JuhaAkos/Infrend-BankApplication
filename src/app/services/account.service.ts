import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountDTO } from 'models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getAll() {
     return this.http.get<AccountDTO[]>('api/accounts');
  }

  getOne(id: number) {
    return this.http.get<AccountDTO>('api/accounts/' + id);
  }

  create(product: AccountDTO) {
    return this.http.post<AccountDTO>('api/accounts', product);
  }

  update(product: AccountDTO) {
    return this.http.put<AccountDTO>('api/accounts', product);
  }

  delete(id: number) {
    return this.http.delete('api/accounts/' + id);
  }
}