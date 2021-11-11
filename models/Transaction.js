class Transaction {
  // timestamp is ISO date
  constructor(payer, points, timestamp) {
    this.payer = payer;
    this.points = points;
    this.timestamp = timestamp;
  }

  print() {
    console.log({
      payer: this.payer,
      points: this.points,
      timestamp: this.timestamp,
    });
  }
}

module.exports = Transaction;
