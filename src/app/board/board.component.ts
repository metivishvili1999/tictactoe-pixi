import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sprite } from 'pixi.js';
import * as pixi from 'pixi.js';
import * as gameData from '../gameData';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  items: any;
  gameState;
  turnIcon;
  public bannerW;
  public bannerL;
  public bannerD;
  public gameWinner;
  isFilled: boolean = false;

  clicked: boolean = true;

  FormBuilder: any;
  gameForm: FormGroup = new FormGroup({});

  public connection: signalR.HubConnection;
  public isConnected: any;
  gameData: any;

  constructor(private route: Router, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
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
            gameData.data.data.activeGame = player.id;
            this.gameState = player.stateId;
            gameData.data.data.playerOne = player.playerOne.userName;
            gameData.data.data.playerTwo = player.playerTwo.userName;
          }
        })[0];
        gameData.data.setboardSize(response[0].boardSize);
        gameData.data.setScore(response[0].targetScore);

        if (gameData.data.data.playerOne === gameData.data.data.user.userName) {
          secondPlayerName.visible = false;
        }
        if (gameData.data.data.playerTwo === gameData.data.data.user.userName) {
          firstPlayerName.visible = false;
        }

        setTimeout(() => {
          firstPlayerName.visible = false;
          secondPlayerName.visible = false;
        }, 8000);
        console.warn(response);
        this.ref.detectChanges();
      });
      this.connection.on(
        'nextturn',
        (response, message, row, column, value) => {
          if (this.gameState === 2) {
            if (response === 1) {
              drawMove(row, column, value, boardsize);

              changeTurnImage();
            } else if (response === -1) {
            }
            console.warn(response, message, row, column, value);
          } else {
          }
        }
      );

      this.connection.on('gameend', (firstPlayerScore, secondPlayerScore, message) => {
        if (firstPlayerScore === gameData.data.data.scoreToPlay) {
          if (gameData.data.data.playerOne === gameData.data.data.user.userName) {
            removeCells();
            updatePlayerOneScore();
            this.bannerW = true;
            seriesWinnerCont.visible = true;
            seriesWinnerText();
            setTimeout(() => {
              this.bannerW = false;
              deleteBoard();
              this.route.navigateByUrl('/lobby');
            }, 5000);
            turnX = !turnX;
          } else if (gameData.data.data.playerTwo === gameData.data.data.user.userName) {
            removeCells();
            updatePlayerOneScore();
            this.bannerL = true;
            seriesLoserText();
            seriesWinnerCont.visible = true;
            setTimeout(() => {
              deleteBoard();
              this.route.navigateByUrl('/lobby');
              this.bannerL = false;
            }, 5000);
            turnX = !turnX;
          }
        }
        if (secondPlayerScore === gameData.data.data.scoreToPlay) {
          if (gameData.data.data.playerOne === gameData.data.data.user.userName) {
            removeCells();
            updatePlayerTwoScore();
            this.bannerL = true;
            winnerCont.visible = false;
            loserCont.visible = false;
            tieCont.visible = false;
            seriesWinnerCont.visible = true;
            seriesLoserText();
            setTimeout(() => {
              deleteBoard();
              this.route.navigateByUrl('/lobby');
            }, 5000);
            turnX = !turnX;
          } else if (gameData.data.data.playerTwo === gameData.data.data.user.userName) {
            removeCells();
            updatePlayerTwoScore();
            this.bannerW = true;
            winnerCont.visible = false;
            loserCont.visible = false;
            tieCont.visible = false;
            seriesWinnerCont.visible = true;
            seriesWinnerText();
            setTimeout(() => {
              deleteBoard();
              this.route.navigateByUrl('/lobby');
            }, 5000);
            turnX = !turnX;
          }
        }
        console.warn(firstPlayerScore, secondPlayerScore, message);
      });

      let firstpoint = 0;
      let secpoint = 0;
      this.connection.on('matchend', (firstPlayerScore, secondPlayerScore, message) => {
        if (firstPlayerScore > firstpoint) {
          firstpoint++;
          if (gameData.data.data.playerOne === gameData.data.data.user.userName) {
            turnOImage.visible = false;
            turnXImage.visible = true;
            removeCells();
            updatePlayerOneScore();
            this.bannerW = true;
            winnerCont.visible = true;
            winnerText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerW = false;
              winnerCont.visible = false;
            }, 3000);
          } else if (gameData.data.data.playerTwo === gameData.data.data.user.userName) {
            turnOImage.visible = false;
            turnXImage.visible = true;
            removeCells();
            updatePlayerOneScore();
            this.bannerL = true;
            loserCont.visible = true;
            loserText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerL = false;
              loserCont.visible = false;
            }, 3000);
          }
        }
        if (secondPlayerScore > secpoint) {
          secpoint++;
          if (gameData.data.data.playerOne === gameData.data.data.user.userName) {
            turnOImage.visible = false;
            turnXImage.visible = true;
            removeCells();
            updatePlayerTwoScore();
            this.bannerL = true;
            loserCont.visible = true;
            loserText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerL = false;
              loserCont.visible = false;
            }, 3000);
          } else if (gameData.data.data.playerTwo === gameData.data.data.user.userName) {
            turnOImage.visible = false;
            turnXImage.visible = true;
            removeCells();
            updatePlayerTwoScore();
            this.bannerW = true;
            winnerCont.visible = true;
            winnerText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerW = false;
              winnerCont.visible = false;
            }, 3000);
          }
        }
        // THAT MEANS TIE
        if (message.length === 11) {
          if (
            gameData.data.data.playerOne === gameData.data.data.user.userName ||
            gameData.data.data.playerTwo === gameData.data.data.user.userName
          ) {
            turnOImage.visible = false;
            turnXImage.visible = true;
            removeCells();
            this.bannerD = true;
            tieCont.visible = true;
            tieText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerD = false;
              tieCont.visible = false;
            }, 3000);
          }
        }
        console.warn(firstPlayerScore, secondPlayerScore, message);
      });

      this.connection.on('matchstart', (gameId, stateId, plTurn) => {
      });
      this.connection.on('ongamecreate', (errorCode, errorMessage) => {
        console.warn(errorCode, errorMessage);
        this.ref.detectChanges();
      });
    }

    let Application = pixi.Application,
      Container = pixi.Container,
      Graphics = pixi.Graphics,
      Text = pixi.Text,
      TextStyle = pixi.TextStyle;

    let
      turnX = true,
      score = {
        player1: 0,
        player2: 0,
        First: 'X',
        Second: 'O',
      };

    let widthX = 600;
    let heightY = 600;

    let app = new Application({
      width: widthX,
      height: heightY,
      backgroundAlpha: 0,
    });

    document.body.appendChild(app.view);

    let style = new TextStyle({
      fontStyle: 'italic',
      fontSize: 36,
      fill: 'white',
    });

    let style1 = new TextStyle({
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fontSize: 24,
      fill: 'white',
    });



    /*---------- CONTAINERS ----------*/

    let gameWrapper = new Container(); // INFO,GAMEBOARD CONT
    app.stage.addChild(gameWrapper);
    gameWrapper.visible = false;

    let gameField: any = new Container(); //BOARD CONT
    gameWrapper.addChild(gameField);
    gameField.position.set(93, 150);

    let winnerCont = new Container();
    app.stage.addChild(winnerCont);
    winnerCont.visible = false;

    let loserCont = new Container();
    app.stage.addChild(loserCont);
    loserCont.visible = false;

    let tieCont = new Container();
    app.stage.addChild(tieCont);
    tieCont.visible = false;

    let seriesWinnerCont = new Container();
    app.stage.addChild(seriesWinnerCont);
    seriesWinnerCont.visible = false;




    /* ---------- GAME INFO ---------- */
    let scoreText = new Text('Target score:', style1);
    gameWrapper.addChild(scoreText);
    scoreText.position.set(300, 70);

    let scoreLine = new Graphics();
    gameWrapper.addChild(scoreLine);
    scoreLine.lineStyle(3, 0xffffff, 1);
    scoreLine.moveTo(100, 60);
    scoreLine.lineTo(515, 60);
    scoreLine.alpha = 0.3;

    let firstPlayerName = new Text(
      gameData.data.data.user.userName + ', You are playing as ' + score.First,
      style1
    );
    gameWrapper.addChild(firstPlayerName);
    firstPlayerName.position.set(100, 20);

    let secondPlayerName = new Text(
      gameData.data.data.user.userName + ', You are playing as ' + score.Second,
      style1
    );
    gameWrapper.addChild(secondPlayerName);
    secondPlayerName.position.set(100, 20);

    let player1 = new Text('Player X:', style1);
    gameWrapper.addChild(player1);
    player1.position.set(100, 70);

    let playerOneScoreText = new Text(score.player1, style1);
    gameWrapper.addChild(playerOneScoreText);
    playerOneScoreText.position.set(210, 69);

    let player2 = new Text('Player O:', style1);
    gameWrapper.addChild(player2);
    player2.position.set(100, 110);

    let playerTwoScoreText = new Text(score.player2, style1);
    gameWrapper.addChild(playerTwoScoreText);
    playerTwoScoreText.position.set(210, 109);

    let currentTurnText = new Text('Turn:', style1);
    gameWrapper.addChild(currentTurnText);
    currentTurnText.position.set(300, 110);

    let turnXImage: Sprite = Sprite.from('assets/images/X.png');
    currentTurnText.addChild(turnXImage);
    turnXImage.scale.set(0.3);
    turnXImage.position.set(70, 3);

    let turnOImage: Sprite = Sprite.from('assets/images/O.png');
    currentTurnText.addChild(turnOImage);
    turnOImage.scale.set(0.3);
    turnOImage.position.set(70, 3);
    turnOImage.visible = false;


    let scoretoplay = gameData.data.data.scoreToPlay;
    let boardsize = gameData.data.data.boardSize;
    let squareSize = 400 / Math.sqrt(boardsize);

    let targetScore = (scoretoplay) => {
      var tScore = new Text(scoretoplay, style1);
      tScore.position.set(450, 70);
      gameWrapper.addChild(tScore);
    };

    let addCells = (boardsize) => {
      for (let i = 0; i < boardsize; i++) {
        let cell = new Container();
        gameField.addChild(cell);
        gameField.setChildIndex(cell, i);
        var bg = new pixi.Sprite(pixi.Texture.WHITE);
        bg.position.set(0, 0);
        bg.alpha = 0.1;
        cell['name'] = i.toString();
        bg.width = squareSize;
        bg.height = squareSize;
        cell.addChild(bg);
        // THAT CREATES  ANY BOARDSIZE IN 400PX WITH 5PX MARGINS BETWEEN CELLS
        cell.x = (i % Math.sqrt(boardsize)) * (squareSize + 5);
        cell.y = Math.floor(i / Math.sqrt(boardsize)) * (squareSize + 5);
        cell.interactive = true;
        cell.on('click', () => {
          addValue(cell);
        });
      }
    };

    const getCell = (boardSize, gameCell) => {
      let index = Math.sqrt(boardSize);

      let currentCell = 0;
      for (let r = 0; r < index; r++) {
        for (let c = 0; c < index; c++) {
          if (currentCell === gameCell) {
            return { row: r, column: c };
          }
          if (c != index - 1) {
            currentCell += 1;
          }
        }
        currentCell += 1;
      }
      throw 'invalid gameCell';
    };

    let removeCells = () => {
      for (var i = gameField.children.length - 1; i >= 0; i--) {
        gameField.removeChild(gameField.children[i]);
      }
    };

    // CREATING BOARD WITH CHOSEN PARAMETERS
    addCells(boardsize);
    targetScore(scoretoplay);
    gameWrapper.visible = true;


    let winnerText = () => {
      let winner = new Text('You won this match', style);
      winnerCont.addChild(winner);
      winner.position.set(100, 400);
    };

    let loserText = () => {
      let loser = new Text('You Lose this match', style);
      loserCont.addChild(loser);
      loser.position.set(100, 400);
    };

    let tieText = () => {
      let tie = new Text('Tie game', style);
      tieCont.addChild(tie);
      tie.position.set(200, 400);
    };

    let seriesWinnerText = () => {
      let swinner = new Text('You won this Series', style);
      seriesWinnerCont.addChild(swinner);
      swinner.position.set(100, 400);
    };

    let seriesLoserText = () => {
      let sloser = new Text('You Lose this Series', style);
      seriesWinnerCont.addChild(sloser);
      sloser.position.set(100, 400);
    };


    let drawMove = (row, column, value, boardSize) => {
      var index = Math.sqrt(boardSize);
      let childIndex = 0;
      let isBreak = false;
      for (let r = 0; r < index; r++) {
        for (let c = 0; c < index; c++) {
          if (row == r && column == c) {
            isBreak = true;
            break;
          }
          childIndex++;
        }
        if (isBreak) {
          break;
        }
      }
      let cell = gameField.getChildAt(childIndex);
      if (cell.isFilled) {
        return;
      }

      let x: Sprite = Sprite.from(`assets/images/${value}.png`);
      x.width = squareSize;
      x.height = squareSize;
      x.position.x = squareSize / 10;
      x.position.y = squareSize / 10;
      cell.addChild(x);
      cell.isFilled = true;
      cell.value = value;

      let o: Sprite = Sprite.from(`assets/images/${value}.png`);
      o.width = squareSize;
      o.height = squareSize;
      o.position.x = squareSize / 10;
      o.position.y = squareSize / 10;
      cell.addChild(o);
      cell.isFilled = true;
      cell.value = value;
    };

    let addValue = (cell) => {
      if (turnX && !this.clicked && !cell.isFilled) {
        let x: Sprite = Sprite.from('assets/images/X.png');
        x.width = squareSize;
        x.height = squareSize;
        x.position.x = squareSize / 10;
        x.position.y = squareSize / 10;
        cell.addChild(x);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'x';
        cell.interactive = false;
      }

      if (!turnX && !this.clicked && !cell.isFilled) {
        let o: Sprite = Sprite.from('assets/images/O.png');
        o.width = squareSize;
        o.height = squareSize;
        o.position.x = squareSize / 10;
        o.position.y = squareSize / 10;
        cell.addChild(o);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'o';
        cell.interactive = false;
      }
      let index = Number.parseInt(cell.name);
      let { row, column } = getCell(boardsize, index);
      this.sendMove(row, column);
    };

    let changeTurnImage = () => {
      if (this.clicked) {
        turnXImage.visible = !turnXImage.visible;
        turnOImage.visible = !turnOImage.visible;
      }
    };

    let updatePlayerOneScore = () => {
      playerOneScoreText.text = ++score.player1;
    };

    let updatePlayerTwoScore = () => {
      playerTwoScoreText.text = ++score.player2;
    };

    let deleteBoard = () => {
      document.body.removeChild(app.view);
    };
  }

  sendMove(row, column) {
    this.isConnected.then(() => {
      this.connection
        .invoke('MakeMove', {
          GameId: gameData.data.data.activeGame,
          Row: row,
          Column: column,
        })
        .catch((err) => console.error(err));
    });
  }

  public get tables() {
    return gameData.data.data.gameTables;
  }
}
