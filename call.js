
// file reader
fs = require("fs");

// Creation of Web3 class
Web3 = require("web3");

const { ABI } = require('./wow')


if (typeof web3 !== 'undefined'){
web3 = new Web3(web3.currentProvider);
}

else{

// Set the provider you want from Web3.providers
web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
}



// Set the ABI
var MyContract =new web3.eth.Contract(
	ABI,'0x1402B2183DC5820b768D9B19cB071279f0Afd84C' );

// Set the contrcat address
/*
var a = MyContract.methods.register("ashfaq",123,456,1,["san","waj"],'0xdeC9e2Dc8855f7A17C5b26AbB37F873Ee859B0C6').send({
  gas : 1000000,	
  from: '0xdeC9e2Dc8855f7A17C5b26AbB37F873Ee859B0C6'
}).then((err) => {
	console.log(err.status);
}); */


MyContract.methods.getPhone('0xdeC9e2Dc8855f7A17C5b26AbB37F873Ee859B0C6').call(
	{
		from : '0xdeC9e2Dc8855f7A17C5b26AbB37F873Ee859B0C6'
	}
).then((result)=>{
	const ph = result[0];
	
	hi(ph);
}); 
function hi(ph){
	console.log(ph)
}
