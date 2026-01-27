import Model from "./model";
import View from "./view";
import config from "./constants";
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

  public startSimulation(): void {
    const interval = setInterval(() => {
      this.model.timeElapsed++;
      console.log(`\n--- Time Elapsed: ${this.model.timeElapsed} seconds ---`);
      if (this.model.passengers < TOTAL_PASSENGERS) {
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
    this.model.operateElevators(this.view.elevators, this.view.waitingPassengers);
  }

  private checkPassengersServed(): void {
    this.view.elevators.forEach((elevator) => {
      this.model.passengersServed += elevator.getServedPassengersCount();
    });
  }
}
