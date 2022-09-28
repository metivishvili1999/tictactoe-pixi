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
        reconnectedGame: 0,
        isDone: false,
        playerOne: null,
        playerTwo: null,
        rejoinedPlayer: null,
        pl1: 0,
        pl2: 0,
        rejoined: false,
        first: '',
        sec: '',
        firstpoint: 0,
        secpoint: 0,
        gamePlayed: false,
        delCanvas: false
    }


    public setboardSize(size: number):void {
        this.data.boardSize = size;
    }

    public setScore(score: number):void {
      this.data.scoreToPlay = score;
  }
}

const data = new GameData();

 export { data };
