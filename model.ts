import config from "./constants";
import { debugMode, testDaata } from "./constants";
import Controller from "./controller";
import { IPassenger } from "./interface";
import Passenger from "./components/passenger";
import Elevator from "./components/elevator";

const { TOTAL_FLOORS, ELEVATOR_CAPACITY } = config;

export default class Model {
  public passengers: number = 0;
  public passengersServed: number = 0;
  public timeElapsed: number = 0;
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  public createPassenger(id: number): IPassenger {
    console.log("Model: Creating passenger");
    let startFloor = Math.floor(Math.random() * TOTAL_FLOORS) + 1;
    let targetFloor: number;
    do {
      targetFloor = Math.floor(Math.random() * TOTAL_FLOORS) + 1;
    } while (targetFloor === startFloor);

    if (debugMode) {
      startFloor = testDaata[this.passengers][0];
      targetFloor = testDaata[this.passengers][1];
    }
    this.passengers++;

    return { id, startFloor, targetFloor };
  }

  public operateElevators(elevators: Elevator[], waitingPassengers: Passenger[]): void {
    elevators.forEach((elevator) => {
      //如果乘客的startFloor在當前樓層並且不與電梯方向反向，則讓乘客上電梯
      //如果有乘客上電梯或下電梯，則停留在當前樓層處理 沒有人上下電梯才移動
      //先放人才接人,不能用!(放人||接人)因為如果有放人就不會判斷是否需要接人
      if (!elevator.unloadPassengers() && !elevator.loadPassengers(waitingPassengers)) {
        //如果有乘客，則前往他們的目標樓層
        if (elevator.passengers.length > 0) {
          const targetFloor = elevator.passengers[0].targetFloor;
          elevator.moveToFloor(targetFloor);
        } else if (waitingPassengers.length > 0) {
          //如果沒有乘客，則往等待乘客的樓層移動
          //IIFE 找一個不會被其他電梯接走的乘客 有空再另外拉出來
          const nextPassenger = (() => {
            let nextPassenger: Passenger | null = null;
            for (const passenger of waitingPassengers) {
              if (!this.checkWaitingPassengers(passenger)) {
                //找一個不會被其他電梯接走的乘客
                nextPassenger = passenger;
                break;
              }
            }
            return nextPassenger!;
          })();
          if (nextPassenger === null) {
            this.controller.setElevatorIdle(elevator.id);
          } else {
            elevator.moveToFloor(nextPassenger.startFloor);
          }
        } else {
          this.controller.setElevatorIdle(elevator.id);
        }
      }
      console.log(`Elevator ${elevator.id} current passengers: ${elevator.passengers.length}.`);
    });
  }

  //檢查是否有乘客在電梯會經過的路徑或方向上
  public checkWaitingPassengers(passenger: Passenger): boolean {
    const { startFloor, direction } = passenger;
    let canBePicked = false;
    this.controller.view.elevators.forEach((elevator) => {
      if (canBePicked) return;
      let currentFloor = elevator.currentFloor;
      //方向不同不管有沒有經過都不載
      if (elevator.direction !== direction) return;
      if (elevator.direction === "up") {
        //電梯向上會經過可以順便載
        let targetFloor = Math.max(...elevator.targetFloors);
        if (startFloor >= currentFloor && startFloor <= targetFloor) {
          canBePicked = true;
        }
      } else if (elevator.direction === "down") {
        //電梯向下會經過可以順便載
        let targetFloor = Math.min(...elevator.targetFloors);
        if (startFloor <= currentFloor && startFloor >= targetFloor) {
          canBePicked = true;
        }
      }
    });
    return canBePicked;
  }
}
