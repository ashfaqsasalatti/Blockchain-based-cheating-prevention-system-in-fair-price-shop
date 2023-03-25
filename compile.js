
// solc compiler
solc = require("solc");

// file reader
fs = require("fs");

// Creation of Web3 class
Web3 = require("web3");

var caddr;
const { ABI, bytecode } = require("./wow");


// Setting up a HttpProvider
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));



const deploy = async () => {
	// Get access to all accounts linked to mnemonic
	// Make sure you have metamask installed.
	const accounts = await web3.eth.getAccounts();
   
	//console.log("Attempting to deploy from account", accounts[0]);
   
	// Pass initial gas and account to use in the send function
	const result = await new web3.eth.Contract(ABI)
	  .deploy({ data: bytecode })
	  .send({ gas: "1000000", from: accounts[0]}).then(res =>{
		hey(res);
	  });
	 // caddr = result.options.address;
	//console.log("Contract deployed to", result.options.address);
	
  };
   
  deploy()
  function hey(res){
	caddr = res.options.address;
	console.log(caddr)
  }
   
