class Points {
  constructor(points) {
    this.points = points;
  }

  print() {
    console.log({
      points: this.points,
    });
  }
}

module.exports = Points;
