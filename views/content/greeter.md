
## Building a smart contract using the command line

This page will help you build a *Hello, World* contract on the ethereum command line. If you don't know how to use the command line we recommend you skip this tutorial and instead build a [Custom token using the graphical user interface](./token).

Smart contracts are account holding objects on the ethereum blockchain. They contain code functions and can interact with other contracts, make decisions, store data, and send ether to others. Contracts are defined by their creators, but their execution, and by extension the services they offer, is provided by the ethereum network itself. They will exist and be executable as long as the whole network exists, and will only disappear if they were programmed to self destruct.

What can you do with contracts? Well, you can do almost anything really, but for our getting started guide let's do some simple things: To start you will create a classic "Hello World" contract, then you can build your own crypto token to send to whomever you like. Once you've mastered that then you will raise funds through a crowdfunding that, if successful, will supply a radically transparent and democratic organization that will only obey its own citizens, will never swerve away from its constitution and cannot be censored or shut down. And all that in less than 300 lines of code.

Before you begin:

* [Install the Ethereum CLI](/cli)
* [Learn more about contracts](http://ethdocs.org/en/latest/contracts-and-transactions/contracts.html)

Please confirm that the GUI is closed before entering the `geth` console.
Run `geth` to begin the sync process (this may take a while on the first run).

So let's start now.

### Your first citizen: the greeter

Now that you’ve mastered the basics of Ethereum, let’s move into your first serious contract. The Frontier is a big open territory and sometimes you might feel lonely, so our first order of business will be to create a little automatic companion to greet you whenever you feel lonely. We’ll call him the “Greeter”.

The Greeter is an intelligent digital entity that lives on the blockchain and is able to have conversations with anyone who interacts with it, based on its input. It might not be a talker, but it’s a great listener. Here is its code:


    contract Mortal {
        /* Define variable owner of the type address */
        address owner;

        /* This function is executed at initialization and sets the owner of the contract */
        function Mortal() { owner = msg.sender; }

        /* Function to recover the funds on the contract */
        function kill() { if (msg.sender == owner) selfdestruct(owner); }
    }

    contract Greeter is Mortal {
        /* Define variable greeting of the type string */
        string greeting;

        /* This runs when the contract is executed */
        function Greeter(string _greeting) public {
            greeting = _greeting;
        }

        /* Main function */
        function greet() constant returns (string) {
            return greeting;
        }
    }


You'll notice that there are two different contracts in this code: _"mortal"_ and _"greeter"_.  This is because Solidity (the high level contract language we are using) has *inheritance*, meaning that one contract can inherit characteristics of another. This is very useful to simplify coding as common traits of contracts don't need to be rewritten every time, and all contracts can be written in smaller, more readable chunks. So by just declaring that _greeter is mortal_ you inherited all characteristics from the "mortal" contract and kept the greeter code simple and easy to read.

The inherited characteristic _"mortal"_ simply means that the greeter contract can be killed by its owner, to clean up the blockchain and recover funds locked into it when the contract is no longer needed. Contracts in ethereum are, by default, immortal and have no owner, meaning that once deployed the author has no special privileges anymore. Consider this before deploying.


#### Using Remix

As of 2018, the most convenient way to develop contracts is using Remix, an online IDE. Copy the source code (at the top of this page) to [Remix](https://remix.ethereum.org) and it should automatically compile your code. You can safely ignore any yellow warning boxes on the right plane.

To access the compiled code, ensure that the dropdown menu on the right pane has `greeter` selected. Then click on the **Details** button directly to the right of the dropdown. In the popup, scroll down and copy all the code in the **WEB3DEPLOY** textbox.

Create a temporary text file on your computer and paste that code. Make sure to change the first line to look like the following:

    var _greeting = "Hello World!"

Now you can paste the resulting text on your geth window, or import the file with `loadScript("yourFilename.js")`. Wait up to thirty seconds and you'll see a message like this:

    Contract mined! address: 0xdaa24d02bad7e9d6a80106db164bad9399a0423e

You may have to "unlock" the account that is sending the transaction using the password you picked in the beginning, because you need to pay for the gas costs to deploying your contract: e.g. `personal.unlockAccount(web3.eth.accounts[0], "yourPassword")`.

This contract is estimated to need ~180 thousand gas to deploy (according to the [online solidity compiler](http://remix.ethereum.org)), at the time of writing, gas on the main net is priced at 6 gwei, resulting in 0.00108 ETH worth of feed. You can use [ETH Gas Station Transaction Calculator tool](https://ethgasstation.info/calculatorTxV.php) for updated information.

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

In order for other people to run your contract they need two things:

1. The `Address` where the contract is located 
2. The `ABI` (Application Binary Interface), which is a sort of user manual describing the name of the contract's functions and how to call them to your JavaScript console

To get the `Address`, run this command:

    greeter.address;

To get the `ABI`, run this command:

    greeterCompiled.greeter.info.abiDefinition;

**Tip:** If you compiled the code using [Remix](https://remix.ethereum.org), the last line of code above won't work for you! Instead, you need to copy the `ABI` directly from Remix, similar to how you copied the **WEB3DEPLOY** compiled code. On the right pane, click on the **Details** button and scroll down to the **ABI** textbox. Click on the copy button to copy the entire ABI, then paste it in a temporary text document.

Then you can instantiate a JavaScript object which can be used to call the contract on any machine connected to the network. In the following line, replace `ABI` (an array) and `Address` (a string) to create a contract object in JavaScript:

    var greeter = eth.contract(ABI).at(Address);

This particular example can be instantiated by anyone by simply calling:

    var greeter2 = eth.contract([{constant:false,inputs:[],name:'kill',outputs:[],type:'function'},{constant:true,inputs:[],name:'greet',outputs:[{name:'',type:'string'}],type:'function'},{inputs:[{name:'_greeting',type:'string'}],type:'constructor'}]).at('greeterAddress');

Of course, `greeterAddress` must be replaced with your contract's _unique_ address.

#### Cleaning up after yourself:

You must be very excited to have your first contract live, but this excitement wears off sometimes, when the owners go on to write further contracts, leading to the unpleasant sight of abandoned contracts on the blockchain. In the future, blockchain rent might be implemented in order to increase the scalability of the blockchain but for now, be a good citizen and humanely put down your abandoned bots.

A transaction will need to be sent to the network and a fee to be paid for the changes made to the blockchain after the code below is run. The self-destruct is subsidized by the network so it will cost much less than a usual transaction.

    greeter.kill.sendTransaction({from:eth.accounts[0]})

This can only be triggered by a transaction sent from the contracts owner. You can verify that the deed is done simply seeing if this returns 0:

    eth.getCode(greeter.address)

Notice that every contract has to implement its own kill clause. In this particular case only the account that created the contract can kill it.

If you don't add any kill clause it could potentially live forever independently of you and any earthly borders, so before you put it live check what your local laws say about it, including any possible limitation on technology export, restrictions on speech and maybe any legislation on the civil rights of sentient digital beings. Treat your bots humanely.
