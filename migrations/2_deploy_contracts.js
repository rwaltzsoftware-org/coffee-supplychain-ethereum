const SupplyChainStorage = artifacts.require("SupplyChainStorage");
const CoffeeSupplyChain = artifacts.require("CoffeeSupplyChain");

module.exports = function(deployer){

				deployer.deploy(SupplyChainStorage)
				.then(()=>{
					return deployer.deploy(CoffeeSupplyChain,SupplyChainStorage.address)
						   .then(()=>{
						   		return SupplyChainStorage.deployed().then(function(instance){
						   				return instance.authorizeCaller(CoffeeSupplyChain.address);
						   		});
						   });	
				});

};