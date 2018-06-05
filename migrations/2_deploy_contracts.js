var SupplyChainStorage = artifacts.require("./SupplyChainStorage");
var CoffeeSupplyChain = artifacts.require("./CoffeeSupplyChain");
var SupplyChainUser = artifacts.require("./SupplyChainUser");


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
	deployer.deploy(SupplyChainUser,SupplyChainStorage.address);
	
};

