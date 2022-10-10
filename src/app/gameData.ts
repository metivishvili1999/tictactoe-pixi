class GameData {
    constructor(){}
    
    public data = {
        boardSize: 0,
        scoreToPlay: 0,
        user:{
            sessionId: null,
            userName: null
        },
        gameTables: [],
        gamesHistory: [],
        joinable: [],
        movesHistory: [],
        posX:0,
        posY:0,
        activeGame: 0,
        isDone: false,
        playerOne: null,
        playerTwo: null,
        rejoined: false,
        first: '',
        sec: '',
        firstpoint: 0,
        secpoint: 0
    }


    public setboardSize(size: any):void {
        this.data.boardSize = size;
    }

    public setScore(score: any):void {
      this.data.scoreToPlay = score;
  }
}

const data = new GameData();

 export { data };