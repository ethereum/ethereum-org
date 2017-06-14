
## Building a smart contract using the command line

This page will help you build a *Hello, World* contract on the ethereum command line. If you don't know how to use the command line we recommend you skip this tutorial and instead build a [Custom token using the graphical user interface](./token).

Smart contracts are account holding objects on the ethereum blockchain. They contain code functions and can interact with other contracts, make decisions, store data, and send ether to others. Contracts are defined by their creators, but their execution, and by extension the services they offer, is provided by the ethereum network itself. They will exist and be executable as long as the whole network exists, and will only disappear if they were programmed to self destruct.

What can you do with contracts? Well, you can do almost anything really, but for our getting started guide let's do some simple things: To start you will create a classic "Hello World" contract, then you can build your own crypto token to send to whomever you like. Once you've mastered that then you will raise funds through a crowdfunding that, if successful, will supply a radically transparent and democratic organization that will only obey its own citizens, will never swerve away from its constitution and cannot be censored or shut down. And all that in less than 300 lines of code.

Before you begin:
[Install the Ethereum CLI](https://ethereum.org/cli)
[Learn more about contracts](https://github.com/ethereum/go-ethereum/wiki/Contracts-and-Transactions)
Please confirm that the GUI is closed before entering the `geth` console.
Run `geth` to begin the sync process (this may take a while on the first run).

So let's start now.

### Your first citizen: the greeter

Now that you’ve mastered the basics of Ethereum, let’s move into your first serious contract. The Frontier is a big open territory and sometimes you might feel lonely, so our first order of business will be to create a little automatic companion to greet you whenever you feel lonely. We’ll call him the “Greeter”.

The Greeter is an intelligent digital entity that lives on the blockchain and is able to have conversations with anyone who interacts with it, based on its input. It might not be a talker, but it’s a great listener. Here is its code:


    contract mortal {
        /* Define variable owner of the type address */
        address owner;

        /* This function is executed at initialization and sets the owner of the contract */
        function mortal() { owner = msg.sender; }

        /* Function to recover the funds on the contract */
        function kill() { if (msg.sender == owner) selfdestruct(owner); }
    }

    contract greeter is mortal {
        /* Define variable greeting of the type string */
        string greeting;
        
        /* This runs when the contract is executed */
        function greeter(string _greeting) public {
            greeting = _greeting;
        }

        /* Main function */
        function greet() constant returns (string) {
            return greeting;
        }
    }


You'll notice that there are two different contracts in this code: _"mortal"_ and _"greeter"_.  This is because Solidity (the high level contract language we are using) has *inheritance*, meaning that one contract can inherit characteristics of another. This is very useful to simplify coding as common traits of contracts don't need to be rewritten every time, and all contracts can be written in smaller, more readable chunks. So by just declaring that _greeter is mortal_ you inherited all characteristics from the "mortal" contract and kept the greeter code simple and easy to read.

The inherited characteristic _"mortal"_ simply means that the greeter contract can be killed by its owner, to clean up the blockchain and recover funds locked into it when the contract is no longer needed. Contracts in ethereum are, by default, immortal and have no owner, meaning that once deployed the author has no special privileges anymore. Consider this before deploying.

### The Solc Compiler

Before you are able to Deploy it though, you'll need two things: the compiled code, and the Application Binary Interface, which is a JavaScript Object that defines how to interact with the contract.

The first you can get by using a compiler. You should have a solidity compiler built in on your geth console. To test it, use this command:

    eth.getCompilers()

If you have it installed, it should output something like this:

    ['Solidity' ]

If you do not get Solidity above, then you need to install it. 



#### Compiling your contract 


Now you have the compiler installed, you need now reformat your contract by removing line-breaks so it fits into a string variable [(there are some online tools that will do this)](http://www.textfixer.com/tools/remove-line-breaks.php):

    var greeterSource = 'contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }'

    var greeterCompiled = web3.eth.compile.solidity(greeterSource)

You have now compiled your code. Now you need to get it ready for deployment, this includes setting some variables up, like what greeting you want to use. Edit the first line below to something more interesting than "Hello World!" and execute these commands:

    var _greeting = "Hello World!"
    var greeterContract = web3.eth.contract(greeterCompiled.greeter.info.abiDefinition);

    var greeter = greeterContract.new(_greeting,{from:web3.eth.accounts[0], data: greeterCompiled.greeter.code, gas: 300000}, function(e, contract){
        if(!e) {

          if(!contract.address) {
            console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

          } else {
            console.log("Contract mined! Address: " + contract.address);
            console.log(contract);
          }

        }
    })

#### Using the online compiler

If you don't have solC installed, you can simply use the online compiler. Copy the source code above to the [online solidity compiler](https://ethereum.github.io/browser-solidity/) and then your compiled code should appear on the left pane. Copy the code in the box labeled **Web3 deploy** for both the `greeter` contract and the `mortal` contract to a single text file. Now, in that file, change the first line to your greeting:

    var _greeting = "Hello World!"
 
Now you can paste the resulting text on your geth window, or import the file with `loadScript("yourFilename.js")`. Wait up to thirty seconds and you'll see a message like this:

    Contract mined! address: 0xdaa24d02bad7e9d6a80106db164bad9399a0423e 

You may have to "unlock" the account that is sending the transaction using the password you picked in the beginning, because you need to pay for the gas costs to deploying your contract: e.g. `personal.unlockAccount(web3.eth.accounts[0], "yourPassword")`. 

This contract is estimated to need ~180 thousand gas to deploy (according to the [online solidity compiler](https://ethereum.github.io/browser-solidity/)), at the time of writing, gas on the test net is priced at 20 gwei ([equal to( 20000000000 wei, or  0.00000002 ether](http://ether.fund/tool/converter#v=20&u=Gwei)) per unit of gas. There are many useful stats, including the latest gas prices [at the network stats page](https://stats.ethdev.com). 

**Notice that the cost is not paid to the [ethereum developers](../foundation), instead it goes to the _Miners_, those peers whose computers are working to find new blocks and keep the network secure. Gas price is set by the market of the current supply and demand of computation. If the gas prices are too high, you can become a miner and lower your asking price.**


Within less than a minute, you should have a log with the contract address, this means you've successfully deployed your contract. You can verify the deployed code (which will be compiled) by using this command:

    eth.getCode(greeter.address)

If it returns anything other than "0x" then congratulations! Your little Greeter is live! If the contract is created again (by performing another eth.sendTransaction), it will be published to a new address. 


### Run the Greeter

In order to call your bot, just type the following command in your terminal:

    greeter.greet();

Since this call changes nothing on the blockchain, it returns instantly and without any gas cost. You should see it return your greeting:

    'Hello World!'


#### Getting other people to interact with your code

In order for other people to run your contract they need two things: the address where the contract is located and the ABI (Application Binary Interface) which is a sort of user manual, describing the name of its functions and how to call them to your JavaScript console. In order to get each of them run these commands:

    greeterCompiled.greeter.info.abiDefinition;
    greeter.address;

If you compiled with the [browser-based tool](https://ethereum.github.io/browser-solidity/), you can get the ABI from the fields for the `greeter` and `mortal` contracts labeled "Interface".

Then you can instantiate a JavaScript object which can be used to call the contract on any machine connected to the network. Replace 'ABI' (an array) and 'Address' (a string) to create a contract object in JavaScript:

    var greeter = eth.contract(ABI).at(Address);

This particular example can be instantiated by anyone by simply calling:

    var greeter2 = eth.contract([{constant:false,inputs:[],name:'kill',outputs:[],type:'function'},{constant:true,inputs:[],name:'greet',outputs:[{name:'',type:'string'}],type:'function'},{inputs:[{name:'_greeting',type:'string'}],type:'constructor'}]).at('greeterAddress');

Replace _greeterAddress_ with your contract's address.


**Tip: if the solidity compiler isn't properly installed in your machine, you can get the ABI from the online compiler. To do so, use the code below carefully replacing _greeterCompiled.greeter.info.abiDefinition_  with the abi from your compiler.**


#### Cleaning up after yourself: 

You must be very excited to have your first contract live, but this excitement wears off sometimes, when the owners go on to write further contracts, leading to the unpleasant sight of abandoned contracts on the blockchain. In the future, blockchain rent might be implemented in order to increase the scalability of the blockchain but for now, be a good citizen and humanely put down your abandoned bots. 

A transaction will need to be sent to the network and a fee to be paid for the changes made to the blockchain after the code below is run. The self-destruct is subsidized by the network so it will cost much less than a usual transaction.

    greeter.kill.sendTransaction({from:eth.accounts[0]})

This can only be triggered by a transaction sent from the contracts owner. You can verify that the deed is done simply seeing if this returns 0:

    eth.getCode(greeter.address)

Notice that every contract has to implement its own kill clause. In this particular case only the account that created the contract can kill it. 

If you don't add any kill clause it could potentially live forever independently of you and any earthly borders, so before you put it live check what your local laws say about it, including any possible limitation on technology export, restrictions on speech and maybe any legislation on the civil rights of sentient digital beings. Treat your bots humanely.





