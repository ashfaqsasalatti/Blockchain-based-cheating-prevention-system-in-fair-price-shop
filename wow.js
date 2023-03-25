
const path = require("path");
const fs = require("fs");
const solc = require("solc");



const examplePath = path.resolve(__dirname, "ration.sol");
const source = fs.readFileSync(examplePath, "utf-8");

var input = {
	language: 'Solidity',
	sources: {
		'ration.sol': {
			content: source
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*']
			}
		}
	}
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));


var ABI = output.contracts["ration.sol"]["Ration"].abi;

var bytecode = output.contracts['ration.sol']["Ration"].evm.bytecode.object;

module.exports = { ABI, bytecode };
//console.log(interface);
//console.log(bytecode)