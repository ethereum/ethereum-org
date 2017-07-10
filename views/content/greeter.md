## Building a smart contract using the command line

This page will help you build a *Hello World* contract on the ethereum command line. If you don't know how to use the command line we recommend you skip this tutorial and instead build a [Custom token using the graphical user interface](./token).

Smart contracts are account holding objects on the ethereum blockchain. They contain code functions and can interact with other contracts, make decisions, store data, and send ether to others. Contracts are defined by their creators, but their execution, and by extension the services they offer, is provided by the ethereum network itself. They will exist and be executable as long as the whole network exists, and will only disappear if they were programmed to self destruct.

What can you do with contracts? Well, you can do almost anything really, but for our getting started guide let's do some simple things: To start you will create a classic "Hello World" contract, then you can build your own crypto token to send to whomever you like. Once you've mastered that then you will raise funds through a crowdfunding that, if successful, will supply a radically transparent and democratic organization that will only obey its own citizens, will never swerve away from its constitution and cannot be censored or shut down. And all that in less than 300 lines of code.

Before you begin:
[Install the Ethereum CLI](https://ethereum.org/cli)
[Learn more about contracts](https://github.com/ethereum/go-ethereum/wiki/Contracts-and-Transactions)
Please confirm that the GUI is closed before entering the `geth` console.
Run `geth` to begin the sync process (this may take a while on the first run).

So let's start now.

### Your first citizen: the Greeter

Now that you’ve mastered the basics of Ethereum, let’s move into your first serious contract. The Metropolis can sometimes feel unwelcoming, so our first order of business will be to create a little automatic companion to greet you whenever you feel lonely. We’ll call him the “Greeter”.

The Greeter is an intelligent digital entity that lives on the blockchain and is able to have conversations with anyone who interacts with it, based on its input. It might not be a talker, but it’s a great listener. Here is its code:


    pragma solidity ^0.4.13;

    contract Greeter {
        /* Define variable owner of the type address */
        address owner;
        /* Define variable greeting of the type string */
        string greeting;
        /* A modifier acts as a filter on other functions */
        modifier onlyOwner() { require (owner == msg.sender); _; }
        /* This function is called during deployment and sets the owner of the contract and a default greeting message. */
        function Greeter() { owner = msg.sender; greeting = "Hello World!"; }
        /* Main function */
        function greet() constant returns (string) { return greeting; }
        /* This function sets a new greeting message */
        function setGreeting(string _greeting) { greeting = _greeting; }
        /* This function destroys the contract instance and returns its funds to the owner */
        function kill() onlyOwner { selfdestruct(owner); }
    }


 In ethereum, contracts are by default immortal and have no owner, meaning that once deployed the author has no special privileges over its creation. To preserve ownership rights, this contract records the owner variable as the msg.sender at deployment time and includes a function modifier to enable a form of access control, guaranteeing that only the contract owner can execute the kill() function to clean up the blockchain and recover any funds locked once the contract is no longer needed.

### The Solc Compiler

Before you are able to Deploy it though, you'll need two things: the compiled code, and the Application Binary Interface, which is a JavaScript Object that defines how to interact with the contract.

The first you can get by using a compiler. You should have a solidity compiler built in on your geth console. To test it, use this command:

    eth.getCompilers()

If you have it installed, it should output something like this:

    ['Solidity']

If you do not get Solidity above, then you need to install it. You can find [instructions for installing Solidity here](http://solidity.readthedocs.io/en/develop/installing-solidity.html).


#### Compiling your contract

Now you have the compiler installed, you need now reformat your contract by removing line-breaks so it fits into a string variable [(there are some online tools that will do this)](http://www.textfixer.com/tools/remove-line-breaks.php):

On your geth console, run:

    var greeterSource = 'contract Greeter { address owner; string greeting; modifier onlyOwner() { require (owner == msg.sender); _; } function Greeter() { owner = msg.sender; greeting = "Hello World!"; } function greet() constant returns (string) { return greeting; } function setGreeting(string _greeting) { greeting = _greeting; } function kill() onlyOwner { selfdestruct(owner); } }'

    var greeterCompiled = web3.eth.compile.solidity(greeterSource)

You have now compiled your code. Now you need to get it ready for deployment, this includes setting some variables up. Back to the console:

    var greeterContract = web3.eth.contract(greeterCompiled["<stdin>:Greeter"].info.abiDefinition)

    var greeter = greeterContract.new({from: web3.eth.accounts[0],
      data: greeterCompiled["<stdin>:Greeter"].code, gas: '3000000'}, function (e, contract){
      console.log(e, contract);
      if (typeof contract.address !== 'undefined') {
          console.log('Contract mined! address: ' + contract.address);
      } else {
        console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
      }
    })

#### Using the online compiler

If you don't have solc installed, you can simply use the online compiler. Copy the source code above to the [online solidity compiler](https://ethereum.github.io/browser-solidity/) and then your compiled code should appear on the right pane. Copy the code in the box labeled **Web3 deploy** for both the `greeter` contract and the `mortal` contract to a single text file.

Now you can paste the resulting text on your geth window, or import the file with `loadScript("yourFilename.js")`. Wait a few seconds and you'll see a message like this:

    Contract mined! address: 0xdaa24d02bad7e9d6a80106db164bad9399a0423e

You may have to "unlock" the account that is sending the transaction using your password, because you need to pay for the gas costs of deploying your contract: e.g. in a geth console type:  `personal.unlockAccount(web3.eth.accounts[0], "yourPassword")`. If you are using your own testnet, you may also need to start the miner, e.g `miner.start()` to successfully deploy the contract.

This contract is estimated to need ~350 thousand gas to deploy (according to the [online solidity compiler](https://ethereum.github.io/browser-solidity/)), at the time of writing, gas on the test net is priced at 21 gwei ([equal to( 21000000000 wei, or  0.000000021 ether](http://ether.fund/tool/converter#v=20&u=Gwei)) per unit of gas. There are many useful stats, including the latest gas prices [at the network stats page](https://ethstats.net/).

**Notice that the cost is not paid to the [ethereum developers](../foundation), instead it goes to the _Miners_, those peers whose computers are working to find new blocks and keep the network secure. Gas price is set by the market of the current supply and demand of computation. If the gas prices are too high, you can become a miner and lower your asking price.**


Within a minute, you should have a message with the contract address, this means you've successfully deployed your contract. You can verify the deployed code by using this command:

    eth.getCode(greeter.address)

If it returns anything other than "0x" then congratulations! Your little Greeter is live! If the contract is created again (by performing another eth.sendTransaction), it will be published to a new address.


### Run the Greeter

In order to call your bot, just type the following command in your console:

    greeter.greet();

Since this call changes nothing on the blockchain, it returns instantly and without any gas cost. You should see it return your greeting:

    'Hello World!'

If however you wish to change the bot's greeting message you can use:

    greeter.setGreeting("your_new_greeting_string", {from: eth.accounts[0]})

Since this call changes the blockchain state, it may take a minute to execute and will have a gas cost associated with it.
#### Getting other people to interact with your code

In order for other people to run your contract they need two things: the address where the contract is located and the ABI (Application Binary Interface) which is a sort of user manual, describing the name of its functions and how to call them to your JavaScript console. In order to get each of them run these commands:

    greeterCompiled.greeter.info.abiDefinition;
    greeter.address;

If you compiled with the [browser-based tool](https://ethereum.github.io/browser-solidity/), you can get the ABI from the field for the `Greeter` contract labeled "Interface".

You can then instantiate a JavaScript object which can be used to call the contract on any machine connected to the network. Replace 'ABI' (an array) and 'Address' (a string) to create a contract object in JavaScript:

    var greeter = eth.contract(ABI).at(Address);

This particular example can be instantiated by anyone else on the same network. Using a geth console, run:

    var greeterInstance =  eth.contract([{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_greeting","type":"string"}],"name":"setGreeting","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]).at('Greeter_Contract_Address');

#### Cleaning up after yourself:

You must be very excited to have your first contract live, but this excitement wears off sometimes, when the owners go on to write further contracts, leading to the unpleasant sight of abandoned contracts on the blockchain. In the future, blockchain rent might be implemented in order to increase the scalability of the blockchain but for now, be a good citizen and humanely put down your abandoned bots.

A transaction will need to be sent to the network for the changes made to the blockchain after the code below is run. The self-destruct is subsidized by the network so it will cost much less gas than a usual transaction.

    greeter.kill.sendTransaction({from:eth.accounts[0]})

Remember that this command will only work when it's triggered by a transaction sent from the contract's owner. You can verify that the deed is done simply seeing if this command returns 0:

    eth.getCode(greeter.address)
