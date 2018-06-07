/*Require for events*/
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

	it("Set/Get Cultivation",async() => {

		const instanceSupplyChainStorage = await SupplyChainStorage.deployed();
		const authorizedCaller = accounts[1];

		const basicDetailsWatcher = instanceSupplyChainStorage.PerformCultivation();
		const inspectionWatcher = instanceSupplyChainStorage.DoneInspection();
		const harvestWatcher = instanceSupplyChainStorage.DoneHarvesting();
		const exportWatcher = instanceSupplyChainStorage.DoneExporting();
		const importWatcher = instanceSupplyChainStorage.DoneImporting();
		const processorWatcher = instanceSupplyChainStorage.DoneProcessing();

		

		/* Authorized Caller */
		console_log("Authorizing User: " + authorizedCaller);
		const authorizeStatus = await instanceSupplyChainStorage.authorizeCaller(authorizedCaller,{from:spenderAddress});

		/********************* Basic Details Section ***********/

		/* Set Basic Details */

		var _registrationNo = "123456789";
		var _farmerName = "Ramu Kaka";
		var _farmAddress = "Nashik";
		var _exporterName = "Rudra Logistics";
		var _importerName = "Boulders Logistics";


		const basicDetailsStatus = await instanceSupplyChainStorage.setBasicDetails(
																	_registrationNo,
																	_farmerName,
																    _farmAddress,
																    _exporterName,
																    _importerName,{from:authorizedCaller});

		const basicDetailsEvent = await basicDetailsWatcher.get();
	
		/* Check Event wise */
		console_log("Checking PerformCultivation Event: ");

		assert.web3Event(basicDetailsStatus,{
			event:'PerformCultivation',
			args:{
				user:authorizedCaller,
				batchNo:basicDetailsEvent[0].args.batchNo
			}
		},"PerformCultivation");


		/* Check Function Call wise  */
		console_log("Checking Get Basic Details : ");

		const basicDetailsData = await instanceSupplyChainStorage.getBasicDetails(basicDetailsEvent[0].args.batchNo,{from:authorizedCaller});			

		assert.equal(basicDetailsData[0],_registrationNo,"Registration No Check:");
		assert.equal(basicDetailsData[1],_farmerName,"Farmer Name Check:");
		assert.equal(basicDetailsData[2],_farmAddress,"Farmer Address Check:");
		assert.equal(basicDetailsData[3],_exporterName,"Exporter Check:");
		assert.equal(basicDetailsData[4],_importerName,"Importer Check:");

		/********************* Farm Inspection Section ***********/

		/* Set Basic Details */

		var batchNo = basicDetailsEvent[0].args.batchNo;
		var _coffeeFamily = "Rubiaceae";
		var _typeOfSeed = "Coffee robusta";
		var _fertilizerUsed = "Organic";


		const inspectionStatus = await instanceSupplyChainStorage.setFarmInspectorData(
																	batchNo,
																	_coffeeFamily,
																    _typeOfSeed,
																    _fertilizerUsed,{from:authorizedCaller});

		const inspectionEvent = await inspectionWatcher.get();

		/* Check Event wise */
		console_log("Checking DoneInspection Event: ");

		assert.web3Event(inspectionStatus,{
			event:'DoneInspection',
			args:{
				user:authorizedCaller,
				batchNo:inspectionEvent[0].args.batchNo
			}
		},"DoneInspection");


		/* Check Function Call wise  */
		console_log("Checking Get Farm Inspection : ");

		const inspectionData = await instanceSupplyChainStorage.getFarmInspectorData(inspectionEvent[0].args.batchNo,{from:authorizedCaller});			

		assert.equal(inspectionData[0],_coffeeFamily,"coffeeFamily Check:");
		assert.equal(inspectionData[1],_typeOfSeed,"_typeOfSeed Check:");
		assert.equal(inspectionData[2],_fertilizerUsed,"_fertilizerUsed Check:");


		/********************* Harvestor Section ***********/


		var _coffeeFamily = "Rubiaceae";
		var _temperatureUsed = "60 Degree";
		var _humidity = "95";


		const harvestStatus = await instanceSupplyChainStorage.setHarvesterData(
																	batchNo,
																	_coffeeFamily,
																    _temperatureUsed,
																    _humidity,{from:authorizedCaller});

		const harvestEvent = await harvestWatcher.get();

		/* Check Event wise */
		console_log("Checking DoneHarvesting Event: ");

		assert.web3Event(harvestStatus,{
			event:'DoneHarvesting',
			args:{
				user:authorizedCaller,
				batchNo:harvestEvent[0].args.batchNo
			}
		},"DoneHarvesting");


		/* Check Function Call wise  */
		console_log("Checking Get Harvestor : ");

		const harvestData = await instanceSupplyChainStorage.getHarvesterData(harvestEvent[0].args.batchNo,{from:authorizedCaller});			

		assert.equal(harvestData[0],_coffeeFamily,"_coffeeFamily Check:");
		assert.equal(harvestData[1],_temperatureUsed,"_temperatureUsed Check:");
		assert.equal(harvestData[2],_humidity,"_humidity Check:");


		/********************* Exporter Section ***********/

		var _quantity = '10000';
		var _destinationAddress = 'Germany, Europ';
		var _shipName = 'Big Tasker Giaent';
		var _shipNo = 'BT745968';
		var _estimateDateTime = '1528635600';
		var _exporterId = '2135465';

		const exportStatus = await instanceSupplyChainStorage.setExporterData(batchNo,
																			 _quantity,
																			 _destinationAddress,
																			 _shipName,
																			 _shipNo,
																			 _estimateDateTime,
																			 _exporterId);

		const exportEvent = await exportWatcher.get();
		var _batchNo = exportEvent[0].args.batchNo;

		/* Check Event Wise */
		console.log("Checking DoneExporting Event: ");

		assert.web3Event(exportEvent,{
			event:'DoneExporting',
			args:{
				user:authorizeCaller,
				batchNo:_batchNo
			}
		},'DoneExporting');

		/* Check function call wise */
		const exportData = await instanceSupplyChainStorage.getExporterData(_batchNo,{from:authorizeCaller});

		assert.equal(exportData[0],_quantity,"_quantity Check:");
		assert.equal(exportData[1],_destinationAddress,"_destinationAddress Check:");
		assert.equal(exportData[2],_shipName,"_shipName Check:");
		assert.equal(exportData[3],_shipNo,"_shipNo Check:");
		assert.equal(exportData[4],_estimateDateTime,"_estimateDateTime Check:");
		assert.equal(exportData[5],_exporterId,"_exporterId Check:");
		
		/********************* Importer Section ***********/

		var _quantity = '10000';
		var _shipName = 'Big Tasker Giaent';
		var _shipNo = 'BT745968';
		var _transportInfo = 'AK Transport';
		var _warehouseName = 'Hindani Storage';
		var _warehouseAddress = 'Loehestrasse 37, 53773 Hennef, GERMANY';
		var _importerId = '8745236';

		const importStatus = await instanceSupplyChainStorage.setImporterData(batchNo,
																			  _quantity,
																			  _shipName,
																			  _shipNo,
																			  _transportInfo,
																			  _warehouseName,
																			  _warehouseAddress,
																			  _importerId);

		const importEvent = await importWatcher.get();
		var _batchNo = importEvent[0].args.batchNo;

		/* Check Event Wise */
		console.log("Checking DoneImporting Event: ");

		assert.web3Event(importEvent,{
			event:'DoneImporting',
			args:{
				user:authorizeCaller,
				batchNo:_batchNo
			}
		},'DoneImporting');

		/* Check function call wise */
		const importData = await instanceSupplyChainStorage.getImporterData(_batchNo,{from:authorizeCaller});

		assert.equal(importData[0],_quantity,"_quantity Check:");
		assert.equal(importData[1],_shipName,"_shipName Check:");
		assert.equal(importData[2],_shipNo,"_shipNo Check:");
		assert.equal(importData[3],_transportInfo,"_transportInfo Check:");
		assert.equal(importData[4],_warehouseName,"_warehouseName Check:");
		assert.equal(importData[5],_warehouseAddress,"_warehouseAddress Check:");
		assert.equal(importData[6],_importerId,"_importerId Check:");

		
	});
})

function console_log(message)
{
	console.log("=> " + message);
}