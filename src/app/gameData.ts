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
        activeGame: 0,
        isDone: false,
        playerOne: null,
        playerTwo: null
    }


    public setboardSize(size: number):void {
        this.data.boardSize = size;
    }

    public setScore(score: number):void {
      this.data.scoreToPlay = score;
  }
}

const data = new GameData();

 export { data};
