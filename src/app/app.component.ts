
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import * as gameData from './gameData'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  userName?: string;
  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(){

  }



  public get isLoggedIn() {
    return gameData.data.data.user.sessionId != null;
  }

  

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }


  title = 'tictactoe';
}
