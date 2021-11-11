const express = require("express");
// Mock database set up

const payerRouter = require("./routes/payer");
const transactionRouter = require("./routes/transaction");

// Express.js set up
const app = express();
app.use(express.json()); // Body parser alternative

// Routes middleware
// app.use(payerRouter);
app.use(transactionRouter);

// const Payer = require("./models/Payer");

// Routes middleware
// app.use("/transaction", require("./routes/transaction.js"));

// new_payer = new Payer("Nintendo", 5000);
// new_payer.print();

// app.get("/", (req, res) => {
//   console.log("here");
//   return res.status(201).json({ data: "here" });
// });

// // Retrieve the balances of all payers/companies for a given user
// app.get("/payer/balances");

// /* When a payer want to add/deposit points to a user account
//     1. User's account gets points added
//     2. User's metadata on Fetch's system gets recorded. So,
//         we want to record the payer/company, point amount, and
//         timestamp it was given*/
// // ADD TRANSACTION CALL
// app.post("/transaction/add");

// /* A user may spend points
//     1. Transaction points field is a deduction
//     2. User's point field is the actual balance
//  */
// // SPEND CALL -> returns an object of payers we chose to deduct from
// app.post("/consumer/points");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port ${PORT}`));
