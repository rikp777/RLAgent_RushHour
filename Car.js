class Car {
    constructor(name, orientation, long, coordinates) {
        this.name = name;
        this.orientation = orientation;
        this.long = long
        this.coordinates = coordinates
        this.front = this.frontOfCar()
        this.rear = this.backOfCar()
        this.x = this.coordinates[0][0]
        this.y = this.coordinates[0][1]
    }

    backOfCar(){
        if(this.orientation == "X") {
            return this.coordinates[0][0]
        } else {
            return this.coordinates[0][1]
        }
    }

    frontOfCar(){
        if(this.orientation == "X") {
            return this.coordinates[0][0] + this.long
        } else {
            return this.coordinates[0][1] + this.long
        }
    }
}

module.exports = Car