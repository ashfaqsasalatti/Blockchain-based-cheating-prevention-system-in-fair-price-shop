


require("dotenv").config();
var twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_TOKEN
);




twilio.verify.v2.services("VA89b1ef3ffabd3726f6919f5309a5a239")
.verificationChecks
.create({to: "+917975101583", code: 767299})
.then(verification_check => {
  console.log(verification_check.status)
})