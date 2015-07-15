

# Crowdfund your idea

Sometimes a good idea takes a lot of funds and collective effort. You could ask for donations, but donors prefer to give to projects they are more certain that will get traction and proper funding. This is an example where a crowdfunding would be ideal: you set up a goal and a deadline for reaching it. If you miss your goal, the donations are returned, therefore reducing the risk for donors. Since the code is open and auditable, there is no need for a centralized trusted platform and therefore the only fees everyone will pay are just the gas fees.

In a crowdfunding prizes are usually given. This would require you to get everyones contact information and keep track of who owns what. But since you just created your own token, why not use that to keep track of the prizes? This allows donors to immediatly own something after they donated. They can store it safely, but they can also sell or trade it if they realize they don't want the prize anymore. If your idea is something physical, all you have to do after the project is completed is to give the product to everyone who sends you back a token. If the project is digital the token itself can be immediatly be used for users to participate or get entry on your project.

**Attention: All contracts could be wiped out at the end of Frontier. While balances on normal addresses will be transported to Homestead, balances in contracts, as well as addresses with less than 1 ether, will not. So use this crowdfunding contract for testing purposes and don't put any significant funds unless you know what you are doing.**

### The code

The way this particular crowdsale contract works is that you set an exchange rate for your token and then the donors will immediatly get a proportional amount of tokens in exchange of their ether. You will also choose a funding goal and a deadline: once that deadline is over you can ping the contract and if the goal was reached it will send the ether raised to you, otherwise it goes back to the donors. Donors keep their tokens even if the project doesnt reach it's goal, as a proof that they helped.

    
    
    
    contract token { mapping (address => uint) public coinBalanceOf; function token() {}  function sendCoin(address receiver, uint amount) returns(bool sufficient) {  } }
    
    contract CrowdSale {
        
        address public beneficiary;
        uint public fundingGoal; uint public amountRaised; uint public deadline; uint public price;
        token public tokenReward;   
        Funder[] public funders;
        event FundTransfer(address backer, uint amount, bool isContribution);
        
        /* data structure to hold information about campaign contributors */
        struct Funder {
            address addr;
            uint amount;
        }
        
        /*  at initialization, setup the owner */
        function CrowdSale(address _beneficiary, uint _fundingGoal, uint _duration, uint _price, token _reward) {
            beneficiary = _beneficiary;
            fundingGoal = _fundingGoal;
            deadline = now + _duration * 1 minutes;
            price = _price;
            tokenReward = token(_reward);
        }   
        
        /* The function without name is the default function that is called whenever anyone sends funds to a contract */
        function () {
            Funder f = funders[++funders.length];
            f.addr = msg.sender;
            f.amount = msg.value;
            amountRaised += f.amount;
            tokenReward.sendCoin(msg.sender, f.amount/price);
            FundTransfer(f.addr, f.amount, true);
        }
            
        modifier afterDeadline() { if (now >= deadline) _ }

        /* checks if the goal or time limit has been reached and ends the campaign */
        function checkGoalReached() afterDeadline {
            if (amountRaised >= fundingGoal){
                beneficiary.send(amountRaised);
                FundTransfer(beneficiary, amountRaised, false);
            } else {
                FundTransfer(0, 11, false);
                for (uint i = 0; i < funders.length; ++i) {
                  funders[i].addr.send(funders[i].amount);  
                  FundTransfer(funders[i].addr, funders[i].amount, false);
                }               
            }
            suicide(beneficiary);
        }
    }

