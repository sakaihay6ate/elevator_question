export default class Passenger {
  public id: number;
  constructor(id: number, startFloor: number, targetFloor: number) {
    //view
    this.id = id;
    console.log(`Passenger ${id} created at floor ${startFloor} targeting floor ${targetFloor}.`);
  }

  getOutOfElevator(passengerId: number): void {
        console.log(`Passenger ${this.id} exited Elevator ${this.id} at floor ${this.currentFloor}.`);
  }
}