export default class Passenger {
  public startFloor: number;
  public targetFloor: number;
  public id: number;
  public direction: "up" | "down";

  constructor(id: number, startFloor: number, targetFloor: number) {
    this.id = id;
    this.startFloor = startFloor;
    this.targetFloor = targetFloor;
    this.direction = targetFloor > startFloor ? "up" : "down";
  }

}
