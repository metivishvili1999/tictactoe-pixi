import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://172.25.36.202:8085/api/Api/Authorization'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*",
}) 
};

const httpOptions1 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*",
}) 
  ,responseType: 'text' as 'json'
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string, sessionId: string): Observable<any> {
    return this.http.post(AUTH_API, {
      userName,
      password,
      sessionId
    }, httpOptions);
  }

  register(firstName: string, lastName: string, userName:string, password:string):Observable<any> {
    return this.http.post(`http://172.25.36.202:8085/api/Api/Registration`, {
      firstName,
      lastName,
      userName,
      password
    },httpOptions1);
  }

}


