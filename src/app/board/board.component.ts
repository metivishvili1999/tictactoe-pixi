
import { Component,OnInit} from '@angular/core';
import { Container, Application, Sprite, TextStyle, Texture} from 'pixi.js';
import * as pixi from 'pixi.js';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})


export class BoardComponent implements OnInit {
  items: any;
  public bannerW;
  public bannerL;
  public bannerD;
  
  // public newSize = 3;


  public winningPositions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
  ]

  ngOnInit(): void {

    let Application = pixi.Application,
      Container = pixi.Container,
      Graphics = pixi.Graphics,
      Text = pixi.Text,
      TextStyle = pixi.TextStyle,
      Texture = pixi.Texture;

    let playerOne,
    playerTwo,
      turnX = true,
      turnO = true,
      // boardsize = this.newSize,
      moveCounter = 0,
      score = {
        player1: 0,
        player2: 0
      };


      

    let app = new Application({
      width: innerWidth ,
      height: innerHeight,
      backgroundAlpha: 0
    });


    let loadingScreen = new Container();
    app.stage.addChild(loadingScreen);

    let loadingBg = new pixi.Sprite(Texture.WHITE);
    loadingScreen.addChild(loadingBg);


    setTimeout(() => {
      loadingScreen.visible = false;
      chooseScene.visible = true;
  }, 500);
  

    document.body.appendChild(app.view);

    let chooseScene = new Container();
    app.stage.addChild(chooseScene);

    chooseScene.visible = false;

    let style = new TextStyle({
      fontStyle:"italic",
      fontSize: 36,
      fill: 'white'
    });

    let style1 = new TextStyle({
      fontFamily:"Georgia",
      fontStyle:"italic",
      fontSize: 24,
      fill: 'white'
    })

    let continueButtonStyle = new TextStyle({
      fontSize: 32,
      fill: 'white'
    });

    let chooseText = new Text('Choose Player', style);
    chooseScene.addChild(chooseText);

    chooseText.position.set(280, 170);

    

    const chooseX: Sprite = Sprite.from("assets/images/x.png");
    chooseScene.addChild(chooseX);

    chooseX.scale.set(0.7);
    chooseX.position.set(320, 250);
    chooseX.interactive = true;
    chooseX.on('click', () => {
      addCells();
      chooseScene.visible = false;
      gameWrapper.visible = true;
    });


    let chooseO: Sprite = Sprite.from("assets/images/o.png");
    chooseScene.addChild(chooseO);

    chooseO.scale.set(0.7);
    chooseO.position.set(440, 250);
    chooseO.interactive = true;
    chooseO.on('click', () => {
      addCells();
      chooseScene.visible = false;
      gameWrapper.visible = true;
    });

    let gameWrapper = new Container();
    app.stage.addChild(gameWrapper);

    gameWrapper.visible = false;

    let scoreText = new Text('Score', style);
    gameWrapper.addChild(scoreText);
    scoreText.position.set(500, 20);

    let scoreLine = new Graphics();
    gameWrapper.addChild(scoreLine);
    scoreLine.lineStyle(3, 0xffffff, 1);
    scoreLine.moveTo(400, 60);
    scoreLine.lineTo(700, 60);


    ///////////   PLAYER-X  ////////////
    let firstP = new Text('Player X: ', style1);
    gameWrapper.addChild(firstP);
    firstP.position.set(400, 70);

    let playerOneScoreText = new Text(score.player1, style1);
    gameWrapper.addChild(playerOneScoreText);
    playerOneScoreText.position.set(510, 69);


    ////////// PLAYER O //////////////

    let secondP = new Text('Player Y: ', style1);
    gameWrapper.addChild(secondP);
    secondP.position.set(400, 110);

    let playerTwoScoreText = new Text(score.player2, style1);
    gameWrapper.addChild(playerTwoScoreText);
    playerTwoScoreText.position.set(510, 109);




    let moveCounterText = new Text('', style);
    gameWrapper.addChild(moveCounterText);

    moveCounterText.position.set(100, 300);
    moveCounterText.text = 'Move:   ' + moveCounter;

    let currentTurnText = new Text('Turn:', style);
    gameWrapper.addChild(currentTurnText);

    currentTurnText.position.set(100, 370);

    let turnXImage: Sprite = Sprite.from("assets/images/x.png");
    currentTurnText.addChild(turnXImage);

    turnXImage.scale.set(.5);
    turnXImage.position.set(150, 10);

    let turnOImage: Sprite = Sprite.from("assets/images/o.png");
    currentTurnText.addChild(turnOImage);

    turnOImage.scale.set(.5);
    turnOImage.position.set(150, 10);
    turnOImage.visible = false;

    

    let gameField: any = new Container();    
    let xPositions = [];
    let oPositions = [];
    gameWrapper.addChild(gameField);

    gameField.position.set(400, 150);

    // let addCells = (boardsize) => {
    //   for (let i = 0; i < boardsize; i++) {
    //     let cell = new Container();
    //     gameField.addChild(cell);
    //     let bg: Sprite = Sprite.from("assets/images/bg.png");
    //     bg.position.set(0, 0);
    //     bg.width = 100;
    //     bg.height = 100;
    
    //     cell.addChild(bg);
    //     cell.x = (i % boardsize) * 100;
    //     cell.y = Math.floor(i / boardsize) * 100;

    //     cell.interactive = true;
    //     cell.on('click', () => {
    //       addValue(cell);
    //     });
    //   }
      
    //   let octothorpe = new Graphics();
    //   octothorpe.lineStyle(2, 0xffffff, 1);
    //   octothorpe.moveTo(0, 0);
    //   octothorpe.lineTo(0, 300);
    //   octothorpe.moveTo(0, 0);
    //   octothorpe.lineTo(300, 0);
    //   octothorpe.moveTo(100, 0);
    //   octothorpe.lineTo(100, 300);
    //   octothorpe.moveTo(200, 0);
    //   octothorpe.lineTo(200, 300);
    //   octothorpe.moveTo(0, 100);
    //   octothorpe.lineTo(300, 100);
    //   octothorpe.moveTo(0, 200);
    //   octothorpe.lineTo(300, 200);
    //   octothorpe.moveTo(300, 0);
    //   octothorpe.lineTo(300, 300);
    //   octothorpe.moveTo(0, 300);
    //   octothorpe.lineTo(301, 300);

    //   gameField.addChild(octothorpe);
    // }

    let addCells = () => {
      for (let i = 0; i < 9; i++) {
        let cell = new Container();
        gameField.addChild(cell);
        let bg: Sprite = Sprite.from("assets/images/bg.png");
        bg.position.set(0, 0);
        bg.width = 100;
        bg.height = 100;
    
        cell.addChild(bg);
        cell.x = (i % 3) * 100;
        cell.y = Math.floor(i / 3) * 100;

        cell.interactive = true;
        cell.on('click', () => {
          addValue(cell);
        });
      }
      
      let octothorpe = new Graphics();
      octothorpe.lineStyle(2, 0xffffff, 1);
      octothorpe.moveTo(0, 0);
      octothorpe.lineTo(0, 300);
      octothorpe.moveTo(0, 0);
      octothorpe.lineTo(300, 0);
      octothorpe.moveTo(100, 0);
      octothorpe.lineTo(100, 300);
      octothorpe.moveTo(200, 0);
      octothorpe.lineTo(200, 300);
      octothorpe.moveTo(0, 100);
      octothorpe.lineTo(300, 100);
      octothorpe.moveTo(0, 200);
      octothorpe.lineTo(300, 200);
      octothorpe.moveTo(300, 0);
      octothorpe.lineTo(300, 300);
      octothorpe.moveTo(0, 300);
      octothorpe.lineTo(301, 300);

      gameField.addChild(octothorpe);
    }

    let removeCells = () => {
      for (var i = gameField.children.length - 1; i >= 0; i--) {
        gameField.removeChild(gameField.children[i]);
      }
    }

    let gameEndScene = new Container();
    app.stage.addChild(gameEndScene);

    gameEndScene.visible = false;


    let resultText = new Text('', style);
    gameEndScene.addChild(resultText);

    resultText.position.set(230, 150);


    let continueButton = new Text('CONTINUE', continueButtonStyle);
    gameEndScene.addChild(continueButton);

    continueButton.position.set(250, 220)
    continueButton.interactive = true;
    continueButton.on('click', () => {
      chooseScene.visible = true;
      gameEndScene.visible = false;
    })

    let addValue = (cell) => {
      if (turnX && !cell.isFilled) {
        let x: Sprite = Sprite.from("assets/images/x.png");
        x.position.x = 10;
        x.position.y = 10;
        cell.addChild(x);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'x';

      };

      if (!turnX && !cell.isFilled) {
        let o: Sprite = Sprite.from("assets/images/o.png");
        o.position.x = 10;
        o.position.y = 10;
        cell.addChild(o);
        turnX = !turnX;
        cell.isFilled = true;
        cell.value = 'o';
      };

      checkWin();
    }

    let checkWin = () => {
      
      changeTurnImage();
      incrementCounter();
      
      if (check_X_win(gameField.children)) {
        resetGame();
      } else if (check_Y_win(gameField.children)) {
        resetGame();
      } else if(moveCounter > 8 ) {
        this.bannerD = true;
        resultText.text = 'It`s a tie';
        resultText.x = 270;
        setTimeout(() => {
          this.bannerD = false;
          clearGameField();
        }, 1500);
        resetGame();
      }
      }


      let check_X_win = (arr: any): boolean => {
        let xContainers = arr.filter((item:any) => item.value == 'x');
        let isWin = false;
        for (let i = 0; i < xContainers.length; i++) {
          if ( !xPositions.includes(arr.indexOf(xContainers[i])) ) {
            xPositions.push(arr.indexOf(xContainers[i]))
          }
        }
  
        
        for (let i = 0; i < this.winningPositions.length; i++) {
          let count = 0;
          for (let j = 0; j < this.winningPositions[i].length; j++) {
            if ( xPositions.includes(this.winningPositions[i][j]) ) {
              count++;
            }
            if ( count == 3) {
              isWin = true
              this.bannerW = true;
              setTimeout(() => {
                this.bannerW = false;
                clearGameField();
              }, 1500);
              showPlayerOneWin();
            }
          }
        }

        return isWin;
      }

      let check_Y_win = (arr: any): boolean => {
        let oContainers = arr.filter((item:any) => item.value == 'o');
        let isWin = false;
        for (let i = 0; i < oContainers.length; i++) {
          if ( !oPositions.includes(arr.indexOf(oContainers[i])) ) {
            oPositions.push(arr.indexOf(oContainers[i]))
          }
        }
  
        
        for (let i = 0; i < this.winningPositions.length; i++) {
          let count = 0;
          for (let j = 0; j < this.winningPositions[i].length; j++) {
            if ( oPositions.includes(this.winningPositions[i][j]) ) {
              count++;
            }
            if ( count == 3) {
              isWin = true;
              this.bannerL = true;
              setTimeout(() => {
                this.bannerL = false;
                clearGameField();
              }, 1500);
              showPlayerTwoWin();
            }
          }
        }

        return isWin;
      }

    

    let changeTurnImage = () => {
      if (moveCounter < 9) {
        turnXImage.visible = !turnXImage.visible;
        turnOImage.visible = !turnOImage.visible;
      };
    }

    let incrementCounter = () => {
      if (moveCounter < 9) {
        ++moveCounter;
        moveCounterText.text = 'Move:   ' + moveCounter;
        return;
      };
      ++moveCounter;
    }


    let clearGameField = () => {
      gameField.removeChildren();
      resetGame();
    };

    let resetGame = () => {
      playerOne = '';
      moveCounter = 0;
      moveCounterText.text = 'Move:   ' + moveCounter;
      gameWrapper.visible = false;
      gameEndScene.visible = true;
      xPositions = [];
      oPositions = [];
      removeCells();
      this.bannerD = false;
      this.bannerL = false;
      this.bannerW = false;
    };


    let showPlayerOneWin = () => {
      playerOneScoreText.text = ++score.player1;
      resultText.text = 'Player X win!'
      resultText.x = 230;

    };


    let showPlayerTwoWin = () => {
      playerTwoScoreText.text = ++score.player2;
      resultText.text = 'Player O win!'
      resultText.x = 230;
    };
  }

}