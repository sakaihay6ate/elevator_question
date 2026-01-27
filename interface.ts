export interface IPassenger {
  id: number;
  startFloor: number;
  targetFloor: number;
}

export interface IElevator {
  id: number;
  currentFloor: number;
  targetFloors: Set<number>;
  passengers: IPassenger[];
  direction: "up" | "down" | "idle";
  servedPassengersCount: number;
}
