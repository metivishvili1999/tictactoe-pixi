class GameData {
    constructor(){}
    
    public data = {
        boardSize: 0,
        scoreToPlay: 0
    }

    public setboardSize(size: any):void {
        this.data.boardSize = size;
    }


    public setScore(score: number):void {
        this.data.scoreToPlay = score;
    }
}

const data = new GameData();

 export { data };