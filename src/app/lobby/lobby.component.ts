import {
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as gameData from '../gameData';
import { __values } from 'tslib';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  content?: string;
  isSubmitted!: boolean;

  boardSize = [
    { id: 3, name: '3x3', cellNumber: 9 },
    { id: 4, name: '4x4', cellNumber: 16 },
    { id: 5, name: '5x5', cellNumber: 25 },
  ];

  scoreToPlay = [
    { id: 1, name: '1', score: 1 },
    { id: 3, name: '3', score: 3 },
    { id: 5, name: '5', score: 5 },
  ];

  FormBuilder: any;
  gameForm: FormGroup = new FormGroup({});

  public connection: signalR.HubConnection;
  public isConnected: any;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.gameForm = this.fb.group({
      size: [null],
      score: [null],
    });

    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('http://172.25.36.202:8085/signalr', {
        accessTokenFactory: () => gameData.data.data.user.sessionId,
      })
      .build();

    if (gameData.data.data.user.sessionId != null) {
      this.isConnected = this.connection
        .start()
        .then(function () {
          console.log('SignalR Connected!');
        })
        .catch(function (err) {
          return console.error(err.toString());
        });

      this.connection.on('getallgame', (response) => {
        gameData.data.data.gameTables = response;
        // let game = response.filter((player) => {
        //   player.playerOne.userName == gameData.data.data.user.userName ||
        //     player.playerTwo.userName == gameData.data.data.user.userName;
        // })[0];
        // gameData.data.data.activeGame = game ? game.id : 0;
        gameData.data.setboardSize(response[0].boardSize);
        gameData.data.setScore(response[0].targetScore);
        console.warn(response);
        this.ref.detectChanges();
      });
      this.connection.on('nextturn', (response, resp) => {
        console.warn(response, resp);
      });

      this.connection.on('ongamecreate', (errorCode, errorMessage) => {
        console.warn(errorCode, errorMessage);
        this.ref.detectChanges();
      });
    }
  }


  sendData() {
    this.isConnected.then(() => {
      this.connection
        .invoke('CreateGame', {
          BoardSize: gameData.data.data.boardSize,
          ScoreTarget: gameData.data.data.scoreToPlay,
        })
        .catch((err) => console.error(err));
    });
  }

  joinGame(id) {
    this.isConnected.then(() => {
      this.connection
        .invoke('JoinToGame', {
          GameId: id,
          
        })
        .then(() => {
          gameData.data.data.activeGame = id;
          console.log(id);
        })
        .catch((err) => console.error(err));
    });
  }



  public get tables() {
    return gameData.data.data.gameTables;
  }

  selectSize(e: any): void {
    gameData.data.setboardSize(this.gameForm.value.size);
  }

  selectScore(e: any): void {
    gameData.data.setScore(this.gameForm.value.score);
  }

  onSubmit() {
    this.isSubmitted = true;
    this.gameForm.markAllAsTouched();
    if (this.gameForm.valid) {
      gameData.data.setboardSize(this.gameForm.value.size);
      gameData.data.setScore(this.gameForm.value.score);
    } else {
      console.log('Form is not');
    }
  }
}


