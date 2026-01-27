import Elevator from "./components/elevator";
import Passenger from "./components/passenger";
import config from "./constants";
import { IPassenger } from "./interface";
const { TOTAL_ELEVATORS } = config;

export default class View {
  elevators: Elevator[] = [];
  passengers: Passenger[] = [];

  constructor() {
    console.log("View initialized");
  }

  public createScene(): void {
    console.log("Scene created");
    for (let i = 0; i < TOTAL_ELEVATORS; i++) {
      this.elevators.push(new Elevator(i + 1));
    }
  }

  public createPassenger(passengerData: IPassenger): void {
    const { id, startFloor, targetFloor } = passengerData;
    const passenger = new Passenger(id, startFloor, targetFloor);
    this.passengers.push(passenger);
  }

  public setElevatorIdle(elevatorId: number): void {
    const elevator = this.elevators.find((e) => e.id === elevatorId);
    elevator?.setElevatorIdle();
  }
}
