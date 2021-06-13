const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "stripe webhook :)" });
});

app.post("/webhook", (req, res) => {
  const data = req.body;

  res.json({ data });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port on ${PORT}`));
