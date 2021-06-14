require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.secret_key);
var nodemailer = require("nodemailer");

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
        owner: {
          email: source.data.object.owner.email,
          name: source.data.object.owner.email,
        },
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

  // ex: send email to client
  // var transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "youremail@gmail.com",
  //     pass: "yourpassword",
  //   },
  // });

  // var mailOptions = {
  //   from: "youremail@gmail.com",
  //   to: "myfriend@yahoo.com",
  //   subject: "Sending Email using Node.js",
  //   text: "That was easy!",
  // };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

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
