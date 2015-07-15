

# Crowdfunder


Creating a country takes a lot of funds and collective effort. You could ask for donations, but donors prefer to give to projects they are more certain that will get traction and proper funding. This is an example where a crowdfunding would be ideal: you set up a goal and a deadline for reaching it. If you miss your goal, the donations are returned, therefore reducing the risk for donors. Since the code is open and auditable, there is no need for a centralized trusted platform and therefore the only fees everyone will pay are just the gas fees.

Since you already have your own internal currency, you can use that to help gather funds. In this crowdsale contract everyone who contribute will also get a proportional amount of the tokens you created. This can be used to as a proof of citizenship, as a share system or simply as a reward for their help as early pioneers.

**Attention: All contracts will be wiped out at the end of Frontier. While balances on normal addresses will be transported to Homestead, balances in contracts, as well as addresses with less than 1 ether, will not. So use this crowdfunding contract for testing purposes and don't put any significant funds unless you know what you are doing.**

```js
contract token{
function sendToken(address receiver,uint256 amount)returns(bool sufficient){}
function getBalance(address account)returns(uint256 balance){}
}

contract crowdSale {
  
  address admin;
  address beneficiary;
    uint fundingGoal;
    uint numFunders;
    uint amount;
    uint deadline;
  uint price;
  token tokenReward;
  
    mapping (uint => Funder) funders;
  
  // data structure to hold information about campaign contributors
    struct Funder {
        address addr;
        uint amount;
    }
  

  // at initialization, setup the owner
  function CrowdSale() {
    admin = msg.sender;
  }
  
  
  function setup(address _beneficiary, uint _fundingGoal, uint _deadline, uint _price, address _reward) returns (bytes32 response){
    if (msg.sender == admin && !(beneficiary > 0 && fundingGoal > 0 && deadline > 0)) {
      beneficiary = _beneficiary;
      fundingGoal = _fundingGoal;
      deadline = _deadline;
      price = _price;
      tokenReward = token(_reward);
      
      return "campaign is set";
    } else if (msg.sender != admin) {
      return "not authorized";
    } else  {
      return "campaign cannot be changed";
    }
  }
  
    //function to contributes to the campaign
  function contribute() returns (bytes32 response) {
        Funder f = funders[numFunders++];
        f.addr = msg.sender;
        f.amount = msg.value;
        amount += f.amount;
    tokenReward.sendToken(msg.sender, f.amount/price);
    
    return "thanks for your contribution";
    }
    
    // checks if the goal or time limit has been reached and ends the campaign
    function checkGoalReached() returns (bytes32 response) {
        if (amount >= fundingGoal){
            uint i = 0; 
            beneficiary.send(amount);
       suicide(beneficiary);
       return "Goal Reached!"; 
        }
        else if (deadline <= block.number){
            uint j = 0;
            uint n = numFunders;
            while (j <= n){
                funders[j].addr.send(funders[j].amount);
                funders[j].addr = 0;
                funders[j].amount = 0;
                j++;
            }
     suicide(beneficiary);
            return "Deadline passed";
        }
        return "Not reached yet";
    }
}
```

Compile it and copy the following commands on the terminal:


`> var crowdsaleCode = "0x5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6107c08061003b6000396000f3006000357c0100000000000000000000000000000000000000000000000000000000900480635b2329d414610045578063670c884e1461005a578063d7bb99ba1461007b57005b610050600435610409565b8060005260206000f35b6100716004356024356044356064356084356101f6565b8060005260206000f35b61008361008d565b8060005260206000f35b600060006000600860005060006003600081815054809291906001019190505581526020019081526020016000206000915091503382825060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055503482825060010160005081905550818150600101600050546004600082828250540192505081905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663412664ae60206000827c01000000000000000000000000000000000000000000000000000000000260005260043373ffffffffffffffffffffffffffffffffffffffff1681526020016006600050548787506001016000505404815260200160006000866161da5a03f16101c357005b5050600051507f7468616e6b7320666f7220796f757220636f6e747269627574696f6e0000000092506101f1565b505090565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480156102b057506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1611801561029d57506000600260005054115b80156102ae57506000600560005054115b155b61036357600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610336577f63616d706169676e2063616e6e6f74206265206368616e67656400000000000090506104005661035e565b7f6e6f7420617574686f72697a65640000000000000000000000000000000000009050610400565b6103ff565b85600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555084600260005081905550836005600050819055508260066000508190555081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055507f63616d706169676e2069732073657400000000000000000000000000000000009050610400565b5b95945050505050565b6000600060006000600260005054600460005054101561057a5743600560005054111561043557610575565b6000915060036000505490505b808211151561054d576008600050600083815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600060086000506000858152602001908152602001600020600050600101600050546000600060006000848787f16104d257005b50505060006008600050600084815260200190815260200160002060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550600060086000506000848152602001908152602001600020600050600101600050819055508180600101925050610442565b7f446561646c696e6520706173736564000000000000000000000000000000000093506107b8565b610790565b60009250600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660006004600050546000600060006000848787f16105d157005b505050600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663412664ae60206000827c0100000000000000000000000000000000000000000000000000000000026000526004600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f60206000827c01000000000000000000000000000000000000000000000000000000000260005260043073ffffffffffffffffffffffffffffffffffffffff16815260200160006000866161da5a03f161070d57005b5050600051815260200160006000866161da5a03f161072857005b505060005150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff7f476f616c2052656163686564210000000000000000000000000000000000000093506107b8565b7f4e6f74207265616368656420796574000000000000000000000000000000000093506107b8565b50505091905056"`

