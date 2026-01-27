import Model from "./model";
import View from "./view";
import config from "./constants";
import { IElevator, IPassenger } from "./interface";

const { TOTAL_PASSENGERS } = config;
export default class Controller {
  // Controller class implementation
  model: Model;
  view: View;
  constructor() {
    // Initialization code
    this.model = new Model(this);
    this.view = new View();
  }

  public createScene(): void {
    this.model.createElevators();
    this.view.createScene();
  }

  public startSimulation(): void {
    const interval = setInterval(() => {
      this.model.timeElapsed++;
      console.log(`\n--- Time Elapsed: ${this.model.timeElapsed} seconds ---`);
      if (this.model.passengersNum < TOTAL_PASSENGERS) {
        this.generatePassenger(this.model.timeElapsed);
      }
      this.operateElevators();

      this.checkPassengersServed();
      console.log(`Total passengers served: ${this.model.passengersServed}/${TOTAL_PASSENGERS}`);

      if (this.model.passengersServed >= TOTAL_PASSENGERS) {
        clearInterval(interval);
        console.log(`Simulation ended in ${this.model.timeElapsed} seconds.`);
      }
    }, 10);
  }

  public setElevatorIdle(elevatorId: number): void {
    this.view.setElevatorIdle(elevatorId);
  }

  public generatePassenger(id: number): void {
    console.log("Controller: Creating passenger");
    let passengerData = this.model.createPassenger(id);
    this.view.createPassenger(passengerData);
  }

  public operateElevators(): void {
    this.model.operateElevators(this.view.elevators);
  }
  public moveElevatorToFloor(elevatorId: number, targetFloor: number): void {
    const elevator = this.view.elevators.find((e) => e.id === elevatorId);
    if (elevator) {
      elevator.moveToFloor({
        id: elevatorId,
        currentFloor: elevator.currentFloor,
        targetFloors: elevator.targetFloors,
        passengers: elevator.passengers,
        direction: elevator.direction,
        servedPassengersCount: elevator.servedPassengersCount,
      });
    }
  }

  loadPassengers(elevator: IElevator, passenger: IPassenger): void {
    //todo: view處理載入乘客的動畫
    console.log(`Passenger ${passenger.id} boarded Elevator ${elevator.id} at floor ${elevator.currentFloor}.`);
  }

  private checkPassengersServed(): void {
    this.view.elevators.forEach((elevator) => {
      this.model.passengersServed += elevator.getServedPassengersCount();
    });
  }
}
