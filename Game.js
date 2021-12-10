const Car = require('./Car.js')
const readline = require("readline");

class Game {
    constructor(){
        this.grid = this.loadGame()
        this.allCars = []
        this.board = [
            [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
            [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
            [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
            [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
            [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
            [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "]
        ]
    }

    findDuplicates(){
    }
    isEmptySpace(position){
        if(position === " ¤ ") return true
        return false
    }
    checkHorizontal(grid, N){
        for(let i =0, k = N - 1; i < parseInt(N / 2, 10); i++, k--){
            for(let j = 0; j < M; j++){
                if(grid[i][j] != grid[j][i]){
                    return true
                }
            }
        }
        return false
    }
    checkHorizontalVertical(cars){
        cars.forEach(car => {
            if(car.positions[0][0] < car.positions[1][0]){
                car.orientation = "y"
            }else {
                car.orientation = "x"
            }
        })
    }
    findCarById(cars, id){
        return cars.find(car => car.id === id)
    }
    getDataFromGrid(){
        let cars = []
        // Loop
        this.grid.forEach((x, xIndex) => {
            x.forEach((y, yIndex)  => {
                let car = this.findCarById(cars, y)
                if(car){
                    car.increment++
                    car.positions.push([xIndex,yIndex])
                }else{
                    if(!this.isEmptySpace(y)) {
                        cars.push({
                            id: y,
                            increment: 1,
                            positions: [[xIndex,yIndex]]
                        })
                    }
                }
            })
        })
        this.checkHorizontalVertical(cars)
        return cars
    }

    loadGame(){
        const gameFile = require('./game_one.json');
        const content = gameFile.grid
        return content
    }

    addCar(name, orientation, long, x, y){
        return new Car(name, orientation, long, x, y)
    }

    carGeneration(){
        let allCars = []
        this.listOfCarPositions.forEach(carPosition => {
            let id = carPosition.id
            let orientation = carPosition.orientation
            let size = carPosition.increment
            let coordinates = carPosition.positions

            const newCar = this.addCar(id, orientation, size, coordinates)
            allCars.push(newCar)
        })
        return allCars
    }

    updateBoard(){
        this.allCars.forEach(car => {
            if(car.orientation == "x"){
                for(let step = 0; step < car.long; step++){
                    if(car.name < 10){
                        this.board[car.x ][car.y + step] = " " + car.name + " "
                        this.board[car.x ][car.y + step] = " " + car.name + " "
                    }else {
                        this.board[car.x][car.y + step] = car.name + " "
                    }
                }
            }
            else if(car.orientation =="y"){
                for(let step = 0; step < car.long; step++){
                    if(car.name < 10){
                        this.board[car.x + step][car.y] = " " + car.name + " "
                    }else{
                        this.board[car.x + step][car.y] = car.name + " "
                    }
                }
            }
        })
        this.showBoard();
    }

    showBoard(){
        for(const key in this.board){
            let row = ""
            for(const item in this.board[key]){
                row += this.board[key][item]
            }
            console.log(`Grid Row ${key}:       ${row}` )
        }
    }

    async play(){
        this.listOfCarPositions = this.getDataFromGrid()
        this.allCars = this.carGeneration()
        this.updateBoard()

        while (this.someoneWon != 1){
            await this.moveCar()
        }
    }

    someoneWon(){

    }

    async moveCar() {
        const carId = await this.askQuestion("Input number of the car you want to move: ");
        const x = await this.askQuestion("  Give x axes number: ");
        const y = await this.askQuestion("  Give y axes number: ");

        const car = this.allCars.find(car => car.id = carId)
        console.log(`You want to move car: [${car.name}] to position [${x}, ${y}]`)
    }

    askQuestion(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }))
    }
}
const game = new Game();
game.play()
