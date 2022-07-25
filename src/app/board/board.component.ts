import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Container, Application, Sprite, TextStyle, Texture } from 'pixi.js';
import * as pixi from 'pixi.js';
import * as gameData from '../gameData';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  items: any;
  public bannerW;
  public bannerL;
  public bannerD;
  public gameWinner;


  public get tables() {
    return gameData.data.data.gameTables;
  }

  public connection: signalR.HubConnection
  public isConnected: any;

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.connection = new signalR.HubConnectionBuilder()  
   .configureLogging(signalR.LogLevel.Information)  
   .withUrl('http://172.25.36.202:8085/signalr', {
       accessTokenFactory: () => 
   gameData.data.data.user.sessionId })  
   .build();  

   if(gameData.data.data.user.sessionId != null) {
    this.isConnected = this.connection.start().then(
      function () {
      console.log('SignalR Connected!');
      }
      ).catch(function (err) {  
      return console.error(err.toString());  
      });
   }

    console.warn(gameData.data);
    let Application = pixi.Application,
      Container = pixi.Container,
      Graphics = pixi.Graphics,
      Text = pixi.Text,
      TextStyle = pixi.TextStyle,
      Texture = pixi.Texture;

    let playerOne,
      turnX = true,
      moveCounter = 0,
      score = {
        player1: 0,
        player2: 0,
      };

    let widthX = 600;
    let heightY = 600;

    let app = new Application({
      width: widthX,
      height: heightY,
      backgroundAlpha: 0,
    });

    document.body.appendChild(app.view);

    let loadingScreen = new Container();
    app.stage.addChild(loadingScreen);

    let loadingBg = new pixi.Sprite(Texture.WHITE);
    loadingScreen.addChild(loadingBg);

    setTimeout(() => {
      loadingScreen.visible = false;
    }, 500);

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

    let buttonStyle = new TextStyle({
      fontSize: 32,
      fill: '#b9b4b4',
    });

    /////////////////////////////////////////////////

    let gameWrapper = new Container();
    app.stage.addChild(gameWrapper);

    gameWrapper.visible = false;

    let scoreText = new Text('Target score:', style1);
    gameWrapper.addChild(scoreText);
    scoreText.position.set(300, 70);

    let scoreLine = new Graphics();
    gameWrapper.addChild(scoreLine);
    scoreLine.lineStyle(3, 0xffffff, 1);
    scoreLine.moveTo(100, 60);
    scoreLine.lineTo(515, 60);
    scoreLine.alpha = 0.3;

    let firstP = new Text('Player ', style1);
    gameWrapper.addChild(firstP);
    firstP.position.set(100, 70);

    // let pl1 = 
    // gameWrapper.addChild(pl1);
    // pl1.position.set(430, 150);

    let playerOneScoreText = new Text(score.player1, style1);
    gameWrapper.addChild(playerOneScoreText);
    playerOneScoreText.position.set(210, 69);

    let secondP = new Text('Player Y: ', style1);
    gameWrapper.addChild(secondP);
    secondP.position.set(100, 110);

    let playerTwoScoreText = new Text(score.player2, style1);
    gameWrapper.addChild(playerTwoScoreText);
    playerTwoScoreText.position.set(210, 109);

    let currentTurnText = new Text('Turn:', style1);
    gameWrapper.addChild(currentTurnText);

    currentTurnText.position.set(300, 110);

    let turnXImage: Sprite = Sprite.from('assets/images/x.png');
    currentTurnText.addChild(turnXImage);

    turnXImage.scale.set(0.3);
    turnXImage.position.set(70, 3);

    let turnOImage: Sprite = Sprite.from('assets/images/o.png');
    currentTurnText.addChild(turnOImage);
    turnOImage.scale.set(0.3);
    turnOImage.position.set(70, 3);
    turnOImage.visible = false;

    let gameField: any = new Container();
    let xPositions = [];
    let oPositions = [];
    gameWrapper.addChild(gameField);
    gameField.position.set(93, 150);

    let scoretoplay = gameData.data.data.scoreToPlay;
    let boardsize = gameData.data.data.boardSize;
    let numberToWin = Math.sqrt(boardsize);
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
        var bg = new pixi.Sprite(pixi.Texture.WHITE);
        bg.position.set(0, 0);
        bg.alpha = 0.1;
        bg.width = squareSize;
        bg.height = squareSize;
        cell.addChild(bg);
        cell.x = (i % Math.sqrt(boardsize)) * (squareSize + 5);
        cell.y = Math.floor(i / Math.sqrt(boardsize)) * (squareSize + 5);

        cell.interactive = true;
        cell.on('click', () => {
          addValue(cell);
        });
      }
    };

    let removeCells = () => {
      for (var i = gameField.children.length - 1; i >= 0; i--) {
        gameField.removeChild(gameField.children[i]);
      }
    };

    /////////////////// Match Winner Container /////////////////////////
    let gameEndScene = new Container();
    app.stage.addChild(gameEndScene);
    gameEndScene.visible = false;

    addCells(boardsize);
    targetScore(scoretoplay);
    gameWrapper.visible = true;

    let resultText = new Text('', style);
    gameEndScene.addChild(resultText);
    resultText.position.set(180, 150);


    let continueButton = new Text('CONTINUE', buttonStyle);
        continueButton.position.set(220, 220);
        continueButton.interactive = true;
        continueButton.buttonMode = true;
        continueButton
          .on('click', () => {
            gameEndScene.visible = false;
            addCells(boardsize);
            this.bannerD = false;
            this.bannerL = false;
            this.bannerW = false;
            gameWrapper.visible = true;
          })
          .on('pointerdown', (event) => onClick(continueButton))
          .on('pointerover', (event) => onPointerOver(continueButton))
          .on('pointerout', (event) => onPointerOut(continueButton));
        gameEndScene.addChild(continueButton);


        
    ////////////////// Series Winner Container //////////////////////////////////
    let newScene = new Container();
    app.stage.addChild(newScene);
    newScene.visible = false;

    let WinnerText = new Text('Series Winner is:', style);
    newScene.addChild(WinnerText);
    WinnerText.position.set(150, 150);

    let Winner = new Text('', style);
    newScene.addChild(Winner);
    Winner.position.set(430, 150);

    let lobbyButton = new Text('Lobby', buttonStyle);
        lobbyButton.position.set(250, 200);
        lobbyButton.interactive = true;
        lobbyButton.buttonMode = true;
        lobbyButton
          .on('click', () => {
            document.body.removeChild(app.view);
            this.route.navigateByUrl('/lobby');
            this.bannerW = false;
            this.bannerD = false;
            this.bannerL = false;
          })
          .on('pointerover', () => onPointerOver(lobbyButton))
          .on('pointerdown', () => onClick(lobbyButton))
          .on('pointerout', () => onPointerOut(lobbyButton));
        newScene.addChild(lobbyButton);



    let winningPos;
    let numb = boardsize;

    if (numb === 9) {
      winningPos = gameData.data.data.winningPositions.matrix3;
    } else if (numb === 16) {
      winningPos = gameData.data.data.winningPositions.matrix4;
    } else if (numb === 25) {
      winningPos = gameData.data.data.winningPositions.matrix5;
    }

    function onClick(object) {
      object.tint = 0x333333;
    }

    function onPointerOver(object) {
      object.tint = 0x666666;
    }

    function onPointerOut(object) {
      object.tint = 0xffffff;
    }

    let addValue = (cell) => {
      if (turnX && !cell.isFilled) {
        let x: Sprite = Sprite.from('assets/images/x.png');
        x.width = squareSize;
        x.height = squareSize;
        x.position.x = squareSize / 10;
        x.position.y = squareSize / 10;
        cell.addChild(x);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'x';
      }

      if (!turnX && !cell.isFilled) {
        let o: Sprite = Sprite.from('assets/images/o.png');
        o.width = squareSize;
        o.height = squareSize;
        o.position.x = squareSize / 10;
        o.position.y = squareSize / 10;
        cell.addChild(o);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'o';
      }

      checkWin();
    };

    let seriesWinner = () => {
      if (score.player1 === scoretoplay) {
        gameWrapper.visible = false;
        newScene.visible = true;
        gameEndScene.visible = false;
        gameField.visible = false;
        Winner.text = 'X';
        this.bannerW = true;
      } else if (score.player2 === scoretoplay) {
        gameWrapper.visible = false;
        newScene.visible = true;
        gameEndScene.visible = false;
        gameField.visible = false;
        Winner.text = 'O';
        this.bannerL = true;
      }
    };

    let checkWin = () => {
      changeTurnImage();
      incrementCounter();
      if (check_X_win(gameField.children)) {
        resetGame();
      } else if (check_Y_win(gameField.children)) {
        resetGame();
      } else {
        draw();
      }
    };

    let check_X_win = (arr: any): boolean => {
      let xContainers = arr.filter((item: any) => item.value == 'x');
      let isWin = false;
      for (let i = 0; i < xContainers.length; i++) {
        if (!xPositions.includes(arr.indexOf(xContainers[i]))) {
          xPositions.push(arr.indexOf(xContainers[i]));
        }
      }

      for (let i = 0; i < winningPos.length; i++) {
        let count = 0;
        for (let j = 0; j < winningPos[i].length; j++) {
          if (xPositions.includes(winningPos[i][j])) {
            count++;
          }
          if (count == numberToWin) {
            isWin = true;
            this.gameWinner = true;
            this.bannerW = true;

            // clearGameField();
            // seriesWinner();
            setTimeout(() => {
              this.bannerW = false;
              clearGameField();
              seriesWinner();
            }, 1500);
            showPlayerOneWin();
          }
        }
      }

      return isWin;
    };

    let check_Y_win = (arr: any): boolean => {
      let oContainers = arr.filter((item: any) => item.value == 'o');
      let isWin = false;
      for (let i = 0; i < oContainers.length; i++) {
        if (!oPositions.includes(arr.indexOf(oContainers[i]))) {
          oPositions.push(arr.indexOf(oContainers[i]));
        }
      }

      for (let i = 0; i < winningPos.length; i++) {
        let count = 0;
        for (let j = 0; j < winningPos[i].length; j++) {
          if (oPositions.includes(winningPos[i][j])) {
            count++;
          }
          if (count == numberToWin) {
            isWin = true;
            this.bannerL = true;
            this.gameWinner = true;
            // clearGameField();
            // seriesWinner();

            setTimeout(() => {
              this.bannerL = false;
              clearGameField();
              seriesWinner();
            }, 1500);
            showPlayerTwoWin();
          }
        }
      }

      return isWin;
    };

    let draw = () => {
      if (moveCounter >= boardsize && !this.gameWinner) {
        this.bannerD = true;
        resultText.text = 'It`s a tie';
        resultText.x = 270;
        setTimeout(() => {
          this.bannerD = false;
          clearGameField();
        }, 1500);
        resetGame();
      }
    };

    let changeTurnImage = () => {
      if (moveCounter < boardsize) {
        turnXImage.visible = !turnXImage.visible;
        turnOImage.visible = !turnOImage.visible;
      }
    };

    let incrementCounter = () => {
      if (moveCounter < boardsize) {
        ++moveCounter;
        return;
      }
      ++moveCounter;
    };

    let clearGameField = () => {
      gameField.removeChildren();
      resetGame();
    };

    let resetGame = () => {
      playerOne = '';
      moveCounter = 0;
      gameWrapper.visible = false;
      gameEndScene.visible = true;
      xPositions = [];
      oPositions = [];
      removeCells();
    };

    let showPlayerOneWin = () => {
      playerOneScoreText.text = ++score.player1;
      resultText.text = 'Player X win!';
      resultText.x = 200;
    };

    let showPlayerTwoWin = () => {
      playerTwoScoreText.text = ++score.player2;
      resultText.text = 'Player O win!';
      resultText.x = 230;
    };
  }
}
