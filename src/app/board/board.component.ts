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
  public app;
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
            gameData.data.data.activeGame = player.gameId;
            this.gameState = player.stateId;
          }
        })[0];
        if (response) {
          gameData.data.setboardSize(response[0].boardSize);
          gameData.data.setScore(response[0].targetScore);
          this.ref.detectChanges();
        }
      });

      this.connection.on('nextturn',(response, gameid, message, row, column, value) => {
          if (response === 1) {
            gameData.data.data.posX = row;
            gameData.data.data.posY = column;
            drawMove(row, column, value, boardsize);
            changeTurnImage();
          } else if (response === -1) {
            popup();
          }
        }
      );

      this.connection.on('gameend',(gameId, firstPlayerScore, secondPlayerScore, firstplayer, secondplayer, message) => {
        if (firstPlayerScore === gameData.data.data.scoreToPlay) {
          // gameData.data.data.boardSize = 0;
          // gameData.data.data.scoreToPlay = 0;
          this.connection.stop();
          gameData.data.data.firstpoint = 0;
          gameData.data.data.secpoint = 0;
            removeCells();
            gameWrapper.visible = false;
            seriesWinnerCont.visible = true;
              if (firstplayer === gameData.data.data.user.userName) {
                this.bannerW = true;
                seriesWinnerText();
                endOfSeries();
                turnX = !turnX;
              } else if (secondplayer === gameData.data.data.user.userName) {
                this.bannerL = true;
                seriesLoserText();
                endOfSeries();
                turnX = !turnX;
              }
        }
        if (secondPlayerScore === gameData.data.data.scoreToPlay) {
          // gameData.data.data.boardSize = 0;
          // gameData.data.data.scoreToPlay = 0;
          this.connection.stop();
          gameData.data.data.firstpoint = 0;
          gameData.data.data.secpoint = 0;
          console.warn(gameData.data.data.firstpoint, gameData.data.data.secpoint)
          seriesWinnerCont.visible = true;
          gameWrapper.visible = false;
          winnerCont.visible = false;
          loserCont.visible = false;
          tieCont.visible = false;
          removeCells();
            if (firstplayer === gameData.data.data.user.userName) {
              this.bannerL = true;
              seriesLoserText();
              endOfSeries();
              turnX = !turnX;
            } else if (secondplayer === gameData.data.data.user.userName) {
              this.bannerW = true;
              seriesWinnerText();
              endOfSeries();
              turnX = !turnX;
            }
        }
      }

    );

      this.connection.on('matchend',(gameId, firstPlayerScore, secondPlayerScore, firstplayer, secondplayer, message) => {
        if (firstPlayerScore > gameData.data.data.firstpoint && firstPlayerScore !== gameData.data.data.scoreToPlay) {
          gameData.data.data.firstpoint++;
          turnOImage.visible = false;
          turnXImage.visible = true;
          removeCells();
          updatePlayerOneScore();
          updatePlayersScores();
          if (firstplayer === gameData.data.data.user.userName) {
            this.bannerW = true;
            winnerCont.visible = true;
            winnerText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerW = false;
              winnerCont.visible = false;
              gameWrapper.visible = true;
            }, 3000);
          } else if (secondplayer === gameData.data.data.user.userName) {
            this.bannerL = true;
            loserCont.visible = true;
            loserText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerL = false;
              loserCont.visible = false;
              gameWrapper.visible = true;
            }, 3000);
          }
        }

        if (secondPlayerScore > gameData.data.data.secpoint && secondPlayerScore !== gameData.data.data.scoreToPlay) {
          gameData.data.data.secpoint++;
          turnOImage.visible = false;
          turnXImage.visible = true;
          removeCells();
          updatePlayerTwoScore();
          updatePlayersScores();
          if (firstplayer === gameData.data.data.user.userName) {
            this.bannerL = true;
            loserCont.visible = true;
            loserText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerL = false;
              loserCont.visible = false;
              gameWrapper.visible = true;
            }, 3000);
          } else if (secondplayer === gameData.data.data.user.userName) {
            this.bannerW = true;
            winnerCont.visible = true;
            winnerText();
            setTimeout(() => {
              addCells(boardsize);
              this.bannerW = false;
              winnerCont.visible = false;
              gameWrapper.visible = true;
            }, 3000);
          }
        }

        // THAT MEANS TIE
        if (message.length === 11) {
          if (gameData.data.data.playerOne === gameData.data.data.user.userName ||
            gameData.data.data.playerTwo === gameData.data.data.user.userName) {
            turnOImage.visible = false;
            turnXImage.visible = true;
            removeCells();
            this.bannerD = true;
            tieCont.visible = true;
            tieText();
            setTimeout(() => {
              gameWrapper.visible = true;
              addCells(boardsize);
              this.bannerD = false;
              tieCont.visible = false;
            }, 3000);
          }
        }
      }
    );

      this.connection.on('onreconnected', (joinableList, dict, userId) => {
        gameData.data.data.joinable = joinableList;
        this.ref.detectChanges();
      });

      this.connection.on('alert', (code, message) => {
        if (code === -1) {
          // showPopUp();
          console.warn(code)
        } else if (code === 1) {
          // hidePopUp();
          console.warn(code)
        } else if (code === 2) {
          this.connection.stop();
          removeCells();
          gameWrapper.visible = false;
          seriesWinnerCont.visible = true;
          this.bannerW = true;
          seriesWinnerText();
          endOfSeries();
          turnX = !turnX;
          console.warn(code)
        }

        this.ref.detectChanges();
        console.warn(code, message);
      });

      this.connection.on('matchstart', (gameId) => {
        
      });

      this.connection.on('ongamecreate', (errorCode, errorMessage) => {
        this.ref.detectChanges();
      });

      this.connection.on('ongamejoin',(errorCode, gameId, errMessage, username) => {
        waitForOpp.visible= false;
        let oppConnected = new Text(gameData.data.data.sec + ' Connected, your Turn!', style3);
        gameWrapper.addChild(oppConnected);
        oppConnected.anchor.x = 0.5;
        oppConnected.position.set(227.5,0);

        setTimeout(() => {
          oppConnected.visible = false;
        },3000 )
        }
      );
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

    let widthX = 455;
    let heightY = 650;

    this.app = new Application({
      width: widthX,
      height: heightY,
      backgroundAlpha: 0,
    });

    document.body.appendChild(this.app.view);

    let container = new pixi.Container();
    this.app.stage.addChild(container);

    container.x = 0;
    container.y = 0;

    container.pivot.x = 0;
    container.pivot.y = 0;

    let style = new TextStyle({
      fontStyle: 'italic',
      fontSize: 36,
      fill: 'white',
    });

    let series = new TextStyle({
      fontStyle: 'italic',
      fontSize: 36,
      fill: 'grey',
    });

    let style1 = new TextStyle({
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fontSize: 24,
      fill: 'white',
    });

    let style2 = new TextStyle({
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fontSize: 22,
      fill: 'white',
    });

    let style3 = new TextStyle({
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fontSize: 22,
      fill: 'green',
    });

    let style4 = new TextStyle({
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fontSize: 22,
      fill: 'orange',
    });


    /*---------- CONTAINERS ----------*/
    let gameWrapper = new Container(); // INFO,GAMEBOARD CONT
    container.addChild(gameWrapper);
    gameWrapper.visible = false;

    let gameField: any = new Container(); //BOARD CONT
    gameWrapper.addChild(gameField);
    gameField.position.set(20, 150);

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
    setTimeout(() => {
      drawMovesHistory();
      if(gameData.data.data.rejoined === true) {
        updatePlayersScores();
      }
    }, 100);

    let scoreText = new Text('Target score:', style1);
    gameWrapper.addChild(scoreText);
    scoreText.position.set(210, 80);
    scoreText.alpha = 0.6;

    let scoreLine = new Graphics();
    gameWrapper.addChild(scoreLine);
    scoreLine.lineStyle(3, 0xffffff, 1);
    scoreLine.moveTo(20, 60);
    scoreLine.lineTo(435, 60);
    scoreLine.alpha = 0.3;

    let firstPlayerName = new Text(
        gameData.data.data.user.userName +
        ', You are playing as X',
      style2
    );
    gameWrapper.addChild(firstPlayerName);
    firstPlayerName.anchor.x = 0.5;
    firstPlayerName.position.set(227.5, 30);
    firstPlayerName.visible = false;

    let secondPlayerName = new Text(
      gameData.data.data.user.userName + ', You are playing as O',
      style2
    );
    gameWrapper.addChild(secondPlayerName);
    secondPlayerName.anchor.x = 0.5;
    secondPlayerName.position.set(227.5, 30);
    secondPlayerName.visible = false;


    let waitForOpp = new Text('Waiting for your Opponent!', style4);
    gameWrapper.addChild(waitForOpp);
    waitForOpp.anchor.x = 0.5;
    waitForOpp.position.set(227.5, 0);
    

    if(gameData.data.data.rejoined === true && !gameData.data.data.sec) {
      waitForOpp.visible = false;
    }


    if (gameData.data.data.playerOne === gameData.data.data.user.userName) {
      firstPlayerName.visible = true;
    }
    if(gameData.data.data.sec ) {
      let yourOpp = new Text('You are playing against ' + gameData.data.data.first, style4);
      gameWrapper.addChild(yourOpp);
      yourOpp.anchor.x = 0.5;
      yourOpp.position.set(227.5, 0);
      setTimeout(() => {
        yourOpp.visible = false;
      }, 3000)
      waitForOpp.visible = false;
      secondPlayerName.visible = true;
    }

    setTimeout(() => {
    firstPlayerName.visible = false;
    secondPlayerName.visible = false;
    }, 5000);


    let player1 = new Text('Player X:', style1);
    gameWrapper.addChild(player1);
    player1.position.set(30, 81);
    player1.alpha = 0.6;

    let playerOneScoreText = new Text(score.player1, style1);
    gameWrapper.addChild(playerOneScoreText);
    playerOneScoreText.position.set(133, 80);

    let player2 = new Text('Player O:', style1);
    gameWrapper.addChild(player2);
    player2.position.set(30, 115);
    player2.alpha = 0.6;

    let playerTwoScoreText = new Text(score.player2, style1);
    gameWrapper.addChild(playerTwoScoreText);
    playerTwoScoreText.position.set(133, 115);

    let currentTurnText = new Text('Turn:', style1);
    gameWrapper.addChild(currentTurnText);
    currentTurnText.position.set(210, 115);
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

    let boardsize = gameData.data.data.boardSize;
    let scoretoplay = gameData.data.data.scoreToPlay;
    let squareSize = 400 / Math.sqrt(boardsize);

    let targetScore = (scoretoplay) => {
      var tScore = new Text(scoretoplay, style1);
      tScore.position.set(355, 80);
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
        cell.on('pointertap', (value) => {
          addValue(cell, value);
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
      winner.anchor.x = 0.5
      winner.position.set(227.5, 160);
      gameWrapper.visible = false;
    };

    let loserText = () => {
      let loser = new Text('You Lose this match', style);
      loserCont.addChild(loser);
      loser.anchor.x = 0.5
      loser.position.set(227.5, 160);
      gameWrapper.visible = false;
    };

    let tieText = () => {
      let tie = new Text('Tie game', style);
      tieCont.addChild(tie);
      tie.anchor.x = 0.5;
      tie.position.set(227.5, 160);
      gameWrapper.visible = false;
    };

    let endOfSeries = () => {
      // gameData.data.data.firstpoint = 0;
      // gameData.data.data.secpoint = 0;
      let lobby = new Text('Lobby', series);
      seriesWinnerCont.addChild(lobby);
      lobby.anchor.x = 0.5;
      lobby.position.set(227.5, 200);
      lobby.interactive = true;
      lobby.buttonMode = true;
      lobby.on('pointertap', () => {
        this.bannerW = false;
        deleteBoard();
        gameData.data.data.sec = '';
        playerOneScoreText.text = 0;
        playerTwoScoreText.text = 0;
        document.body.removeChild;
        this.route.navigateByUrl('/lobby');
      });
    }

    let seriesWinnerText = () => {
      let swinner = new Text('You won this Series', style);
      seriesWinnerCont.addChild(swinner);
      swinner.anchor.x = 0.5;
      swinner.position.set(227.5, 160);
    };

    let seriesLoserText = () => {
      let sloser = new Text('You Lose this Series', style);
      seriesWinnerCont.addChild(sloser);
      sloser.anchor.x = 0.5;
      sloser.position.set(227.5, 160);
    };

    const drawMove = (row, column, value, boardSize) => {
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
        if (childIndex === boardSize) {
          childIndex = childIndex;
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

    let addValue = (cell, value) => {
      if (turnX && !this.clicked && !cell.isFilled) {
        let x: Sprite = Sprite.from(`assets/images/${value}.png`);
        x.width = squareSize;
        x.height = squareSize;
        x.position.x = squareSize / 10;
        x.position.y = squareSize / 10;
        cell.addChild(x);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'X';
        cell.interactive = false;
      }

      if (!turnX && !this.clicked && !cell.isFilled) {
        let o: Sprite = Sprite.from(`assets/images/${value}.png`);
        o.width = squareSize;
        o.height = squareSize;
        o.position.x = squareSize / 10;
        o.position.y = squareSize / 10;
        cell.addChild(o);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'O';
        cell.interactive = false;
      }
      let index = Number.parseInt(cell.name);
      let { row, column } = getCell(boardsize, index);
      this.sendMove(row, column);
    };

    const drawMovesHistory = () => {
      let movesHistoryArray = gameData.data.data.movesHistory;
      let movesArraySqrt = Math.sqrt(movesHistoryArray.length);
      let row = 0;
      let column = 0;
      let value = '';

      for (let i = 0; i < movesHistoryArray.length; i++) {
        if (i % movesArraySqrt == 0) {
          row = i / movesArraySqrt;
          column = i - row * movesArraySqrt;
          value =
            movesHistoryArray[i] == 0
              ? 'O'
              : movesHistoryArray[i] == 1
              ? 'X'
              : '';
          if (value !== '') {
            drawMove(row, column, value, movesHistoryArray.length);
          }
        } else {
          value =
            movesHistoryArray[i] == 0
              ? 'O'
              : movesHistoryArray[i] == 1
              ? 'X'
              : '';
          column = i - row * movesArraySqrt;
          if (value !== '') {
            drawMove(row, column, value, movesHistoryArray.length);
          }
        }
      }
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

    let updatePlayersScores = () => {
      playerOneScoreText.text = gameData.data.data.firstpoint;
      playerTwoScoreText.text = gameData.data.data.secpoint;
    }

    let deleteBoard = () => {
      document.body.removeChild(this.app.view);
    };

    let popup = () => {
      var pop = new Text('Wait for your Turn!', style1);
      pop.anchor.x = 0.5;
      pop.position.set(227.5, 10);
      gameWrapper.addChild(pop);
      setTimeout(() => {
        pop.visible = false;
      }, 700);
    };

    function showPopUp() {
      document.getElementById("my-popup").style.display="block";
      var timeleft = 20;
      var downloadTimer = setInterval(function(){
        if(timeleft = 0){
          document.getElementById("my-popup").style.display="none";
          clearInterval(downloadTimer);
        }
         else {
          document.getElementById("my-popup").innerHTML = "Opponent disconnected - "  + timeleft;
        }
        timeleft -= 1;
      }, 1000);
    }

    let hidePopUp = () => {
      document.getElementById("my-popup").style.display="none";
    }

  }

  ngOnDestroy(): void {
    this.app.destroy(true);
    this.connection.stop();
  }

  sendMove(row, column) {
    this.isConnected.then(() => {
      this.connection
        .invoke('MakeMove', {
          gameId: gameData.data.data.activeGame,
          Row: row,
          Column: column,
        })
        .catch((err) => console.error());
    });
  }
}
