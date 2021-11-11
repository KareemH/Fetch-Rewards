class Payer {
  constructor(payer, points) {
    this.payer = payer;
    this.points = points;
  }

  print() {
    console.log({
      payer: this.payer,
      points: this.points,
    });
  }
}

module.exports = Payer;
