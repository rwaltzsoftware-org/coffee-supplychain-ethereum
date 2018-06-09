
var CoffeeSupplyChain = artifacts.require("../contracts/CoffeeSupplyChain.sol");
var SupplyChainUser = artifacts.require("../contracts/SupplyChainUser.sol");
var SupplyChainStorage = artifacts.require("../contracts/SupplyChainStorage.sol");

const assert = require('chai').assert;

contract('CoffeeSupplyChain', function(accounts) {

	const authorizedCaller = accounts[0];
	const farmInspector = accounts[1];
	const harvestor = accounts[2];
	const exporter = accounts[3];
	const importer = accounts[4];
	const processor = accounts[5];

	beforeEach(async() => {

		this.supplyChainStorage = await SupplyChainStorage.new({from: authorizedCaller});

		this.coffeeSupplyChain = await CoffeeSupplyChain.new(this.supplyChainStorage.address,{from: authorizedCaller});
		this.supplyChainUser = await SupplyChainUser.new(this.supplyChainStorage.address,{from: authorizedCaller});

		await this.supplyChainStorage.authorizeCaller(this.coffeeSupplyChain.address,{from: authorizedCaller});
		await this.supplyChainStorage.authorizeCaller(this.supplyChainUser.address,{from: authorizedCaller});
	});	

	async function prepareFarmInspector(contract)
	{
		var _name = "Alice";
		var _contactNo = "8986587989";
		var _role = "FARM_INSPECTION";
		var _isActive = true;
		var _profileHash = "Sample Hash";

		return 	await contract
					.updateUserForAdmin(farmInspector,
										_name,
										_contactNo,
										_role,
										_isActive,
										_profileHash,
										{from:authorizedCaller});
	}

	async function addFarmBasicDetails(contract)
	{
		var _registrationNo = "123456789";
		var _farmerName = "Ramu Kaka";
		var _farmAddress = "Nashik";
		var _exporterName = "Rudra Logistics";
		var _importerName = "Boulders Logistics";

		return  await contract
						.addBasicDetails(
								_registrationNo,
								_farmerName,
							    _farmAddress,
							    _exporterName,
							    _importerName,{from:authorizedCaller});
	}

	async function updateFarmInspectorData(contract,batchNo)
	{
		var _coffeeFamily = "Rubiaceae";
		var _typeOfSeed = "Coffee Arabica";
		var _fertilizerUsed = "Organic";

		return await contract
						.updateFarmInspectorData(
											batchNo,
											_coffeeFamily,
										    _typeOfSeed,
										    _fertilizerUsed,{from:farmInspector});
	}
	describe("Cultivation Activities",() => {

		var batchNo = false;

		it("should add cultivation basic details",async() => {

			/********************* Basic Details Section ***********/

			/* Set Basic Details */

			const { logs } = addFarmBasicDetails(this.coffeeSupplyChain);
														
			/* Check if Event Exists */
			const event = logs.find(e => e.event === 'PerformCultivation');
			assert.exists(event,"PerformCultivation event does not exists");

			batchNo = event.args.batchNo;

		});

		it("should get cultivation basic details",async() => {

			/* Set Basic Details */

			const { logs } = addFarmBasicDetails(this.coffeeSupplyChain);

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

			/* Prepare Farm Inspector */
			await prepareFarmInspector(this.supplyChainUser);								

			/* Set Basic Details */

			var { logs } = await addFarmBasicDetails(this.coffeeSupplyChain);

			const basicDetailsEvent = logs.find(e => e.event === 'PerformCultivation');
			batchNo = basicDetailsEvent.args.batchNo;

			/* Update Farm Inspector Data */
			var { logs } = await updateFarmInspectorData(this.coffeeSupplyChain,batchNo);

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
						.updateUserForAdmin(farmInspector,
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
											_fertilizerUsed,{from:farmInspector});


			/* Check if Event Exists */
			const farmInspectionEvent = logs.find(e => e.event === 'DoneInspection');

			batchNo = farmInspectionEvent.args.batchNo;

			const activityData = await this.coffeeSupplyChain
												.getFarmInspectorData(batchNo,{from:farmInspector});
			
			assert.equal(activityData[0],_coffeeFamily,"Coffee Family Check:");
			assert.equal(activityData[1],_typeOfSeed,"Type of Seed  Check:");
			assert.equal(activityData[2],_fertilizerUsed,"Fertilizer Check:");
		});


		it("should update harvest details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			var { logs } = await this.coffeeSupplyChain
										.updateHarvesterData(
															batchNo,
															_cropVariety,
														    _temperatureUsed,
														    _humidity,{from:harvestor});


			/* Check if Event Exists */
			const harvestEvent = logs.find(e => e.event === 'DoneHarvesting');
			assert.exists(harvestEvent,"DoneHarvesting event does not exists");

		});


		it("should get harvest details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			await this.coffeeSupplyChain
							.updateHarvesterData(
												batchNo,
												_cropVariety,
											    _temperatureUsed,
											    _humidity,{from:harvestor});



			const activityData = await this.coffeeSupplyChain
												.getHarvesterData(batchNo,{from:harvestor});
			
			assert.equal(activityData[0],_cropVariety,"Crop Variety Check:");
			assert.equal(activityData[1],_temperatureUsed,"Temperature Used  Check:");
			assert.equal(activityData[2],_humidity,"Humidity Check:");

		});

		it("should update export details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with HARVESTER Role */

			var _name = "Sam";
			var _contactNo = "432423432432";
			var _role = "EXPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(exporter,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			var { logs } = await this.coffeeSupplyChain
										.updateHarvesterData(
															batchNo,
															_cropVariety,
														    _temperatureUsed,
														    _humidity,{from:harvestor});


			/* Update Harvestor */				
			var _quantity = 1000;
			var _destinationAddress = "3998  Southern Avenue, Missouri";
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _estimateDateTime = 1528454742;
			var _exporterId = 60;

			var { logs } = await this.coffeeSupplyChain
										.updateExporterData(
															batchNo,
															_quantity,
														    _destinationAddress,
														    _shipName,
														    _shipNo,
														    _estimateDateTime,
														    _exporterId,{from:exporter});

			/* Check if Event Exists */
			const harvestEvent = logs.find(e => e.event === 'DoneExporting');
			assert.exists(harvestEvent,"DoneExporting event does not exists");

		});

		it("should get export details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with HARVESTER Role */

			var _name = "Sam";
			var _contactNo = "432423432432";
			var _role = "EXPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(exporter,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			var { logs } = await this.coffeeSupplyChain
										.updateHarvesterData(
															batchNo,
															_cropVariety,
														    _temperatureUsed,
														    _humidity,{from:harvestor});


			/* Update Exporter */				
			var _quantity = 1000;
			var _destinationAddress = "3998  Southern Avenue, Missouri";
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _estimateDateTime = 1528454742;
			var _exporterId = 60;

			await this.coffeeSupplyChain
							.updateExporterData(
												batchNo,
												_quantity,
											    _destinationAddress,
											    _shipName,
											    _shipNo,
											    _estimateDateTime,
											    _exporterId,{from:exporter});


			const activityData = await this.coffeeSupplyChain
												.getExporterData(batchNo,{from:harvestor});
			

			assert.equal(activityData[0].toNumber(),_quantity,"Quantity Check:");
			assert.equal(activityData[1],_destinationAddress,"Destination Address  Check:");
			assert.equal(activityData[2],_shipName,"Ship Name Check:");
			assert.equal(activityData[3],_shipNo,"Ship No Check:");
			assert.isNumber(activityData[4].toNumber(),"Departure Datetime Check:");
			assert.equal(activityData[5].toNumber(),_estimateDateTime,"Estimate Datetime Check:");
			assert.equal(activityData[6].toNumber(),_exporterId,"Exporter Id Check:");

		});

		it("should update importer details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with EXPORTER Role */

			var _name = "Sam";
			var _contactNo = "432423432432";
			var _role = "EXPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(exporter,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with IMPORTER Role */

			var _name = "Ravi";
			var _contactNo = "3424234353";
			var _role = "IMPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(importer,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			await this.coffeeSupplyChain
										.updateHarvesterData(
															batchNo,
															_cropVariety,
														    _temperatureUsed,
														    _humidity,{from:harvestor});


			/* Update Exporter */				
			var _quantity = 1000;
			var _destinationAddress = "3998  Southern Avenue, Missouri";
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _estimateDateTime = 1528454742;
			var _exporterId = 60;

			await this.coffeeSupplyChain
							.updateExporterData(
												batchNo,
												_quantity,
											    _destinationAddress,
											    _shipName,
											    _shipNo,
											    _estimateDateTime,
											    _exporterId,{from:exporter});

			
			/* Update Importer */				
			var _quantity = 1000;
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _transportInfo = "Extra Info";
			var _warehouseName = "ABC";
			var _warehouseAddress = " Southern Avenue, Missouri";
			var _importerId = 45;

			var {logs} = await this.coffeeSupplyChain
										.updateImporterData(
															batchNo,
															_quantity,
														    _shipName,
														    _shipNo,
														    _transportInfo,
														    _warehouseName,
														    _warehouseAddress,
														    _importerId,{from:importer});

			/* Check if Event Exists */
			const ImportEvent = logs.find(e => e.event === 'DoneImporting');
			assert.exists(ImportEvent,"DoneImporting event does not exists");

		});

		it("should get importer details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with EXPORTER Role */

			var _name = "Sam";
			var _contactNo = "432423432432";
			var _role = "EXPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(exporter,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with IMPORTER Role */

			var _name = "Ravi";
			var _contactNo = "3424234353";
			var _role = "IMPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(importer,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			await this.coffeeSupplyChain
										.updateHarvesterData(
															batchNo,
															_cropVariety,
														    _temperatureUsed,
														    _humidity,{from:harvestor});


			/* Update Exporter */				
			var _quantity = 1000;
			var _destinationAddress = "3998  Southern Avenue, Missouri";
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _estimateDateTime = 1528454742;
			var _exporterId = 60;

			await this.coffeeSupplyChain
							.updateExporterData(
												batchNo,
												_quantity,
											    _destinationAddress,
											    _shipName,
											    _shipNo,
											    _estimateDateTime,
											    _exporterId,{from:exporter});

			
			/* Update Importer */				
			var _quantity = 1000;
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _transportInfo = "Extra Info";
			var _warehouseName = "ABC";
			var _warehouseAddress = " Southern Avenue, Missouri";
			var _importerId = 45;

			await this.coffeeSupplyChain
										.updateImporterData(
															batchNo,
															_quantity,
														    _shipName,
														    _shipNo,
														    _transportInfo,
														    _warehouseName,
														    _warehouseAddress,
														    _importerId,{from:importer});

			const activityData = await this.coffeeSupplyChain
												.getImporterData(batchNo,{from:importer});
			

			assert.equal(activityData[0].toNumber(),_quantity,"Quantity Check:");
			assert.equal(activityData[1],_shipName,"Ship Name Check:");
			assert.equal(activityData[2],_shipNo,"Ship No Check:");
			assert.isNumber(activityData[3].toNumber(),"Arrival Datetime Check :");
			assert.equal(activityData[4],_transportInfo,"TransportInfo Check:");
			assert.equal(activityData[5],_warehouseName,"Warehouse name Check:");
			assert.equal(activityData[6],_warehouseAddress,"Warehouse Address Check:");
			assert.equal(activityData[7],_importerId,"Importer Id Check:");

		});

		it("should update processor details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with EXPORTER Role */

			var _name = "Sam";
			var _contactNo = "432423432432";
			var _role = "EXPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(exporter,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with IMPORTER Role */

			var _name = "Ravi";
			var _contactNo = "3424234353";
			var _role = "IMPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(importer,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with PROCESSOR Role */

			var _name = "Jay";
			var _contactNo = "234234234";
			var _role = "PROCESSOR";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(processor,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			await this.coffeeSupplyChain
										.updateHarvesterData(
															batchNo,
															_cropVariety,
														    _temperatureUsed,
														    _humidity,{from:harvestor});


			/* Update Exporter */				
			var _quantity = 1000;
			var _destinationAddress = "3998  Southern Avenue, Missouri";
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _estimateDateTime = 1528454742;
			var _exporterId = 60;

			await this.coffeeSupplyChain
							.updateExporterData(
												batchNo,
												_quantity,
											    _destinationAddress,
											    _shipName,
											    _shipNo,
											    _estimateDateTime,
											    _exporterId,{from:exporter});

			
			/* Update Importer */				
			var _quantity = 1000;
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _transportInfo = "Extra Info";
			var _warehouseName = "ABC";
			var _warehouseAddress = " Southern Avenue, Missouri";
			var _importerId = 45;

			await this.coffeeSupplyChain
							.updateImporterData(
												batchNo,
												_quantity,
											    _shipName,
											    _shipNo,
											    _transportInfo,
											    _warehouseName,
											    _warehouseAddress,
											    _importerId,{from:importer});

			/* Update Processor */				
			var _quantity = 1000;
			var _temperature = "50 fahrenheit";
			var _rostingDuration = 60;
			var _internalBatchNo = "BA32323";
			var _packageDateTime = 1528454742;
			var _processorName = "Starbucks";
			var _processorAddress = "Southern Avenue, Missouri";

			var {logs} = await this.coffeeSupplyChain
										.updateProcessorData(
															batchNo,
															_quantity,
														    _temperature,
														    _rostingDuration,
														    _internalBatchNo,
														    _packageDateTime,
														    _processorName,
														    _processorAddress,{from:processor});

			/* Check if Event Exists */
			const ProcessorEvent = logs.find(e => e.event === 'DoneProcessing');
			assert.exists(ProcessorEvent,"DoneProcessing event does not exists");

		});

		it("should get processor details",async() => {

			/* Add User with FARM_INSPECTION Role */

			var _name = "Alice";
			var _contactNo = "8986587989";
			var _role = "FARM_INSPECTION";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(farmInspector,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with HARVESTER Role */

			var _name = "Harry";
			var _contactNo = "83236587989";
			var _role = "HARVESTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(harvestor,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with EXPORTER Role */

			var _name = "Sam";
			var _contactNo = "432423432432";
			var _role = "EXPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(exporter,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});


			/* Add User with IMPORTER Role */

			var _name = "Ravi";
			var _contactNo = "3424234353";
			var _role = "IMPORTER";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(importer,
											_name,
											_contactNo,
											_role,
											_isActive,
											_profileHash,
											{from:authorizedCaller});

			/* Add User with PROCESSOR Role */

			var _name = "Jay";
			var _contactNo = "234234234";
			var _role = "PROCESSOR";
			var _isActive = true;
			var _profileHash = "Sample Hash";

			await this.supplyChainUser
						.updateUserForAdmin(processor,
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



			await this.coffeeSupplyChain
							.updateFarmInspectorData(
												batchNo,
												_coffeeFamily,
											    _typeOfSeed,
											    _fertilizerUsed,{from:farmInspector});


			/* Update Harvestor */				
			var _cropVariety = "Arusha";
			var _temperatureUsed = "50 fahrenheit";
			var _humidity = "60";

			await this.coffeeSupplyChain
										.updateHarvesterData(
															batchNo,
															_cropVariety,
														    _temperatureUsed,
														    _humidity,{from:harvestor});


			/* Update Exporter */				
			var _quantity = 1000;
			var _destinationAddress = "3998  Southern Avenue, Missouri";
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _estimateDateTime = 1528454742;
			var _exporterId = 60;

			await this.coffeeSupplyChain
							.updateExporterData(
												batchNo,
												_quantity,
											    _destinationAddress,
											    _shipName,
											    _shipNo,
											    _estimateDateTime,
											    _exporterId,{from:exporter});

			
			/* Update Importer */				
			var _quantity = 1000;
			var _shipName = "Black Pearl";
			var _shipNo = "1337";
			var _transportInfo = "Extra Info";
			var _warehouseName = "ABC";
			var _warehouseAddress = " Southern Avenue, Missouri";
			var _importerId = 45;

			await this.coffeeSupplyChain
							.updateImporterData(
												batchNo,
												_quantity,
											    _shipName,
											    _shipNo,
											    _transportInfo,
											    _warehouseName,
											    _warehouseAddress,
											    _importerId,{from:importer});

			/* Update Processor */				
			var _quantity = 1000;
			var _temperature = "50 fahrenheit";
			var _rostingDuration = 60;
			var _internalBatchNo = "BA32323";
			var _packageDateTime = 1528454742;
			var _processorName = "Starbucks";
			var _processorAddress = "Southern Avenue, Missouri";

			var {logs} = await this.coffeeSupplyChain
										.updateProcessorData(
															batchNo,
															_quantity,
														    _temperature,
														    _rostingDuration,
														    _internalBatchNo,
														    _packageDateTime,
														    _processorName,
														    _processorAddress,{from:processor});

			const activityData = await this.coffeeSupplyChain
												.getProcessorData(batchNo,{from:processor});
			

			assert.equal(activityData[0].toNumber(),_quantity,"Quantity Check:");
			assert.equal(activityData[1],_temperature,"Temperature Check:");
			assert.equal(activityData[2].toNumber(),_rostingDuration,"Roasting Duration Check :");
			assert.equal(activityData[3],_internalBatchNo,"Internal Batch No Check:");
			assert.equal(activityData[4].toNumber(),_packageDateTime,"Package Datetime Check :");
			assert.equal(activityData[5],_processorName,"Processor name Check:");
			assert.equal(activityData[6],_processorAddress,"Processor Address Check:");

		});
	});
 
});

