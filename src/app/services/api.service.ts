import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = "http://127.0.0.1:8000/api/users";

  constructor(private http : HttpClient) { }

  createUser(data : Object) : Observable<Object>{
    return this.http.post(this.baseUrl, data);
  }

  getUsers(): Observable<any>{
    return this.http.get(this.baseUrl);
  }

  getUser(id : number): Observable<Object>{
    return this.http.get(this.baseUrl+'/'+id);
  }
  
  updateUser(id : number, data : any) : Observable<Object>{
    return this.http.put(this.baseUrl+'/'+id, data);
  }

  deleteUser(id : number) : Observable<any>{
    return this.http.delete(this.baseUrl+'/'+id, { responseType: 'text' });
  }
}
