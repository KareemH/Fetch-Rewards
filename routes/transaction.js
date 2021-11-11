const router = require("express").Router();
const transactionRepo = require("../repository/transaction");
const payerRepo = require("../repository/payer");
const Transaction = require("../models/Transaction");
const Payer = require("../models/Payer");
const SpendPoints = require("../helper/spendPoints");

/**
 * Create a new transaction log
 */
router.post("/transaction/create", async (req, res) => {
  console.log(req.body);

  let { payer, points, timestamp } = req.body;

  transaction_arr = await transactionRepo.getAll();
  // Get the transaction array

  transactionRepo.create(new Transaction(payer, points, timestamp));

  return res.status(201).json({ data: "Persisted transaction" });
});

/**
 * Given a transaction, add points to it's payer if already exists. If it doesn't exist
 */
router.post("/transaction/addpoints", async (req, res) => {
  console.log(req.body);
  let transaction = req.body;
  // See if we already have the data for a given payer/partner
  retrieved_payer = await payerRepo.getPayer(transaction.payer);

  // If the payer/partner exists, update the balance amount
  // If the payer/partner does not exist, make a new payer and set it points
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

/*
  User spend points, decide which points to withdraw from
*/
router.put("/spendPoints", async (req, res) => {
  pointsSortedByDescDate = await transactionRepo.getRecentPoints();
  // console.log(req.body);
  // console.log(pointsSortedAscendByDate);
  let withdraw_points = req.body.points;
  let spendPoints = new SpendPoints();
  // console.log(pointsSortedByDescDate);
  // return;
  // console.log(spendPoints);

  // Determine which payers/parteners to deduct from
  for (let i = 0; i < pointsSortedByDescDate.length; i++) {
    let transaction = pointsSortedByDescDate[i];
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
 * Retrieve the point balance of all payers
 */
router.get("/payer/allBalances", async (req, res) => {
  allPayerBalances = await payerRepo.getAll();
  console.log(allPayerBalances);
  return res.status(201).json({ data: allPayerBalances });
});

module.exports = router;
