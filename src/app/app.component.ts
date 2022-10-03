import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import * as gameData from './gameData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentUser: any;
  userName?: string;
  user = gameData.data.data.user
  username?: string;
  isLoggedInn = true;
  
  
  constructor(
    private route: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit():void {
    const user = this.tokenStorageService.getUser();
    this.username = user.userName;
    gameData.data.data.user.sessionId = localStorage.getItem('sessionToken');
    gameData.data.data.user.userName = localStorage.getItem('userName');

  }
  

  public get isLoggedIn() {
    return gameData.data.data.user.sessionId != null;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('boardsize');
    localStorage.removeItem('targetscore');
    window.location.reload();
  }


  home(): void {
    this.route.navigateByUrl('/home');
  }

  title = 'tictactoe';
}

