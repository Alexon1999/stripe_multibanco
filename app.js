require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.secret_key);
const axios = require("axios");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "stripe webhook :)" });
});

// Once the source is chargeable =  client send the funds
app.post("/webhook-source-chargeable", async (req, res) => {
  // we get the source object
  const source = req.body;

  // make a charge request
  try {
    const charge = await stripe.charges.create({
      amount: source.data.object.amount,
      currency: "eur",
      source: source.data.object.id,
      metadata: {
        order: source.data.object.metadata.order,
        email: source.data.object.owner.email,
        name: source.data.object.owner.email,
      },
    });
    res.json({ msg: "charge created" });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

// Confirm that the charge has succeeded
app.post("/webhook-charge-succeeded", async (req, res) => {
  // we get the charge object
  const charge = req.body;
  // email :  charge.data.object.metadata.email

  // ex: send email to client

  res.json({ msg: "charge has succeeded" });
});

// Confirm failed
app.post("/webhook-charge-failed", async (req, res) => {
  // we get the charge object
  const charge = req.body;

  // ex: send email to client

  res.json({ msg: "charge has failed" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port on ${PORT}`));
