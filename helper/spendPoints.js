const Payer = require("../models/Payer");
const payer = require("../repository/payer");

module.exports = class SpendPoints {
  constructor() {
    this.points_subtracted = {};
  }

  subtractPointsFromPayer(payer, withdrawal) {
    // If we have a key:value of payer in points_subtracted
    if (this.points_subtracted[payer]) {
      this.points_subtracted[payer] += -1 * withdrawal;
    }
    // If the key doesn't exist
    else {
      this.points_subtracted[payer] = -1 * withdrawal;
    }
    return;
  }

  getPayersSubtractedPoints() {
    let payerSpentPoints = [];

    for (let payer in this.points_subtracted) {
      let points = this.points_subtracted[payer];
      let newPayer = new Payer(payer, points);
      payerSpentPoints.push(newPayer);
    }

    return payerSpentPoints;
  }
};
