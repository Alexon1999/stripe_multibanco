const express = require("express");
const stripe = require("stripe")(
  "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"
);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "stripe webhook :)" });
});

app.post("/webhook", async (req, res) => {
  // we get the source object
  const source = req.body;

  switch (source.type) {
    case "source.chargeable":
      const charge = await stripe.charges.create({
        amount: source.data.object.amount,
        currency: "eur",
        source: source.data.object.id,
      });
      // res.json({ msg: "charge created" });
      break;
    default:
      res.json(source);
  }

  res.json(source);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port on ${PORT}`));
