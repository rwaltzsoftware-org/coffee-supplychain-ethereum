
var CoffeeSupplyChain = artifacts.require("../contracts/CoffeeSupplyChain.sol");
var SupplyChainUser = artifacts.require("../contracts/SupplyChainUser.sol");
var SupplyChainStorage = artifacts.require("../contracts/SupplyChainStorage.sol");

const assert = require('chai').assert;

contract('CoffeeSupplyChain', function(accounts) {

	const authorizedCaller = accounts[0];
	const farmUser = accounts[1];

	beforeEach(async() => {

		this.supplyChainStorage = await SupplyChainStorage.new({from: authorizedCaller});

		this.coffeeSupplyChain = await CoffeeSupplyChain.new(this.supplyChainStorage.address,{from: authorizedCaller});
		this.supplyChainUser = await SupplyChainUser.new(this.supplyChainStorage.address,{from: authorizedCaller});

		await this.supplyChainStorage.authorizeCaller(this.coffeeSupplyChain.address,{from: authorizedCaller});
		await this.supplyChainStorage.authorizeCaller(this.supplyChainUser.address,{from: authorizedCaller});
	});	

	describe("Cultivation Activities",() =>
	{

		

		var batchNo = false;

		it("should add cultivation basic details",async() => {

			/********************* Basic Details Section ***********/

			/* Set Basic Details */

			var _registrationNo = "123456789";
			var _farmerName = "Ramu Kaka";
			var _farmAddress = "Nashik";
			var _exporterName = "Rudra Logistics";
			var _importerName = "Boulders Logistics";


			const { logs } = await this.coffeeSupplyChain
										.addBasicDetails(
														_registrationNo,
														_farmerName,
														_farmAddress,
														_exporterName,
														_importerName,{from:authorizedCaller});


			/* Check if Event Exists */
			const event = logs.find(e => e.event === 'PerformCultivation');
			assert.exists(event,"PerformCultivation event does not exists");

			batchNo = event.args.batchNo;

		});

		it("should get cultivation basic details",async() => {

			var _registrationNo = "123456789";
			var _farmerName = "Ramu Kaka";
			var _farmAddress = "Nashik";
			var _exporterName = "Rudra Logistics";
			var _importerName = "Boulders Logistics";

			const { logs } = await this.coffeeSupplyChain
										.addBasicDetails(
														_registrationNo,
														_farmerName,
													    _farmAddress,
													    _exporterName,
													    _importerName,{from:authorizedCaller});

			const event = logs.find(e => e.event === 'PerformCultivation');
			batchNo = event.args.batchNo;

			const activityData = await this.coffeeSupplyChain
										.getBasicDetails(batchNo,{from:authorizedCaller});
			
			assert.equal(activityData[0],_registrationNo,"Registration No Check:");
			assert.equal(activityData[1],_farmerName,"Farmer Name Check:");
			assert.equal(activityData[2],_farmAddress,"Farmer Address Check:");
			assert.equal(activityData[3],_exporterName,"Exporter Check:");
			assert.equal(activityData[4],_importerName,"Importer Check:");
		});

		it("should update farm inspection details",async() => {

			

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmUser,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Set Basic Details */

			var _registrationNo = "123456789";
			var _farmerName = "Ramu Kaka";
			var _farmAddress = "Nashik";
			var _exporterName = "Rudra Logistics";
			var _importerName = "Boulders Logistics";

			var { logs } = await this.coffeeSupplyChain
												.addBasicDetails(
														_registrationNo,
														_farmerName,
													    _farmAddress,
													    _exporterName,
													    _importerName,{from:authorizedCaller});


			const basicDetailsEvent = logs.find(e => e.event === 'PerformCultivation');
			batchNo = basicDetailsEvent.args.batchNo;

			

			/* Update Farm Inspection */

			var _coffeeFamily = "Rubiaceae";
			var _typeOfSeed = "Coffee Arabica";
			var _fertilizerUsed = "Organic";



			var { logs } = await this.coffeeSupplyChain
													.updateFarmInspectorData(
																		batchNo,
																		_coffeeFamily,
																	    _typeOfSeed,
																	    _fertilizerUsed,{from:farmUser});


			/* Check if Event Exists */
			const farmInspectionEvent = logs.find(e => e.event === 'DoneInspection');
			assert.exists(farmInspectionEvent,"DoneInspection event does not exists");



		});

		it("should get farm inspection details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmUser,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Set Basic Details */

			var _registrationNo = "123456789";
			var _farmerName = "Ramu Kaka";
			var _farmAddress = "Nashik";
			var _exporterName = "Rudra Logistics";
			var _importerName = "Boulders Logistics";

			var { logs } = await this.coffeeSupplyChain
													.addBasicDetails(
														_registrationNo,
														_farmerName,
													    _farmAddress,
													    _exporterName,
													    _importerName,{from:authorizedCaller});


			const basicDetailsEvent = logs.find(e => e.event === 'PerformCultivation');
			batchNo = basicDetailsEvent.args.batchNo;



			/* Update Farm Inspection */

			var _coffeeFamily = "Rubiaceae";
			var _typeOfSeed = "Coffee Arabica";
			var _fertilizerUsed = "Organic";



			var { logs } = await this.coffeeSupplyChain
														.updateFarmInspectorData(
															batchNo,
															_coffeeFamily,
															_typeOfSeed,
															_fertilizerUsed,{from:farmUser});


			/* Check if Event Exists */
			const farmInspectionEvent = logs.find(e => e.event === 'DoneInspection');

			batchNo = farmInspectionEvent.args.batchNo;

			const activityData = await this.coffeeSupplyChain
												.getFarmInspectorData(batchNo,{from:farmUser});
			
			assert.equal(activityData[0],_coffeeFamily,"Coffee Family Check:");
			assert.equal(activityData[1],_typeOfSeed,"Type of Seed  Check:");
			assert.equal(activityData[2],_fertilizerUsed,"Fertilizer Check:");
		});
	});
 
});
