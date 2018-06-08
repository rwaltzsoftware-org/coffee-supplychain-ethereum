var SupplyChainStorage = artifacts.require("./SupplyChainStorage");
var CoffeeSupplyChain = artifacts.require("./CoffeeSupplyChain");
var SupplyChainUser = artifacts.require("./SupplyChainUser");


module.exports = function(deployer){
	deployer.deploy(SupplyChainStorage)
	.then(()=>
	{
		return deployer.deploy(CoffeeSupplyChain,SupplyChainStorage.address);
			   	
	}).then(()=>
    {
   		return deployer.deploy(SupplyChainUser,SupplyChainStorage.address)
	   
    }).then(()=>
    {
   		return SupplyChainStorage.deployed();
    }).then(function(instance)
	{
		instance.authorizeCaller(CoffeeSupplyChain.address); 
		return instance;

	}).then(function(instance)
	{
		// return instance.authorizeCaller(SupplyChainUser.address); 
		instance.authorizeCaller(SupplyChainUser.address); /* Fix for Saving artifact issue on testnet  */
	})
	.catch(function(error)
	{
		console.log(error);
	});
};