You know the drill. [Remove line breaks](http://www.textfixer.com/tools/remove-line-breaks.php) and copy the following commands on the terminal:


    var crowdsaleCompiled = eth.compile.solidity(' contract token { mapping (address => uint) public coinBalanceOf; function token() {} function sendCoin(address receiver, uint amount) returns(bool sufficient) { } } contract CrowdSale { address public beneficiary; uint public fundingGoal; uint public amountRaised; uint public deadline; uint public price; token public tokenReward; Funder[] public funders; event FundTransfer(address backer, uint amount, bool isContribution); /* data structure to hold information about campaign contributors */ struct Funder { address addr; uint amount; } /* at initialization, setup the owner */ function CrowdSale(address _beneficiary, uint _fundingGoal, uint _duration, uint _price, token _reward) { beneficiary = _beneficiary; fundingGoal = _fundingGoal; deadline = now + _duration * 1 minutes; price = _price; tokenReward = token(_reward); } /* The function without name is the default function that is called whenever anyone sends funds to a contract */ function () { Funder f = funders[++funders.length]; f.addr = msg.sender; f.amount = msg.value; amountRaised += f.amount; tokenReward.sendCoin(msg.sender, f.amount/price); FundTransfer(f.addr, f.amount, true); } modifier afterDeadline() { if (now >= deadline) _ } /* checks if the goal or time limit has been reached and ends the campaign */ function checkGoalReached() afterDeadline { if (amountRaised >= fundingGoal){ beneficiary.send(amountRaised); FundTransfer(beneficiary, amountRaised, false); } else { FundTransfer(0, 11, false); for (uint i = 0; i < funders.length; ++i) { funders[i].addr.send(funders[i].amount); FundTransfer(funders[i].addr, funders[i].amount, false); } } suicide(beneficiary); } }');

    var beneficiary = eth.accounts[1];    // create an account for this
    var fundingGoal = web3.toWei(100, "ether"); // raises 100 ether
    var duration = 30;     // number of minutes the campaign will last
    var price = web3.toWei(0.02, "ether"); // the price of the tokens, in ether
    var reward = tokenInstance.address;   // the token contract address.

On Beneficiary put the new address that will receive the raised funds. The funding goal is the amount of ether to be raised. Deadline is measured in blocktimes which average 12 seconds, so the default is about 4 weeks. The price is tricky: but just change the number 2 for the amount of tokens the contributors will receive for each ether donated. Finally reward should be the address of the token contract you created in the last section.

In this example you are sending to the crowdsale fund 50% of all the tokens that ever existed, in exchange for 100 ether. Decide those parameters very carefully as they will play a very important role on the next part of our guide.


    var crowdsaleContract = web3.eth.contract(crowdsaleCompiled.CrowdSale.info.abiDefinition);
    var crowdsaleInstance = crowdsaleContract.new(
      beneficiary, 
      fundingGoal, 
      duration, 
      price, 
      reward,
      {
        from:web3.eth.accounts[0], 
        data:crowdsaleCompiled.CrowdSale.code, 
        gas: 1000000
      }, function(e, contract){
       console.log(e, contract);
       console.log("Contract mined! \naddress: " + contract.address + "\ntransactionHash: " + contract.transactionHash);
    })

If you received an alert then your code should be online. You can always double check by doing this:

    eth.getCode(crowdsaleInstance.address)

Now fund your newly created contract with the necessary tokens so it can automatically distribute rewards to the contributors!

    tokenInstance.sendCoin.sendTransaction(crowdsaleInstance.address, 5000,{from: eth.accounts[0]})

After the transaction is picked, you can check the amount of tokens the crowdsale address has, and all other variables this way:

    "Current crowdsale must raise " + web3.fromWei(crowdsaleInstance.fundingGoal.call(), "ether") + " ether in order to send it to " + crowdsaleInstance.beneficiary.call() + "."



### Put some watchers on

You want to be alerted whenever your crowdsale receives new funds, so paste this code:

    var event = crowdsaleInstance.FundTransfer({}, '', function(error, result){
      if (!error)
        
        if (result.args.isContribution) {
            console.log("\n New backer! Received " + web3.fromWei(result.args.amount, "ether") + " ether from " + result.args.backer  )

            console.log( "\n The current funding at " +( 100 *  crowdsaleInstance.amountRaised.call() / crowdsaleInstance.fundingGoal.call()) + "% of its goals. Funders have contributed a total of " + web3.fromWei(crowdsaleInstance.amountRaised.call(), "ether") + " ether.");
                  
            var timeleft = Math.floor(Date.now() / 1000)-crowdsaleInstance.deadline();
            if (timeleft>3600) {  console.log("Deadline has passed, " + Math.floor(timeleft/3600) + " hours ago")
            } else if (timeleft>0) {  console.log("Deadline has passed, " + Math.floor(timeleft/60) + " minutes ago")
            } else if (timeleft>-3600) {  console.log(Math.floor(-1*timeleft/60) + " minutes until deadline")
            } else {  console.log(Math.floor(-1*timeleft/3600) + " hours until deadline")
            }

        } else {
            console.log("Funds transferred from crowdsale account: " + web3.fromWei(result.args.amount, "ether") + " ether to " + result.args.backer  )
        }

    });

      


### Register the contract

You are now set. Anyone can now contribute by simply sending ether to the crowdsale address, but to make it even simpler, let's register a name for your sale. First, pick a name for your crowdsale:

    var name = "mycrowdsale"

Check if that's available and register:

    registrar.addr(name) 
    registrar.reserve.sendTransaction(name, {from: eth.accounts[0]});
 
Wait for the previous transaction to be picked up and then:

    registrar.setAddress.sendTransaction(name, crowdsaleInstance.address, true,{from: eth.accounts[0]});


### Contribute to the crowdsale

Contributing to the crowdsale is very simple, it doesn't even require instantiating the contract. This is because the crowdsale responds to simple ether deposits, so anyone that sends ether to the crowdsale will automatically receive a rewar
Anyone can contribute to it by simply executing this command: 

    var amount = web3.toWei(5, "ether") // decide how much to contribute

    eth.sendTransaction({from: eth.accounts[0], to: crowdsaleInstance.address, value: amount, gas: 1000000})


Alternatively, if you want someone else to send it, they can even use the name registrar to contribute:

    eth.sendTransaction({from: eth.accounts[0], to: registrar.addr("mycrowdsale"), value: amount, gas: 500000})


Now wait a minute for the blocks to pickup and you can check if the contract received the ether by doing any of these commands: 

    web3.fromWei(crowdsaleInstance.amountRaised.call(), "ether") + " ether"
    tokenInstance.coinBalanceOf.call(eth.accounts[0]) + " tokens"
    tokenInstance.coinBalanceOf.call(crowdsaleInstance.address) + " tokens"


### Recover funds

Once the deadline is passed someone has to wake up the contract to have the funds sent to either the beneficiary or back to the funders (if it failed). This happens because there is no such thing as an active loop or timer on ethereum so any future transactions must be pinged by someone.

    crowdsaleInstance.checkGoalReached.sendTransaction({from:eth.accounts[0], gas: 2000000})

You can check your accounts with these lines of code:

    web3.fromWei(eth.getBalance(eth.accounts[0]), "ether") + " ether"
    web3.fromWei(eth.getBalance(eth.accounts[1]), "ether") + " ether"
    tokenInstance.coinBalanceOf.call(eth.accounts[0]) + " tokens"
    tokenInstance.coinBalanceOf.call(eth.accounts[1]) + " tokens"

The crowdsale instance is setup to self destruct once it has done its job, so if the deadline is over and everyone got their prizes the contract is no more, as you can see by running this:

    eth.getCode(crowdsaleInstance.address)

So you raised a 100 ethers and sucessfully distributed your original coin among the crowdsale donors. What could you do next with those things?




