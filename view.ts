import config from "./constants";
import Elevator from "./components/elevator";
import Passenger from "./components/passenger";
import { IPassenger } from "./interface";
const { TOTAL_ELEVATORS } = config;

export default class View {
  elevators: Elevator[] = [];
  waitingPassengers: Passenger[] = [];

  constructor() {
    this.createScene();
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
    this.waitingPassengers.push(passenger);
    console.log(`Passenger generated at floor ${startFloor} wanting to go to floor ${targetFloor}.`);
  }

  public setElevatorIdle(elevatorId: number): void {
    const elevator = this.elevators.find((e) => e.id === elevatorId);
    if (elevator) {
      elevator.direction = "idle";
      console.log(`Elevator ${elevatorId} is now idle.`);
    }
  }
}
