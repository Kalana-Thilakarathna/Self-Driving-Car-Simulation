const carCanvas = document.getElementById("carCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = window.innerHeight;
networkCanvas.width = 500;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");


const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
const N = 1000
const cars = generateCars(N)
const trafic = [
  new Car(road.getLaneCenter(1), -100, 30, 50,"NPC",2, ),
  new Car(road.getLaneCenter(2), -299, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(0), -450, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(0), -590, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(2), -700, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(1), -800, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(2), -850, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(0), -900, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(1), -1000, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(2), -1080, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(1), -1150, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(2), -1200, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(0), -1300, 30, 50,"NPC",2),
  
  new Car(road.getLaneCenter(1), -1500, 30, 50,"NPC",2),
  new Car(road.getLaneCenter(0), -1600, 30, 50,"NPC",2),

];
let bestCar = cars[0]
if (localStorage.getItem("bestBrain")){
  for (let i =0; i<cars.length; i++){
    cars[i].brains = JSON.parse(localStorage.getItem("bestBrain"))
    if (i!=0){
      NeuralNetwork.mutate(cars[i].brains,0.1)
    }
  }
  
}


animate();
function save(){
  localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brains)
  )
}

function discard(){
  localStorage.removeItem("bestBrain")
}

function generateCars(N){
  const cars = []
  for (let i = 0; i<N; i++){
    cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
  }
  return cars
}

function animate() {




  for (let i = 0; i < trafic.length; i++) {
    trafic[i].update(road.borders,[]);
  }

  for (let i = 0; i<cars.length; i++){
    cars[i].update(road.borders, trafic);
  }

  bestCar = cars.find(car=>car.y==Math.min(
    ...cars.map(car=>car.y)
  ))

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carContext.save();
  carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carContext);
  for (let i = 0; i < trafic.length; i++) {
    trafic[i].draw(carContext);
  }
  carContext.globalAlpha = 0.2
  for (let i = 0; i<cars.length; i++){
    cars[i].draw(carContext);
  }
  carContext.globalAlpha = 1
  
  bestCar.draw(carContext,true);

  carContext.save();
  Visualizer.drawNetwork(networkContext,bestCar.brains)
  requestAnimationFrame(animate);
}
