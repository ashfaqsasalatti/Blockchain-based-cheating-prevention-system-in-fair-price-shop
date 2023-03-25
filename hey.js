const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res) =>{
    res.sendFile(__dirname +'/hey.html');
  });

  app.post('/fr',(req,res) => {
    //const phone = req.body.phone;
    console.log(req.body.fruits); 
  });

  app.listen(3000,() => {
    console.log("started");
  })