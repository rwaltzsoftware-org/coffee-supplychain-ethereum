const SupplyChainUser = artifacts.require('../contracts/SupplyChainUser');
const SupplyChainStorage = artifacts.require('../contracts/SupplyChainStorage');

const assert = require('chai').assert;

contract('SupplyChainUser', function(accounts) {
  
  const spenderAddress = accounts[0];	

  console.log(assert);
  return;
  
  beforeEach(async function(){
  	this.storageContract = await SupplyChainStorage.new({from:spenderAddress});
  	this.userContract = await SupplyChainUser.new(this.storageContract.address,{from:spenderAddress});

  	await this.storageContract.authorizeCaller(this.userContract.address,{from:spenderAddress});
  });	

  describe('User Update',() => {
  	it('should Add New User', async() => {
  		const userAddress = accounts[1];

  		const _name = 'Ram';
  		const _contactNo = '9876543210';
  		const _role = 'HARVESTER';
  		const _isActive = true;
  		const _profileHash = 'Qmadp4L61MaQQX5NFfjqaihnY8r7PmogqZL6wvX1HqwL';

  		const {logs} = await this.userContract.updateUser(_name,_contactNo,_role,_isActive,_profileHash,
  														 {from: userAddress});

  		const event = logs.find(e => e.event === 'UserUpdate');
  		// assert.exists(event);
  		console.log(assert);
  		// event.args.spenderAddress.should.equal(userAddress);	
  	});	
  });

  // it("should assert true", function(done) {
  //   var supply_chain_user = SupplyChainUser.deployed();
  //   assert.isTrue(true);
  //   done();
  // });

});
