class Car {
    constructor(name, orientation, long, coordinates) {
        this.name = name;
        this.orientation = orientation;
        this.long = long
        this.coordinates = coordinates
        this.front = this.frontOfCar()
        this.rear = this.backOfCar()
        this.x = this.coordinates[0][1]
        this.y = this.coordinates[0][0]
    }

    backOfCar(){
        if(this.orientation == "x") {
            return this.x
        } else {
            return this.y
        }
    }

    frontOfCar(){
        if(this.orientation == "x") {
            return this.x + this.long
        } else {
            return this.y + this.long
        }
    }
}

module.exports = Car