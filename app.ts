// 1. 請完成以下電梯管理系統

// ■ 條件如下:
// 1. 大樓共10層樓，2部電梯，每層電梯共用1組按鈕
// 2. 電梯只可容納5人
// 3. 每行經一層樓需耗時1秒
// 4. 每停一次處理接人放人需耗1秒
// 5. 每秒產生1個人按電梯，設定出現樓層與目標的樓層，樓層隨機
// 6. 模擬放進40人次，該設計需消耗掉所有人數，並統計秒數
// ■ 設計方式:
// 1.請用擅長的程式設計出上述題目的架構(列出所需的物件、函式)
// 2.請寫出上述題目的運作流程
// 3.請描述設計概念、物件、函式的功能
// 4.模擬真實電梯的運作情況，為電梯的運行制訂策略，並盡可能優化演算法，讓電梯變的更有效率
// 5. 盡可能讓程式可以執行，並印出log以顯示電梯與乘客的變化
import Elevator from "./components/elevator";
import Passenger from "./components/passenger";
import config, { debugMode } from "./constants";
const { TOTAL_FLOORS, TOTAL_ELEVATORS, TOTAL_PASSENGERS } = config;
const testDaata = [
  [1, 10],
  [9, 2],
];
class MainApp {
  private elevators: Elevator[] = [];
  private waitingPassengers: Passenger[] = [];
  private timeElapsed: number = 0;
  private passengersServed: number = 0;
  private passengers: number = 0;

  constructor() {
    for (let i = 0; i < TOTAL_ELEVATORS; i++) {
      this.elevators.push(new Elevator(i + 1));
    }
  }

  public startSimulation(): void {
    const interval = setInterval(() => {
      this.timeElapsed++;
      console.log(`\n--- Time Elapsed: ${this.timeElapsed} seconds ---`);
      if (this.passengers < TOTAL_PASSENGERS) {
        this.generatePassenger();
      }
      this.elevators.forEach((elevator) => {
        elevator.operate(this.waitingPassengers);
      });

      this.checkPassengersServed();
      console.log(`Total passengers served: ${this.passengersServed}/${TOTAL_PASSENGERS}`);

      if (this.passengersServed >= TOTAL_PASSENGERS) {
        clearInterval(interval);
        console.log(`Simulation ended in ${this.timeElapsed} seconds.`);
      }
    }, 10);
  }

  private generatePassenger(): void {
    let startFloor = Math.floor(Math.random() * TOTAL_FLOORS) + 1;
    let targetFloor: number;
    do {
      targetFloor = Math.floor(Math.random() * TOTAL_FLOORS) + 1;
    } while (targetFloor === startFloor);
    if (debugMode) {
      startFloor = testDaata[this.passengers][0];
      targetFloor = testDaata[this.passengers][1];
    }

    const passenger = new Passenger(this.timeElapsed, startFloor, targetFloor);
    this.waitingPassengers.push(passenger);
    this.passengers++;
    console.log(`Passenger generated at floor ${startFloor} wanting to go to floor ${targetFloor}.`);
  }

  private checkPassengersServed(): void {
    this.elevators.forEach((elevator) => {
      this.passengersServed += elevator.getServedPassengersCount();
    });
  }
}

// Start the simulation
const app = new MainApp();
app.startSimulation();
