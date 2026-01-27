export default class Elevator {
  public id: number;
  //單次下電梯的人數統計
  public servedPassengersCount: number = 0;

  constructor(id: number) {
    this.id = id;
    console.log(`Elevator ${id} initialized`);
  }

  public setElevatorIdle(): void {
    console.log(`Elevator ${this.id} is now idle.`);
  }

  //資料抽到model 只留下view的表現
  public moveToFloor(elevatorId: number, currentFloor: number, targetFloor: number): void {
    console.log(`Elevator ${elevatorId} current floor is ${currentFloor} and target is ${targetFloor}.`);
  }

  //todo 抽到model
  public getServedPassengersCount(): number {
    const count = this.servedPassengersCount;
    this.servedPassengersCount = 0; // Reset after reporting
    return count;
  }
}
