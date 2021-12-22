const Car = require('./Car.js')
const readline = require("readline");

// Test game
// ,
//
// "grid": [
//     [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
//     [" ¤ "," ¤ "," ¤ "," ¤ "," ¤ ",  3  ],
//     [" ¤ ",  0  ,  0  ," ¤ "," ¤ ",  3  ],
//     [  1  ," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
//     [  1  ," ¤ "," ¤ "," ¤ "," ¤ "," ¤ "],
//     [" ¤ ",  10 ,  10 ," ¤ "," ¤ "," ¤ "]
// ]
class Game {
    constructor(){
        this.emptySymbol = " ¤ "
        this.grid = this.loadGame()
        this.allCars = []
        this.board = []
    }

    initializeBoard(w, h, emptyVal){
        let arr = [];
        for(let i = 0; i < h; i++) {
            arr[i] = [];
            for(let j = 0; j < w; j++) {
                arr[i][j] = emptyVal;
            }
        }
        return arr
    }

    isEmptySpace(position){
        if(position === this.emptySymbol) return true
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
                        if(!isNaN(y)){
                            cars.push({
                                id: y,
                                increment: 1,
                                positions: [[xIndex,yIndex]]
                            })
                        }
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
            if(isNaN(id)){
                console.log("Empty position")
                id = this.emptySymbol
            }
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
                        this.board[car.y ][car.x + step] = " " + car.name + " "
                        this.board[car.y ][car.x + step] = " " + car.name + " "
                    }else {
                        this.board[car.y][car.x + step] = car.name + " "
                    }
                }
            }
            else if(car.orientation =="y"){
                for(let step = 0; step < car.long; step++){
                    if(car.name < 10){
                        this.board[car.y + step][car.x] = " " + car.name + " "
                    }else{
                        this.board[car.y + step][car.x] = car.name + " "
                    }
                }
            }
        })
        this.showBoard();
    }

    isALegalMove(car, x, y){
        const newPositionY = y; //row
        const newPositionX = x; //col
        const selectedCar = car;

        const deltaR = newPositionY - car.y
        const deltaC = newPositionX - car.x




        if(selectedCar.orientation == "x"){
            if(newPositionY != selectedCar.y){
                console.log("Your car is not in that x axis")
                return 0
            }

            if(deltaC > 0){
                for(let i = 0; i < deltaC; i++){
                    let yAxis = selectedCar.y  // plus car lengte plus aantal zetten naar vertical top
                    let xAxis = selectedCar.x + (selectedCar.rear + ( 1 + i ))
                    let position = this.board[yAxis][xAxis]
                    if(position != this.emptySymbol){
                        if(position == selectedCar.name){
                            console.log("pass")
                            continue;
                        }else{
                            return 0
                        }
                    }else if(selectedCar.x + deltaC > 6){
                        return 0
                    }else {
                        return 1
                    }
                }
            }
            else if(deltaC < 0){
                for(let i =0; i < Math.abs(deltaC); i++){
                    let yAxis = selectedCar.y
                    let xAxis = selectedCar.x - (1 + i) // plus car lengte plus aantal zetten naar vertical top
                    let position = this.board[yAxis][xAxis]
                    if(position != this.emptySymbol){
                        if(position == selectedCar.name){
                            console.log("pass")
                            continue
                        }else{
                            return 0
                        }
                    }else if(selectedCar.x + deltaC < 0){
                        return 0
                    }else {
                        return 1
                    }
                }
            }
        }
        if(selectedCar.orientation == "y"){
            if(newPositionX != selectedCar.x){
                console.log("Your car is not in that y axis")
                return 0
            }

            if(deltaR > 0){
                for(let i =0; i < deltaR; i++){
                    let yAxis = selectedCar.y + (selectedCar.long - 1) + (i + 1)
                    let xAxis = selectedCar.x  // plus car lengte plus aantal zetten naar horizontaal recht
                    let position = this.board[yAxis][xAxis]
                    if(position != this.emptySymbol){
                        if(position == selectedCar.name){
                            console.log("pass")
                            continue
                        }else {
                            return 0
                        }
                    }else if(selectedCar.y + deltaR > 6){
                        return 0
                    }else {
                        return 1
                    }
                }
            }
            if(deltaR < 0){
                for(let i =0; i < Math.abs(deltaR); i++){
                    let yAxis = selectedCar.y - (1 + i)
                    let xAxis = selectedCar.x  // plus aantal zetten naar horizontaal links
                    let position = this.board[yAxis][xAxis]
                    if(position != this.emptySymbol){
                        if(position == selectedCar.name){
                            console.log("pass")
                            continue
                        }else {
                            return 0
                        }
                    }else if((selectedCar.y + deltaR) < 0){
                        return 0
                    }else {
                        return 1
                    }
                }
            }
        }
    }

    showBoard(){
        console.log("Game board")
        for(const key in this.board){
            let row = ""
            for(const item in this.board[key]){
                row += this.board[key][item]
            }

            console.log(`Grid Row ${key}:       ${row}` )
        }
    }

    async play(){
        this.emptySymbol = " ੦ "
        this.emptySymbol = " ᚕ "
        this.emptySymbol = " ᚙ "
        this.emptySymbol = " ▣ "
        this.board = this.initializeBoard(6, 6, this.emptySymbol);
        this.listOfCarPositions = this.getDataFromGrid()
        this.allCars = this.carGeneration()
        this.updateBoard()

        let moves = 0;
        while (this.someoneWon(moves) != 1){
            await this.moveCar()
            moves++
        }
    }

    someoneWon(moves){
        let redCar = this.allCars.find(car => car.name == 0)
        if(redCar.x + (redCar.long -1) == 5 && moves != 0){
            console.log(`That was your winning move! it took you only ${moves} moves`)
            return 1
        }else if(moves != 0){
            console.log(`Not a winning move. This is your ${moves} move`)
            return 0
        }else{
            console.log(`Make your first move. Good Luck!!`)
            return 0
        }
    }

    removeCar(car){
        if(car.orientation == "x"){
            for(let i = 0; i <= car.long; i++){
                let yAxis = car.y
                let xAxis = car.x + i
                this.board[yAxis][xAxis] = this.emptySymbol
            }
        }
        if(car.orientation == "y"){
            for(let i = 0; i <= car.long; i++){
                let yAxis = car.y + i
                let xAxis = car.x
                console.log(`Removing ${yAxis} ${xAxis}`)
                this.board[yAxis][xAxis] = this.emptySymbol
            }
        }
    }

    async moveCar() {
        const carId = await this.askQuestion("Input number of the car you want to move: ");
        if(carId == -1) {
            this.updateBoard()
            return
        }
        const xInput = await this.askQuestion("  Give x axes number: ");
        const yInput = await this.askQuestion("  Give y axes number: ");

        let newXPosition = xInput - 1
        let newYPosition = yInput - 1
        const car = this.allCars.find(car => car.name == carId)
        console.log(`You want to move car: [${car.name}] to position [${newXPosition}, ${newYPosition}]`)
        if(this.isALegalMove(car, newXPosition, newYPosition) == 1){
            console.log("Its legal to make that move so i'm going to move your car")
            let deltaY = newYPosition - car.y //row
            let deltaX = newXPosition - car.x //col

            let deltaYFront = newYPosition - (car.y + (car.long -1))
            let deltaXFront = newXPosition - (car.x + (car.long -1))

            if(car.orientation == "x"){
                if(deltaX > 0){
                    this.removeCar(car)
                    car.x += deltaXFront
                    this.updateBoard()
                }else if(deltaX < 0){
                    this.removeCar(car)
                    car.x += deltaX
                    this.updateBoard()
                }
            }
            else if(car.orientation == "y"){
                if(deltaY > 0){
                    this.removeCar(car)
                    car.y += deltaYFront
                    this.updateBoard()
                }else if(deltaY < 0){
                    this.removeCar(car)
                    car.y += deltaY
                    this.updateBoard()
                }
            }

        }else{
            console.log("Can't move to that position")
        }
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



