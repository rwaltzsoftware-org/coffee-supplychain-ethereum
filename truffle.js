var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = 
{
    networks: 
    {
	    development: 
		{
	   		host: "localhost",
	   		port: 8545,
	   		network_id: "*" // Match any network id
		},
    	rinkeby: {
    		host: "localhost",
	   		port: 8545,
		    provider: function() {
		      var mnemonic = "snap call clerk burger farm wash pistol easy chronic embrace feature erosion";	
		      return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/8U0AE4DUGSh8lVO3zmma");
		    },
		    network_id: '4',		 
		    gas: 6054449,
		    gasPrice: 1000000000
		}  
    },
    mocha: {
	    reporter: 'eth-gas-reporter',
	    reporterOptions : {
	      currency: 'CHF',
	      gasPrice: 21
	    }
	}
};