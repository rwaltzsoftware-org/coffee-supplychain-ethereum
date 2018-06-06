require('truffle-test-utils').init();

var SupplyChainStorage = artifacts.require("../contracts/SupplyChainStorage.sol");

contract('SupplyChainStorage',function(accounts)
{
	var spenderAddress = accounts[0];

	it("Authorize Caller Check: ",async() => {

		const instanceSupplyChainStorage = await SupplyChainStorage.deployed();
		const authorizedCaller = accounts[1];

		/* Authorized Caller */
		const authorizeStatus = await instanceSupplyChainStorage.authorizeCaller(authorizedCaller,{from:spenderAddress});

		console_log("Checking AuthorizedCaller Event: ");
		
		assert.web3Event(authorizeStatus,{
			event: 'AuthorizedCaller',
			args: {
				caller: authorizedCaller
			}
		},"Caller Authorization");
	});

	it("DeAuthorize Caller",async() => {

		const instanceSupplyChainStorage = await SupplyChainStorage.deployed();
		const authorizedCaller = accounts[1];

		/* Authorized Caller */
		const authorizeStatus = await instanceSupplyChainStorage.deAuthorizeCaller(authorizedCaller,{from:spenderAddress});

		console_log("Checking DeAuthorizedCaller Event: ");

		assert.web3Event(authorizeStatus,{
			event: 'DeAuthorizedCaller',
			args:{
				caller:authorizedCaller
			}
		},"Caller DeAuthorization");

		
	});

	it("Set/Get User Check ",async() => {

		const instanceSupplyChainStorage = await SupplyChainStorage.deployed();
		const watcher = instanceSupplyChainStorage.UserUpdate();

		var _userAddress = accounts[2];
		var _name = "Nitish";
		var _contactNo = "8983588914";
		var _role = "FARM_INSPECTION";
		var _isActive = true;
		var _profileHash = "SAMPLE_HASH";

		/* Authorized Caller */
		const status = await instanceSupplyChainStorage.setUser(_userAddress,_name,_contactNo,_role,_isActive,_profileHash,{from:spenderAddress});

		

		/* Check Event Wise */
		const events = await watcher.get();

		console_log("Checking UserUpdate Event: ");

		assert.web3Event(status,{
			event:'UserUpdate',
			args:{
				user:_userAddress,
				name:_name,
				contactNo: _contactNo,
				role: _role,
				isActive: _isActive,
				profileHash: _profileHash
			}
		},"UserUpdate");


		/* Check Function Call wise  */
		console_log("Checking Get User Details : ");

		const user = await instanceSupplyChainStorage.getUser(_userAddress,{from:spenderAddress});			

		assert.equal(user[0],_name,"Name Check:");
		assert.equal(user[1],_contactNo,"Contact no Check:");
		assert.equal(user[2],_role,"Role Check:");
		assert.equal(user[3],_isActive,"Is active Check:");
		assert.equal(user[4],_profileHash,"Profile Hash Check:");

		
	});

	it("Set/Get Cultivation Basic Details ",async() => {

		const instanceSupplyChainStorage = await SupplyChainStorage.deployed();
		const authorizedCaller = accounts[1];

		const watcher = instanceSupplyChainStorage.PerformCultivation();

		var _registrationNo = "123456789";
		var _farmerName = "Ramu Kaka";
		var _farmAddress = "Nashik";
		var _exporterName = "Rudra Logistics";
		var _importerName = "Boulders Logistics";

		/* Authorized Caller */
		console_log("Authorizing User: " + authorizedCaller);
		const authorizeStatus = await instanceSupplyChainStorage.authorizeCaller(authorizedCaller,{from:spenderAddress});

		const status = await instanceSupplyChainStorage.setBasicDetails(
																	_registrationNo,
																	_farmerName,
																    _farmAddress,
																    _exporterName,
																    _importerName,{from:authorizedCaller});

		const events = await watcher.get();

		console_log("Checking PerformCultivation Event: ");

		assert.web3Event(status,{
			event:'PerformCultivation',
			args:{
				user:authorizedCaller,
				batchNo:events[0].args.batchNo
			}
		},"PerformCultivation");


		/* Check Function Call wise  */
		console_log("Checking Get Basic Details : ");

		const user = await instanceSupplyChainStorage.getBasicDetails(events[0].args.batchNo,{from:authorizedCaller});			

		assert.equal(user[0],_registrationNo,"Registration No Check:");
		assert.equal(user[1],_farmerName,"Farmer Name Check:");
		assert.equal(user[2],_farmAddress,"Farmer Address Check:");
		assert.equal(user[3],_exporterName,"Exporter Check:");
		assert.equal(user[4],_importerName,"Importer Check:");


	});
})

function console_log(message)
{
	console.log("=> " + message);
}