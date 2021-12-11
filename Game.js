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
    isEmptySpace(position){
        if(position === " ¤ ") return true
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
        const newPositionX = x
        const newPositionY = y;
        const selectedCar = car;

        const deltaR = newPositionY - car.y
        const deltaC = newPositionX - car.x


        if(selectedCar.orientation == "y"){
            if(newPositionX != selectedCar.x){
                console.log("Your car is not in that y axis")
                return 0
            }

            if(deltaR > 0){
                for(let i = 0; i < deltaR; i++){
                    let yAxis = selectedCar.x + (selectedCar.long -1) + (i -1) // plus car lengte plus aantal zetten naar vertical top
                    let xAxis = selectedCar.x
                    let position = this.board[yAxis][xAxis]
                    if(position != " ¤ "){
                        if(position == selectedCar.name){
                            console.log("pass")
                        }else{
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
                    let xAxis = selectedCar.x  // plus car lengte plus aantal zetten naar vertical top
                    let position = this.board[yAxis][xAxis]
                    if(position != " ¤ "){
                        if(position == selectedCar.name){
                            console.log("pass")
                        }else{
                            return 0
                        }
                    }else if(selectedCar.y + deltaR < 0){
                        return 0
                    }else {
                        return 1
                    }
                }
            }
        }
        if(selectedCar.orientation == "x"){
            if(newPositionY != selectedCar.y)
                console.log("Your car is not in that x axis")
                return 0

            if(deltaC > 0){
                for(let i =0; i < deltaC; i++){
                    let yAxis = selectedCar.y
                    let xAxis = selectedCar.x + (selectedCar.long -1) + (1 + i) // plus car lengte plus aantal zetten naar horizontaal recht
                    let position = this.board[yAxis][xAxis]
                    if(position != " ¤ "){
                        if(position == selectedCar.name){

                        }else {
                            return 0
                        }
                    }else if(selectedCar.x + deltaR > 6){
                        return 0
                    }else {
                        return 1
                    }
                }
            }
            if(deltaC < 0){
                for(let i =0; i < Math.abs(deltaC); i++){
                    let yAxis = selectedCar.y
                    let xAxis = selectedCar.x - (1 + i) // plus aantal zetten naar horizontaal links
                    let position = this.board[yAxis][xAxis]
                    if(position != " ¤ "){
                        if(position == selectedCar.name){

                        }else {
                            return 0
                        }
                    }else if((selectedCar.y + deltaC) < 0){
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

        const car = this.allCars.find(car => car.name == carId)
        console.log(`You want to move car: [${car.name}] to position [${x}, ${y}]`)
        if(this.isALegalMove(car, x - 1, y - 1) == 1){
            console.log("Its legal im going to move your car")
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
