import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDTO } from 'models';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getAll() {
     return this.http.get<ClientDTO[]>('api/clients');
  }

  getOne(id: number) {
    return this.http.get<ClientDTO>('api/clients/' + id);
  }

  create(product: ClientDTO) {
    return this.http.post<ClientDTO>('api/clients', product);
  }

  update(product: ClientDTO) {
    return this.http.put<ClientDTO>('api/clients', product);
  }

  delete(id: number) {
    return this.http.delete('api/clients/' + id);
  }
}