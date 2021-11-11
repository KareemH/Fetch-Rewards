const router = require("express").Router();
const transactionRepo = require("../repository/transaction");
const payerRepo = require("../repository/payer");
const Transaction = require("../models/Transaction");
const Payer = require("../models/Payer");
const SpendPoints = require("../helper/spendPoints");

/**
 * @route POST /transaction/addPoints
 * @desc Given a transaction, add points to it's payer if already exists.
 * If it doesn't exist, create the payer profile
 * @access Public
 */
router.post("/transaction/addPoints", async (req, res) => {
  // console.log(req.body);
  let transaction = req.body;
  // See if we already have the data for a given payer/partner
  retrieved_payer = await payerRepo.getPayer(transaction.payer);

  // If the payer/partner exists, update the balance amount
  // If the payer/partner does not exist, make a new payer profile and set it points
  if (retrieved_payer) {
    await payerRepo.update(retrieved_payer.id, {
      points: retrieved_payer.points + transaction.points,
    });
  } else {
    await payerRepo.create(new Payer(transaction.payer, transaction.points));
  }

  // At the same time, add this transaction to the transaction-store
  await transactionRepo.create(
    new Transaction(
      transaction.payer,
      transaction.points,
      transaction.timestamp
    )
  );

  // Notify the user of successful creation
  return res
    .status(201)
    .json({ message: "Persisted transaction and updated payer" });
});

/**
 * @route PUT /user/spendPoints
 * @desc User spend points, but backend decides which points to withdraw from
 * Points should be withdrawn from the oldest dates, do not dip below 0 for any payer
 * @access Public
 */
router.put("/user/spendPoints", async (req, res) => {
  pointsSortedByOldestDate = await transactionRepo.getPoints();
  // console.log(req.body);
  let withdraw_points = req.body.points;
  let spendPoints = new SpendPoints();
  // console.log(pointsSortedByOldestDate);

  // Determine which payers/parteners to deduct from
  for (let i = 0; i < pointsSortedByOldestDate.length; i++) {
    let transaction = pointsSortedByOldestDate[i];
    // Used up all desired spend points
    if (withdraw_points <= 0) {
      break;
    }
    // If a transaction is less than points to spend, can help deduct "points to spend" overtime
    else if (transaction.points < withdraw_points) {
      withdraw_points = withdraw_points - transaction.points;
      spendPoints.subtractPointsFromPayer(
        transaction.payer,
        transaction.points
      );
      await transactionRepo.removeSingleTransaction(transaction.id);
    }
    // If a transaction is greater than points to spend, can help deduct "points to spend" immediately
    else {
      updated_points = transaction.points - withdraw_points;
      spendPoints.subtractPointsFromPayer(transaction.payer, withdraw_points);
      await transactionRepo.update(transaction.id, {
        points: updated_points,
      });
      withdraw_points = 0;
    }
  }

  // Update each payer's overall balance
  for (let payer in spendPoints.points_subtracted) {
    points_deducted = spendPoints.points_subtracted[payer];
    await payerRepo.updateBalance(payer, points_deducted);
  }

  return res
    .status(201)
    .json({ data: spendPoints.getPayersSubtractedPoints() });
});

/**
 * @route GET /payer/allBalances
 * @desc Retrieve the point balance of all payers
 * @access Public
 */
router.get("/payer/allBalances", async (req, res) => {
  allPayerBalances = await payerRepo.getAll();
  // console.log(allPayerBalances);
  return res.status(201).json({ data: allPayerBalances });
});

module.exports = router;
