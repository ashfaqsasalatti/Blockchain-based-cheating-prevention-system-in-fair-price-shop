const express = require('express');
const app=express();
require('dotenv').config();
var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
const otpGenerator = require('otp-generator')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var sid = "AC186e83dda89b63878b101fab38067bb4";
var auth_token = "b19c05c0a4e7fbcf1cd2571776dffc0b";

//items
const items = {};
var amt;
var otp;
const { ABI } = require('./wow')
//const caddr  = require('./compile');


function addItem(item,value){
  items[item] = value;
}
function removeItem(item){
    delete items[item];
}
function show(){
    return items;
}

// file reader
fs = require("fs");

// Creation of Web3 class
Web3 = require("web3");




if (typeof web3 !== 'undefined'){
web3 = new Web3(web3.currentProvider);
}

else{

// Set the provider you want from Web3.providers
web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
}


// Set the ABI
var MyContract =new web3.eth.Contract(
	ABI,'0xaEca2f7821b57a18b4364B8248E3C3c5170de624');
  
  function hi(ph){

    otp = otpGenerator.generate(6, { upperCaseAlphabets: false ,lowerCaseAlphabets: false, specialChars: false });
   twilio.messages
   .create({
     from: "+17174938602",
     to: '+' + ph,
     body: otp,
   })
   .then(function(res) {console.log("message has sent!")
   })
   .catch(function(err)  {
     console.log(err);
   });
  }


app.get('/',(req,res) =>{
  res.sendFile(__dirname +'/views/menu.html');
});

 app.get('/add',(req,res)=>{
  res.sendFile(__dirname +'/views/add_user.html')
 })

 app.post('/add',(req,res)=>{
   const name = req.body.name;
   const adhar = req.body.adhar;
   const mobile = req.body.mobile;
   const apl = req.body.apl;
   const fam = req.body.fam;
   const addr = '0x77B9B5544A84ecE6B9c47af2FAC589C6e1E91FC1';
   //console.log(name,adhar,mobile,apl,fam);

   var a = MyContract.methods.register(name,mobile,adhar,apl,fam,addr).send({
    gas : 1000000,	
    from: addr
  }).then((err) => {
    console.log(err.status);
  });
  res.sendFile(__dirname +'/views/add_user.html')
 });



 app.get('/otp',(req,res)=>{
  res.sendFile(__dirname +'/views/dist_login.html')
 });



 app.post('/enter_otp',(req,res)=>{
  const addr = req.body.id;
  MyContract.methods.getPhone(addr).call(
    {
      from : addr
    }
  ).then((result)=>{
    const ph = result[0];
    amt = result[1];

    
    hi(ph);
    res.redirect('/verify');
  }) 
 });

 app.get('/verify',(req,res)=>{
  res.sendFile(__dirname +'/views/enter_otp.html');
 })

 app.post('/verify_otp',(req,res)=>{
   if(otp == req.body.otp){
    res.redirect('/distribute')
   }
 })
 app.get('/repo',(req,res)=>{
  res.sendFile(__dirname +'/views/reports.html')
 })
 app.get('/distribute',(req,res)=>{
  res.sendFile(__dirname +'/views/dist_login.html')
 })
 
  app.post('/distribute',(req,res)=>{
    var newI ={}
    for (const key in items) {
      newI[key] = items[key] * amt;
      console.log(amt)
    }
    MyContract.methods.verified('0x669164D9aC977C48DBa13F969D830801549Aebd8',amt).send({
      gas : 1000000,	
      from: '0x669164D9aC977C48DBa13F969D830801549Aebd8'
    }).then((err) => {
      console.log(err.status);
    });
    res.send(newI)

  })

  app.get('/transac',(req,res)=>{
    var z;
    var x = MyContract.methods.transac('0x669164D9aC977C48DBa13F969D830801549Aebd8').call({
      gas : 1000000,	
      from: '0x669164D9aC977C48DBa13F969D830801549Aebd8'
    }).then((err) => {
      var newI ={}
      for (const key in items) {
        newI[key] = items[key] * err;
      }
      res.send(newI)
    })
    
  });


 app.get('/gov',(req,res)=>{
  res.sendFile(__dirname +'/views/gov.html');
 })
 app.post('/addI',(req,res)=>{
  items[req.body.item]=req.body.value;
 })
 app.post('/delI',(req,res)=>{
  delete items[req.body.item];
 })
 app.post('/showI',(req,res)=>{
  res.send(items);
 })

  app.listen(3000,() => {
    console.log("started");
  })
  