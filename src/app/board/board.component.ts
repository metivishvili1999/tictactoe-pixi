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
  public posX;
  public posY;
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


        this.connection.on('getcurrentgame', (response, playerId) => {
          response.playerOne.userName == gameData.data.data.playerOne;
          response.playerTwo.userName == gameData.data.data.playerTwo;
          
          if(response.playerOne.userName === gameData.data.data.user.userName) {
            firstPlayerName.visible = true;
            secondPlayerName.visible = false;
          }

          console.warn(response, playerId);
        });

        
      this.connection.on('getallgame', (response) => {
        gameData.data.data.gameTables = response;

        response.filter((player) => {
          if (
            player.playerOne.userName == gameData.data.data.user.userName ||
            player.playerTwo.userName == gameData.data.data.user.userName
          ) {
            gameData.data.data.activeGame = player.gameId;
            this.gameState = player.stateId;
          }


        })[0];
        gameData.data.setboardSize(response[0].boardSize);
        gameData.data.setScore(response[0].targetScore);

        console.warn(gameData.data.data.playerTwo, gameData.data.data.user.userName)
        console.warn(response);
        this.ref.detectChanges();
      });


      setTimeout(() => {
        firstPlayerName.visible = false;
        secondPlayerName.visible = false;
      }, 5000);
      
      
      this.connection.on(
        'nextturn',
        (response, gameid, message, row, column, value) => {
          if (response === 1) {
            gameData.data.data.posX = row;
            gameData.data.data.posY = column;
            if (move) {
              movePosX;
              movePosY = movePosY + 25;
              move = !move;
              movePosX = movePosX - 60;
            } else if (!move) {
              movePosY;
              movePosX = movePosX + 60;
              move = !move;
            }
            drawMove(row, column, value, boardsize);
              moveHistory();
            changeTurnImage();
          } else if (response === -1) {
            popup();
          }
          console.warn(response, message, row, column, value);
        }
      );

      this.connection.on(
        'gameend',
        (gameId, firstPlayerScore, secondPlayerScore, message) => {
          if (firstPlayerScore === gameData.data.data.scoreToPlay) {
            if (
              gameData.data.data.playerOne === gameData.data.data.user.userName
            ) {
              removeCells();
              updatePlayerOneScore();
              this.bannerW = true;
              seriesWinnerCont.visible = true;
              seriesWinnerText();
              setTimeout(() => {
                this.bannerW = false;
                deleteBoard();
                removeHistory();
                document.body.removeChild;
                this.route.navigateByUrl('/lobby');
              }, 5000);
              turnX = !turnX;
            } else if (
              gameData.data.data.playerTwo === gameData.data.data.user.userName
            ) {
              removeCells();
              updatePlayerOneScore();
              this.bannerL = true;
              seriesLoserText();
              seriesWinnerCont.visible = true;
              setTimeout(() => {
                deleteBoard();
                removeHistory();
                this.route.navigateByUrl('/lobby');
                this.bannerL = false;
              }, 5000);
              turnX = !turnX;
            }
          }
          if (secondPlayerScore === gameData.data.data.scoreToPlay) {
            if (
              gameData.data.data.playerOne === gameData.data.data.user.userName
            ) {
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
                removeHistory();
                this.route.navigateByUrl('/lobby');
              }, 5000);
              turnX = !turnX;
            } else if (
              gameData.data.data.playerTwo === gameData.data.data.user.userName
            ) {
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
                removeHistory();
                this.route.navigateByUrl('/lobby');
              }, 5000);
              turnX = !turnX;
            }
          }
          console.warn(firstPlayerScore, secondPlayerScore, message);
        }
      );

      let firstpoint = 0;
      let secpoint = 0;

      
      this.connection.on(
        'matchend',
        (gameId, firstPlayerScore, secondPlayerScore, message) => {
          console.warn(gameData.data.data.playerOne, gameData.data.data.playerTwo)
          if (firstPlayerScore > firstpoint) {
            firstpoint++;
            move = !move;
            if (
              gameData.data.data.playerOne === gameData.data.data.user.userName
            ) {
              turnOImage.visible = false;
              turnXImage.visible = true;
              removeCells();
              updatePlayerOneScore();
              this.bannerW = true;
              winnerCont.visible = true;
              winnerText();
              setTimeout(() => {
                addCells(boardsize);
                removeHistory();
                this.bannerW = false;
                winnerCont.visible = false;
                gameWrapper.visible = true;
              }, 3000);
            } else if (
              gameData.data.data.playerTwo === gameData.data.data.user.userName
            ) {
              turnOImage.visible = false;
              turnXImage.visible = true;
              removeCells();
              updatePlayerOneScore();
              this.bannerL = true;
              loserCont.visible = true;
              loserText();
              setTimeout(() => {
                addCells(boardsize);
                removeHistory();
                this.bannerL = false;
                loserCont.visible = false;
                gameWrapper.visible = true;
              }, 3000);
            }
          }
          if (secondPlayerScore > secpoint) {
            secpoint++;
            move = !move;
            if (
              gameData.data.data.playerOne === gameData.data.data.user.userName
            ) {
              turnOImage.visible = false;
              turnXImage.visible = true;
              removeCells();
              updatePlayerTwoScore();
              this.bannerL = true;
              loserCont.visible = true;
              loserText();
              setTimeout(() => {
                addCells(boardsize);
                removeHistory();
                this.bannerL = false;
                loserCont.visible = false;
                gameWrapper.visible = true;
              }, 3000);
            } else if (
              gameData.data.data.playerTwo === gameData.data.data.user.userName
            ) {
              turnOImage.visible = false;
              turnXImage.visible = true;
              removeCells();
              updatePlayerTwoScore();
              this.bannerW = true;
              winnerCont.visible = true;
              winnerText();
              setTimeout(() => {
                addCells(boardsize);
                removeHistory();
                this.bannerW = false;
                winnerCont.visible = false;
                gameWrapper.visible = true;
              }, 3000);
            }
          }
          // THAT MEANS TIE
          if (message.length === 11) {
            if (
              gameData.data.data.playerOne ===
                gameData.data.data.user.userName ||
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
                removeHistory();
                this.bannerD = false;
                tieCont.visible = false;
              }, 3000);
            }
          }
          console.warn(firstPlayerScore, secondPlayerScore, message);
        }
      );

      this.connection.on('onreconnected',(joinableList) => {
        gameData.data.data.joinable = joinableList;
        this.ref.detectChanges();
        console.warn(joinableList)
      })

      this.connection.on('getmovehistory', (moveList, userName) => {
        if(moveList[0] === 1) {
          console.warn('Fiirst')
        }
        console.warn(moveList, userName)
      })

      this.connection.on('matchstart', (gameId) => {
        console.warn(gameId);
      });
      this.connection.on('ongamecreate', (errorCode, errorMessage) => {
        console.warn(errorCode, errorMessage);
        this.ref.detectChanges();
      });

      this.connection.on('ongamejoin', (errorCode, gameId, errMessage, username) => {
        console.warn(errorCode, gameId, errMessage, username);
      });

    }
    
    let Application = pixi.Application,
      Container = pixi.Container,
      Graphics = pixi.Graphics,
      Text = pixi.Text,
      TextStyle = pixi.TextStyle;

    let turnX = true,
      move = true,
      score = {
        player1: 0,
        player2: 0,
        First: 'X',
        Second: 'O',
      };

    let widthX = 600;
    let heightY = 650;

    let app = new Application({
      width: widthX,
      height: heightY,
      backgroundAlpha: 0,
    });

    document.body.appendChild(app.view);

    let container = new pixi.Container();
    app.stage.addChild(container);

    container.x = 0;
    container.y = 0;

    container.pivot.x = 0;
    container.pivot.y = 0;

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
    container.addChild(gameWrapper);
    gameWrapper.visible = false;

    let historyCont = new Container();
    gameWrapper.addChild(historyCont);

    let gameField: any = new Container(); //BOARD CONT
    gameWrapper.addChild(gameField);
    gameField.position.set(50, 150);

    let winnerCont = new Container();
    container.addChild(winnerCont);
    winnerCont.visible = false;

    let loserCont = new Container();
    container.addChild(loserCont);
    loserCont.visible = false;

    let tieCont = new Container();
    container.addChild(tieCont);
    tieCont.visible = false;

    let seriesWinnerCont = new Container();
    container.addChild(seriesWinnerCont);
    seriesWinnerCont.visible = false;

    /* ---------- GAME INFO ---------- */
    let scoreText = new Text('Target score:', style1);
    gameWrapper.addChild(scoreText);
    scoreText.position.set(210, 70);
    scoreText.alpha = 0.6;

    let scoreLine = new Graphics();
    gameWrapper.addChild(scoreLine);
    scoreLine.lineStyle(3, 0xffffff, 1);
    scoreLine.moveTo(50, 60);
    scoreLine.lineTo(550, 60);
    scoreLine.alpha = 0.3;

    let firstPlayerName = new Text(
      gameData.data.data.user.userName + ', You are playing as X',
      style1
    );
    gameWrapper.addChild(firstPlayerName);
    firstPlayerName.position.set(50, 20);
    firstPlayerName.visible = false;

    let secondPlayerName = new Text(
      gameData.data.data.user.userName + ', You are playing as O',
      style1
    );
    gameWrapper.addChild(secondPlayerName);
    secondPlayerName.position.set(50, 20);

    if(gameData.data.data.user.userName === gameData.data.data.playerTwo) {
      secondPlayerName.visible = true;

    }

      

    let player1 = new Text('Player X:', style1);
    gameWrapper.addChild(player1);
    player1.position.set(50, 70);
    player1.alpha = 0.6;

    let playerOneScoreText = new Text(score.player1, style1);
    gameWrapper.addChild(playerOneScoreText);
    playerOneScoreText.position.set(160, 69);

    let player2 = new Text('Player O:', style1);
    gameWrapper.addChild(player2);
    player2.position.set(50, 110);
    player2.alpha = 0.6;

    let playerTwoScoreText = new Text(score.player2, style1);
    gameWrapper.addChild(playerTwoScoreText);
    playerTwoScoreText.position.set(160, 109);

    let currentTurnText = new Text('Turn:', style1);
    gameWrapper.addChild(currentTurnText);
    currentTurnText.position.set(210, 110);
    currentTurnText.alpha = 0.6;

    let turnXImage: Sprite = Sprite.from('assets/images/X.png');
    currentTurnText.addChild(turnXImage);
    turnXImage.scale.set(0.3);
    turnXImage.position.set(70, 3);
    turnXImage.alpha = 1;

    let turnOImage: Sprite = Sprite.from('assets/images/O.png');
    currentTurnText.addChild(turnOImage);
    turnOImage.scale.set(0.3);
    turnOImage.position.set(70, 3);
    turnOImage.alpha = 1;
    turnOImage.visible = false;

    let historyText = new Text('History', style1);
    gameWrapper.addChild(historyText);
    historyText.position.set(500, 150);
    historyText.alpha = 0.6;

    let historyLine = new Graphics();
    gameWrapper.addChild(historyLine);
    historyLine.lineStyle(3, 0xffffff, 1);
    historyLine.moveTo(540, 185);
    historyLine.lineTo(540, 560);
    historyLine.alpha = 0.3;

    let moveX: Sprite = Sprite.from('assets/images/X.png');
    gameWrapper.addChild(moveX);
    moveX.scale.set(0.3);
    moveX.position.set(505, 185);

    let moveO: Sprite = Sprite.from('assets/images/O.png');
    gameWrapper.addChild(moveO);
    moveO.scale.set(0.3);
    moveO.position.set(550, 185);

    let movePosY = 190;
    let movePosX = 550;

    let moveHistory = () => {
      var move = new Text(
        '[' + gameData.data.data.posX + ',' + gameData.data.data.posY + ']',
        style1
      );
      historyCont.addChild(move);
      move.position.set(movePosX, movePosY);
      move.scale.set(0.8);
    };

    let scoretoplay = gameData.data.data.scoreToPlay;
    let boardsize = gameData.data.data.boardSize;
    let squareSize = 400 / Math.sqrt(boardsize);

    let targetScore = (scoretoplay) => {
      var tScore = new Text(scoretoplay, style1);
      tScore.position.set(355, 70);
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
        cell.on('pointertap', () => {
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

    let removeHistory = () => {
      for (var i = historyCont.children.length - 1; i >= 0; i--) {
        historyCont.removeChild(historyCont.children[i]);
        movePosY = 190;
        movePosX = 550;
      }
    };

    // CREATING BOARD WITH CHOSEN PARAMETERS
    addCells(boardsize);
    targetScore(scoretoplay);
    gameWrapper.visible = true;

    let winnerText = () => {
      let winner = new Text('You won this match', style);
      winnerCont.addChild(winner);
      winner.position.set(140, 160);
      gameWrapper.visible = false;
    };

    let loserText = () => {
      let loser = new Text('You Lose this match', style);
      loserCont.addChild(loser);
      loser.position.set(140, 160);
      gameWrapper.visible = false;
    };

    let tieText = () => {
      let tie = new Text('Tie game', style);
      tieCont.addChild(tie);
      tie.position.set(180, 160);
      gameWrapper.visible = false;
    };

    let seriesWinnerText = () => {
      let swinner = new Text('You won this Series', style);
      seriesWinnerCont.addChild(swinner);
      swinner.position.set(130, 160);
    };

    let seriesLoserText = () => {
      let sloser = new Text('You Lose this Series', style);
      seriesWinnerCont.addChild(sloser);
      sloser.position.set(130, 160);
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

    let popup = () => {
      var pop = new Text('Wait for your Turn!', style1);
      pop.position.set(200, 10);
      gameWrapper.addChild(pop);
      setTimeout(() => {
        pop.visible = false;
      }, 700);
    };
  }

  sendMove(row, column) {
    this.isConnected.then(() => {
      this.connection
        .invoke('MakeMove', {
          gameId: gameData.data.data.activeGame,
          Row: row,
          Column: column,
        })
        .catch((err) => console.error(err));
    });

    
  }

  public get tables() {
    return gameData.data.data.gameTables;
  }

  // reconnect(gameId) {
  //   this.isConnected.then(() => {
  //     this.connection
  //       .invoke('OnReconnected', {
  //         GameId: gameId
  //       })
  //       .then(() => {
  //         gameData.data.data.activeGame = gameId;
  //       });
  //     this.route.navigateByUrl('/board').catch((err) => console.error(err));
  //     console.warn(gameId);
  //   });
  // }
}


