import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionDTO } from 'models';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getAll() {
     return this.http.get<TransactionDTO[]>('api/transactions');
  }

  getOne(id: number) {
    return this.http.get<TransactionDTO>('api/transactions/' + id);
  }

  create(product: TransactionDTO) {
    return this.http.post<TransactionDTO>('api/transactions', product);
  }

  update(product: TransactionDTO) {
    return this.http.put<TransactionDTO>('api/transactions', product);
  }

  delete(id: number) {
    return this.http.delete('api/transactions/' + id);
  }
}