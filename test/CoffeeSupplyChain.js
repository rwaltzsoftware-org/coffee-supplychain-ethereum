/*Require for Events*/
require('truffle-test-utils').init();

var CoffeeSupplyChain = artifacts.require('../contracts/CoffeeSupplyChain.sol');

contract('CoffeeSupplyChain',function(accounts){
	console.log(accounts);
});