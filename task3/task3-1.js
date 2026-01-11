class Transport {
  constructor() {}

  ride() {
    console.log("Riding transport");
  }

  stop() {
    console.log("Stopping transport");
  }
}

class Car extends Transport {
  constructor() {
    super();
    this.type = "car";
  }

  ride() {
    console.log(`Driving a ${this.type}`);
  }

  stop() {
    console.log(
      `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} stopped`
    );
  }
}

class Bike extends Transport {
  constructor() {
    super();
    this.type = "bike";
  }

  ride() {
    console.log(`Riding a ${this.type}`);
  }

  stop() {
    console.log(
      `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} stopped`
    );
  }
}

class FactoryTransport {
  static createTransport(type) {
    switch (type) {
      case "car":
        return new Car();
      case "bike":
        return new Bike();
      default:
        throw new Error("Unknown transport type");
    }
  }
}

const myCar = FactoryTransport.createTransport("car");
myCar.ride();
myCar.stop();

const myBike = FactoryTransport.createTransport("bike");
myBike.ride();
myBike.stop();
