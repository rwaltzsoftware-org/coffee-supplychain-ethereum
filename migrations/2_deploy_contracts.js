var SupplyChainStorage = artifacts.require("./SupplyChainStorage");
var CoffeeSupplyChain = artifacts.require("./CoffeeSupplyChain");
var SupplyChainUser = artifacts.require("./SupplyChainUser");


module.exports = function(deployer){
	deployer.deploy(SupplyChainStorage)
	.then(()=>{
   		return SupplyChainStorage.deployed();
    }).then(async (SupplyChainStorageInstance)=>{
		await Promise.all([deployer.deploy(CoffeeSupplyChain,SupplyChainStorage.address),
			   			deployer.deploy(SupplyChainUser,SupplyChainStorage.address)]);
	   
	    return SupplyChainStorageInstance;
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



