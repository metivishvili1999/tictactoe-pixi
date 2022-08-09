import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsernamesService {

  constructor() { }

  messageSubject = new Subject<any>();
 
 
  setUsers(body: {user1: string, user2: string}){
 
    this.messageSubject.next(body);
  }
}
