import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  errorMessage = '';
  submitted = true;
  joinDisabled = true;

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
  public gameState: number;

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
        .then(function () {})
        .catch(function (err) {
          return console.error(err.toString());
        });

      this.connection.on('getallgame', (response) => {
        gameData.data.data.gameTables = response;
        response.filter((player) => {
          if (
            player.playerOne.userName == gameData.data.data.user.userName ||
            player.playerTwo.userName == gameData.data.data.user.userName
          ) {
          }
        })[0];
      });

      this.connection.on('gamesforreconnect', (gamesArray) => {
        gameData.data.data.joinable = gamesArray;
        gamesArray.filter((player) => {
          if (
            player.playerOne.userName == gameData.data.data.user.userName ||
            player.playerTwo.userName == gameData.data.data.user.userName
          ) {
            gameData.data.data.activeGame = player.gameId;
          }
        })[0];
        gameData.data.setboardSize(gamesArray[0].boardSize);
        gameData.data.setScore(gamesArray[0].targetScore);
        this.ref.detectChanges();
      });

      this.connection.on('getcurrentgame', (response, playerId) => {
          gameData.data.setboardSize(response.boardSize);
          gameData.data.setScore(response.targetScore);
          gameData.data.data.playerOne = response.playerOne.userName;
          gameData.data.data.playerTwo = response.playerTwo.userName;
          gameData.data.data.first = response.playerOne.userName;
          gameData.data.data.sec = response.playerTwo.userName;
          this.route.navigateByUrl('/board').catch((err) => console.error(err));
          this.ref.detectChanges();
      });

      this.connection.on('onreconnected', (joinableList, dict, userId) => {
        gameData.data.data.joinable = joinableList;
        this.ref.detectChanges();
      });

      this.connection.on('gethistory', (series) => {
        gameData.data.data.gamesHistory = series;
      });

      this.connection.on('ongamerejoin',(errorCode,errMessage,gamesArray,movesArray,player,currentPlId
        ) => {
          gameData.data.data.rejoinedPlayer = player;
          gameData.data.data.movesHistory = movesArray;
          gameData.data.data.playerOne = gamesArray.playerOne.userName;
          gameData.data.data.playerTwo = gamesArray.playerTwo.userName;
          gameData.data.data.firstpoint = gamesArray.playerOneScore;
          gameData.data.data.secpoint = gamesArray.playerTwoScore;
        }
      );
    }
  }

  reconnect(gameId) {
    this.isConnected.then(() => {
      this.connection
        .invoke('Reconnect', {
          GameId: gameId,
        })
        .then(() => {
          gameData.data.data.activeGame = gameId;
          gameData.data.data.playerTwo = gameData.data.data.user.userName;
        });
        this.route.navigateByUrl('/board');
        // window.open(`/board?boardSize=${gameData.data.data.boardSize}&scoreToPlay=${gameData.data.data.scoreToPlay}`, '_blank').focus()
      gameData.data.data.rejoined = true;
});
  }

  sendData() {
    this.isConnected.then(() => {
      this.connection
        .invoke('CreateGame', {
          BoardSize: gameData.data.data.boardSize,
          ScoreTarget: gameData.data.data.scoreToPlay,
        }).then (() => {
        })
        .catch((err) => console.error(err));
      gameData.data.data.playerOne = gameData.data.data.user.userName;
      if (
        gameData.data.data.boardSize > 0 &&
        gameData.data.data.scoreToPlay > 0
      ) {
        // window.open(`/board?boardSize=${gameData.data.data.boardSize}&scoreToPlay=${gameData.data.data.scoreToPlay}`, '_blank').focus();
        this.route.navigateByUrl('/board');
      } else if (
        gameData.data.data.boardSize === 0 ||
        gameData.data.data.scoreToPlay === 0
      ) {
        this.errorMessage = 'Both parameters are required';
        this.submitted = false;
      }
    });
  }

  joinGame(gameId) {
    this.isConnected.then(() => {
      this.connection
        .invoke('JoinToGame', {
          GameId: gameId,
        })
        .then(() => {
          // window.open(`/board?boardSize=${gameData.data.data.boardSize}&scoreToPlay=${gameData.data.data.scoreToPlay}`, '_blank').focus();
          // window.open('/board', '_blank').focus();
          gameData.data.data.activeGame = gameId;
        });
    });
  }

  public get tables() {
    return gameData.data.data.gameTables;
  }

  public get games() {
    return gameData.data.data.gamesHistory;
  }  

  public get lists() {
    return gameData.data.data.joinable;
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
