const express = require("express");
const app = express();
require("dotenv").config();
var twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_TOKEN
);

var ph;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


fs = require("fs");


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/menu.html");
});

app.get("/sendOtp/:phone", (req, res) => {
  ph = req.query.phone;
  client.verify.services(verifyServiceSid)
  .verifications
  .create({to: ph, channel: 'sms'})
  .then(verification => console.log(verification.sid));
});


app.post("/verify", (req, res) => {
  const otp = req.body.otp;

  twilio.verify.v2.services('VA1f62ba69c47c25a2176ffffd9606de97')
  .verificationChecks
  .create({to: "+917975101583", code: otp})
  .then(verification_check => console.log(verification_check.status));
  
  res.send(__dirname + "/views/recod_logs.html");
});




app.get("/distribute", (req, res) => {
  res.sendFile(__dirname + "/views/dist_login.html");
});



app.get("/repo", (req, res) => {
  res.sendFile(__dirname + "/views/reports.html");
});



// setting, deleting and retrieving items by government
app.get("/gov", (req, res) => {
  res.sendFile(__dirname + "/views/gov.html");
});



app.listen(3000, () => {
  console.log("started");
});
