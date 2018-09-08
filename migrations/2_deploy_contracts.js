var SupplyChainStorage = artifacts.require("./SupplyChainStorage");
var CoffeeSupplyChain = artifacts.require("./CoffeeSupplyChain");
var SupplyChainUser = artifacts.require("./SupplyChainUser");


module.exports = function(deployer){
	deployer.deploy(SupplyChainStorage)
	.then(()=>{
		return deployer.deploy(CoffeeSupplyChain,SupplyChainStorage.address);
	})
	.then(()=>{
		return deployer.deploy(SupplyChainUser,SupplyChainStorage.address);
	})
	.then(()=>{
   		return SupplyChainStorage.deployed();
    }).then(async function(instance){
		await instance.authorizeCaller(CoffeeSupplyChain.address); 
		await instance.authorizeCaller(SupplyChainUser.address);
		return instance;
	})
	.catch(function(error)
	{
		console.log(error);
	});
};



