const express = require("express");
const transactionRouter = require("./routes/transaction");

// Express.js set up
const app = express();
app.use(express.json()); // Body parser alternative

// Routes middleware
app.use(transactionRouter);

// Set up development environment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port ${PORT}`));
