const express = require("express");
const app = express();

// Middleware handling
app.use(express.json());

app.get("/", (req, res) => {
  console.log("here");
  return res.status(201).json({ data: "here" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port ${PORT}`));
