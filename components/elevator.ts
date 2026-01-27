import Passenger from "./passenger";
import config from "../constants";

const { ELEVATOR_CAPACITY } = config;
export default class Elevator {
  private id: number;
  private currentFloor: number = 1;
  private targetFloors: Set<number> = new Set();
  private passengers: Passenger[] = [];
  //單次下電梯的人數統計
  private servedPassengersCount: number = 0;
  direction: "up" | "down" | "idle" = "idle";

  constructor(id: number) {
    this.id = id;
  }

  public operate(waitingPassengers: Passenger[]): void {
    //如果乘客的startFloor在當前樓層並且不與電梯方向反向，則讓乘客上電梯
    //如果有乘客上電梯或下電梯，則停留在當前樓層處理 沒有人上下電梯才移動
    //先放人才接人,不能用!(放人||接人)因為如果有放人就不會判斷是否需要接人
    if (!this.unloadPassengers() && !this.loadPassengers(waitingPassengers)) {
      //如果有乘客，則前往他們的目標樓層
      if (this.passengers.length > 0) {
        const targetFloor = this.passengers[0].targetFloor;
        this.moveToFloor(targetFloor);
      } else if (waitingPassengers.length > 0) {
        //如果沒有乘客，則往等待乘客的樓層移動
        const nextPassenger = waitingPassengers[0];
        this.moveToFloor(nextPassenger.startFloor);
      } else {
        this.direction = "idle";
        console.log(`Elevator ${this.id} is idle at floor ${this.currentFloor}.`);
      }
    }
    console.log(`Elevator ${this.id} current passengers: ${this.passengers.length}.`);
  }

  private loadPassengers(waitingPassengers: Passenger[]): boolean {
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

  private unloadPassengers(): boolean {
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
  private moveToFloor(targetFloor: number): void {
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