`> var crowdsaleABI = [   {      "constant" : false,      "inputs" : [         {            "name" : "campaignID",            "type" : "uint256"         }      ],      "name" : "checkGoalReached",      "outputs" : [         {            "name" : "response",            "type" : "bytes32"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [         {            "name" : "_beneficiary",            "type" : "address"         },         {            "name" : "_fundingGoal",            "type" : "uint256"         },         {            "name" : "_deadline",            "type" : "uint256"         },         {            "name" : "_price",            "type" : "uint256"         },         {            "name" : "_reward",            "type" : "address"         }      ],      "name" : "setup",      "outputs" : [         {            "name" : "response",            "type" : "bytes32"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [],      "name" : "contribute",      "outputs" : [         {            "name" : "response",            "type" : "bytes32"         }      ],      "type" : "function"   }]`

Set your sending account and store the resulting contract address:

```js
var primaryAccount = eth.accounts[0]
var crowdsaleAddress = web3.eth.sendTransaction({data: crowdsaleCode, from: primaryAccount, gas:1000000}); 
```

Wait minute until and use the code below to test if your code has been deployed.

```js
eth.getCode(crowdsaleAddress)
```

If it has, then do these commands to instantiate it locally.

```js
CrowdsaleContract = web3.eth.contract(crowdsaleABI)
crowdsaleInstance = CrowdsaleContract.at(crowdsaleAddress)
```

Your first step now is to set the contract up. You can only do it once and it needs to come from the same account that created the contract in the first place.

```js
var beneficiary = eth.accounts[1];  // create an account for this
var fundingGoal = web3.toWei(100, "ether"); // raises a 100 ether
var deadline = eth.blockNumber + 200000; // about four weeks
var price = web3.toWei(2, "ether"); // the price of the tokens, in ether
var reward = tokenAddress;  // the token contract address.
```

On Beneficiary put the new address that will receive the raised funds. The funding goal is the amount of ether to be raised. Deadline is measured in blocktimes which average 12 seconds, so the default is about 4 weeks. The price is tricky: but just change the number 2 for the amount of tokens the contributors will receive for each ether donated. Finally reward should be the address of the token contract you created in the last section.

```js
crowdsaleInstance.setup.sendTransaction(beneficiary, fundingGoal, deadline, price, reward, {from: primaryAccount});
```

Dont forget to fund your newly created contract with the necessary tokens so it can pay back the contributors!

```js
tokenInstance.sendToken.sendTransaction(crowdsaleAddress, 200,{from: primaryAddress})
```
You are now set. Anyone can now contribute by following these steps. First, send them the code address you just created. Now anyone can simply follow these steps:

```
var crowdsaleAddress = "0x000000"
var crowdsaleABI = [   {      "constant" : false,      "inputs" : [         {            "name" : "campaignID",            "type" : "uint256"         }      ],      "name" : "checkGoalReached",      "outputs" : [         {            "name" : "response",            "type" : "bytes32"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [         {            "name" : "_beneficiary",            "type" : "address"         },         {            "name" : "_fundingGoal",            "type" : "uint256"         },         {            "name" : "_deadline",            "type" : "uint256"         }      ],      "name" : "init",      "outputs" : [         {            "name" : "response",            "type" : "bytes32"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [],      "name" : "contribute",      "outputs" : [         {            "name" : "response",            "type" : "bytes32"         }      ],      "type" : "function"   }]
crowdsaleContract = web3.eth.contract(crowdsaleABI)
crowdsaleInstance = new crowdsaleContract(crowdsaleAddress)

var amount = web3.toWei(1, "ether") 
crowdsaleInstance.contribute.sendTransaction({from: primaryAddress, value: amount })
```

Now wait a minute for the blocks to pickup and you can check if you received the tokens or check the balance of the contract by doing this: 

```js
eth.getBalance(crowdsaleAddress);
```

Ethereum doesn't run contracts by itself, they have to be requested, so once the deadline is passed anyone can have the funds sent to either the beneficiary or back to the funders (if it failed) by doing a:

```js
crowdsaleInstance.checkGoalReached.sendTransaction({from: primaryAddress })
```