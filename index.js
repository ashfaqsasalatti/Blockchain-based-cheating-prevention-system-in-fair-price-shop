const express = require('express');
const app = express();

app.use(express.static('views'));
// Set the view engine and views folder
app.set('view engine', 'ejs');
app.set('views', 'views');

require("dotenv").config();
var twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_TOKEN
);

var ph;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.render('menu');
});

app.get('/add', (req, res) => {
    res.render('add_user');
});

app.get("/sendOtp", (req, res) => {
    ph ='+' + req.query.phone.toString();;
    twilio.verify.v2
    .services("VA89b1ef3ffabd3726f6919f5309a5a239")
    .verifications.create({ to: ph, channel: "sms" })
    .then((verification) => console.log(verification.sid));
    res.status(200).send();
  });
  
  
  app.post("/verify", (req, res) => {
    const otp = req.body.otp;
    const contract = req.body.cont;
    const signer = req.body.sign;
  
    twilio.verify.v2.services("VA89b1ef3ffabd3726f6919f5309a5a239")
    .verificationChecks
    .create({to: ph, code: otp})
    .then( async(verification_check) =>{
      console.log(verification_check.status)
      if(verification_check.status === "approved"){
        res.status(200)
        address = await signer.getAddress();
        result = await contract.distribute(address);
        await result.wait();
        if (result.hash) {
          console.log("Transaction successful!");
        } else {
          console.log("Transaction failed!");
        }
        res.render('dist_login')
      }
      else{
        res.status('500')
      }
  });
    
    
  });
  
  
  
  
  app.get("/distribute", (req, res) => {
    
    res.render('dist_login');
  });
  
  
  
  app.get("/repo", (req, res) => {
    
    res.render('reports')
  });
  
  
  
  // setting, deleting and retrieving items by government
  app.get("/gov", (req, res) => {
    
    res.render('gov');
  });
  


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
