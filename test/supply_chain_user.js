const SupplyChainUser = artifacts.require('../contracts/SupplyChainUser');
const SupplyChainStorage = artifacts.require('../contracts/SupplyChainStorage');

const assert = require('chai').assert;

/*Define common variables for unit testing*/
const _name = 'Ram';
const _contactNo = '9876543210';
const _role = 'HARVESTER';
const _isActive = true;
const _profileHash = 'Qmadp4L61MaQQX5NFfjqaihnY8r7PmogqZL6wvX1HqwL';

contract('SupplyChainUser', function(accounts) {
  
  /*Define common variables for unit testing*/
  const spenderAddress = accounts[0];	
  const userAddress = accounts[1];

  beforeEach(async() => {
  	this.storageContract = await SupplyChainStorage.new({from:spenderAddress});
  	this.userContract = await SupplyChainUser.new(this.storageContract.address,{from:spenderAddress});
    
  	await this.storageContract.authorizeCaller(this.userContract.address,{from:spenderAddress});
  });	

  describe('User Update',() => {
  	it('should Add/Update New User', async() => {
  		
      const {logs} = await this.userContract.updateUser(_name,
                                                        _contactNo,
                                                        _role,
                                                        _isActive,
                                                        _profileHash,
  														                          {from: userAddress});

  		checkUserExists(logs,function(result){});

      const user = await this.userContract.getUser(userAddress);

      checkUserData(user,function(result){});
  	});	
  });

  describe('User Update from Admin', ()=>{
    it('should Add/Update New User from Admin', async() =>{

      const {logs} = await this.userContract.updateUserForAdmin(userAddress,
                                                                _name,  
                                                                _contactNo,
                                                                _role,
                                                                _isActive,
                                                                _profileHash,
                                                                {from: spenderAddress});

 
      checkUserExists(logs,function(result){});

      const user = await this.userContract.getUser(userAddress);

      checkUserData(user,function(result){});
    });
  });

  describe('User Details Get', ()=>{
    it('should all Get User Details', async()=>{

        const {logs} = await this.userContract.updateUserForAdmin(userAddress,
                                                                _name,  
                                                                _contactNo,
                                                                _role,
                                                                _isActive,
                                                                _profileHash,
                                                                {from: spenderAddress});

        checkUserExists(logs,function(result){});

        const user = await this.userContract.getUser(userAddress);

        checkUserData(user,function(result){});
    });
  });

});

function checkUserExists(logs,callback){

  const updateUserEvent = logs.find(e => e.event === 'UserUpdate');
  assert.exists(updateUserEvent,"UserUpdate does not exists");

  const updateUserRoleEvent = logs.find(e => e.event === 'UserRoleUpdate');
  assert.exists(updateUserRoleEvent,"UserRoleUpdate does not exists");

  callback(true);
}

function checkUserData(user,callback){

  assert.equal(user[0],_name,"Name checked:");
  assert.equal(user[1],_contactNo,"Contact No checked:");
  assert.equal(user[2],_role,"Role checked:");
  assert.equal(user[3],_isActive,"isActive checked:");
  assert.equal(user[4],_profileHash,"Profile Hash checked:");
  assert.isTrue(true);

  callback(true);
}