class Road {
  constructor(x, width, laneCount) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = this.x - width / 2;
    this.right = this.x + width / 2;

    const infinity = 1000000000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topRight, bottomRight],
      [topLeft, bottomLeft],
    ];
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  draw(context) {
    context.lineWidth = 5;
    context.strokeStyle = "white";
    context.setLineDash([10, 5]);
    context.beginPath();


    


    context.setLineDash([]);
    this.borders.forEach((border) => {
      context.beginPath();
      context.moveTo(border[0].x, border[0].y);
      context.lineTo(border[1].x, border[1].y);

      context.stroke();
    });
    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      context.moveTo(x, this.top); //starting point
      context.lineTo(x, this.bottom); //end point
      context.stroke();

    }
  }
}
