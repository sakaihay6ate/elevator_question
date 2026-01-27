import Passenger from "./passenger";
import config from "../constants";

const { ELEVATOR_CAPACITY } = config;
export default class Elevator {
  public id: number;
  public currentFloor: number = 1;
  public targetFloors: Set<number> = new Set();
  public passengers: Passenger[] = [];
  //單次下電梯的人數統計
  public servedPassengersCount: number = 0;
  public direction: "up" | "down" | "idle" = "idle";

  constructor(id: number) {
    this.id = id;
  }

  public loadPassengers(waitingPassengers: Passenger[]): boolean {
    for (let i = waitingPassengers.length - 1; i >= 0; i--) {
      const passenger = waitingPassengers[i];
      if (passenger.direction === this.direction || this.direction === "idle") {
        if (passenger.startFloor === this.currentFloor && this.passengers.length < ELEVATOR_CAPACITY) {
          this.passengers.push(passenger);
          this.targetFloors.add(passenger.targetFloor);
          waitingPassengers.splice(i, 1);
          console.log(`Passenger boarded Elevator ${this.id} at floor ${this.currentFloor}.`);
          return true;
        }
      }
    }
    return false;
  }

  public unloadPassengers(): boolean {
    let isUnloaded = false;
    for (let i = this.passengers.length - 1; i >= 0; i--) {
      const passenger = this.passengers[i];
      if (passenger.targetFloor === this.currentFloor) {
        this.passengers.splice(i, 1);
        this.servedPassengersCount++;
        console.log(`Passenger ${passenger.id} exited Elevator ${this.id} at floor ${this.currentFloor}.`);
        isUnloaded = true;
      }
    }
    if (isUnloaded) {
      this.targetFloors.delete(this.currentFloor);
    }
    return isUnloaded;
  }
  public moveToFloor(targetFloor: number): void {
    if (this.currentFloor < targetFloor) {
      this.currentFloor++;
    } else {
      this.currentFloor--;
    }
    this.direction = this.currentFloor < targetFloor ? "up" : this.currentFloor > targetFloor ? "down" : "idle";
    console.log(`Elevator ${this.id} current floor is ${this.currentFloor} and target is ${targetFloor}.`);
  }

  public getServedPassengersCount(): number {
    const count = this.servedPassengersCount;
    this.servedPassengersCount = 0; // Reset after reporting
    return count;
  }
}
