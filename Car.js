class Car {
  constructor(x, y, width, height, driverType, maxspeed = 3,num = Math.floor(Math.random() * 3)) {
    this.num = num
    this.driverType = driverType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = 0.0;

    this.img = new Image();
    this.img.src = "car.png";

    this.img2 = new Image();
    this.img2.src = "car2.png";

    this.img3 = new Image();
    this.img3.src = "car3.png";

    this.img4 = new Image();
    this.img4.src = "car4.png";

    this.carimgs = [this.img2, this.img3, this.img4];

    this.speed = 0;
    this.acceleration = 0.2;
    this.damaged = false;
    this.friction = 0.05;
    this.useBrain = driverType == "AI";

    if (driverType !== "NPC") {
      this.sensors = new Sensor(this);
      this.brains = new NeuralNetwork([this.sensors.rayCount, 6, 4]);
    }
    this.maxspeed = maxspeed;

    this.controls = new Controls(driverType);
  }

  update(roadBorders, trafic) {
    if (!this.damaged) {
      this.#move();
      this.poligon = this.#createPolgone();
      this.damaged = this.#assessDamage(roadBorders, trafic);
    }
    if (this.sensors) {
      this.sensors.update(roadBorders, trafic);
      const offsets = this.sensors.readings.map((reading) => {
        return reading == null ? 0 : 1 - reading.offset;
      });
      const outputs = NeuralNetwork.feedForward(offsets, this.brains);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, trafic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersection(this.poligon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < trafic.length; i++) {
      if (polysIntersection(this.poligon, trafic[i].poligon)) {
        return true;
      }
    }
  }

  #createPolgone() {
    const poits = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    poits.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    poits.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    poits.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    poits.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return poits;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxspeed) {
      this.speed = this.maxspeed;
    }

    if (this.speed < -this.maxspeed / 2) {
      this.speed = -this.maxspeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.04 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.04 * flip;
      }
    } else {
      this.angle = this.angle;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(context, drawSensor = false) {
    if (this.sensors && drawSensor) {
      this.sensors.draw(context);
    }
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    if (this.driverType != "NPC") {
      context.drawImage(
        this.img,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {

      context.drawImage(
        this.carimgs[this.num],
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }

    context.restore();
  }
}
