class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpred = Math.PI / 2;
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, trafic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReadings(this.rays[i], roadBorders, trafic));
    }
  }

  #getReadings(ray, roadBorders, trafic) {
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < trafic.length; i++) {
      const poly = trafic[i].poligon;

      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );

        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((touch) => touch.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((touch) => touch.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAnlge =
        lerp(this.raySpred / 2, -this.raySpred / 2, i / (this.rayCount - 1)) +
        this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAnlge) * this.rayLength,
        y: this.car.y - Math.cos(rayAnlge) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(context) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i];
      }
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "yellow";
      context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      context.lineTo(end.x, end.y);
      context.stroke();

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "red";
      context.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
  }
}
