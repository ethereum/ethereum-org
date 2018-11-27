# Welcome, Blockchain developers!

These are tools for blockchain developers. The command line tools will allow you to connect your server to or run your application on the Ethereum blockchain – or your own private blockchain.

* **Learn More**
  * [What is Ethereum?](http://ethdocs.org/en/latest/introduction/what-is-ethereum.html#what-is-ethereum)
  * [What is ether?](http://ethdocs.org/en/latest/ether.html)


## Clients

For [security purposes](https://blog.ethereum.org/2015/03/05/ethereum-development-process/), three independent implementations were created for Ethereum. The clients have almost identical functionality, so the one you pick is left to personal choice on platform, language and what your planned use is for the network.

If you are building a business that needs to have maximum uptime guarantees to the Ethereum network, we recommend that you run at least one instance of two distinct clients to ensure reliability.


### Geth

![Logo for Go](/images/icons/gopher.png)

The **Go** implementation is called **Geth**. Geth has been audited for security and will be the future basis for the enduser-facing **Mist Browser**, so if you have experience with web development and are interested in building frontends for dapps, you should experiment with Geth.


#### Install on macOS

Install [Homebrew](https://brew.sh/) and make sure it's up to date:

    brew update
    brew upgrade

Then use these commands to install ethereum:

    brew tap ethereum/ethereum
    brew install ethereum

For more, see the [full documentation on Mac OSX Geth](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Mac)


#### Use on Windows

Download the [latest stable binary](https://geth.ethereum.org/downloads/), extract it, download the zip file, extract geth.exe from zip, open a command terminal and type:

    chdir <path to extracted binary>
    open geth.exe


For more, see the [full documentation on Windows Geth](https://github.com/ethereum/go-ethereum/wiki/Installation-instructions-for-Windows)


#### Install on Linux

On Ubuntu, execute these commands:

    sudo apt-get install software-properties-common
    sudo add-apt-repository -y ppa:ethereum/ethereum
    sudo apt-get update
    sudo apt-get install ethereum

For other environments and more instruction, see the [full documentation on Geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)


### Eth

![Logo for C++](/images/icons/cpp.png)

The **C++** implementation is simply called **Eth**. If you want added security by running two different implementations in parallel or are serious about GPU mining, then the C++ "Eth" client is for you.


#### Install on macOS

Install [Homebrew](https://brew.sh/) and then make sure it's up to date:

    brew update
    brew upgrade

Then use these commands to install cpp-ethereum:

    brew tap ethereum/ethereum
    brew install cpp-ethereum
    brew linkapps cpp-ethereum

The [cpp-ethereum documentation](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/index.html)
has detailed information on [OS X Homebrew package](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/installing-binaries/osx-homebrew.html)
and on [Building OS X from Source](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/building-from-source/macos.html).


#### Install on Linux

If you use `apt-get`, paste this into the terminal:

    apt-get install cpp-ethereum

The [cpp-ethereum documentation](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/index.html)
has detailed information on [PPAs for Ubuntu](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/installing-binaries/linux-ubuntu-ppa.html)
and on [Building Linux from Source](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/building-from-source/linux.html).


#### Use on Windows

The [cpp-ethereum documentation](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/index.html)
has detailed information on [Building Windows from Source](http://www.ethdocs.org/en/latest/ethereum-clients/cpp-ethereum/building-from-source/windows.html).


### Python

![Logo for Python](/images/icons/python.png)

The **Python** implementation is called **Pyethapp**. If you are interested in understanding how Ethereum works and how to extend it, the code base of this client is probably the most readable and has a great contract tester library with fast development cycles. It is not meant for high-end usage as performance in this client is not as high priority as clarity and reliability. If you are a Python developer that wants to build decentralized apps or are interested in Ethereum for research or an academic purpose, this is a great client: we invite you to [take a look and contribute to it](https://github.com/ethereum/pyethapp).  


### Other options

* [Parity Ethereum](https://www.parity.io/) a Rust implementation by [Parity Technologies](http://paritytech.io/)  
* A [Haskell](https://github.com/bkirwi/ethereum-haskell) implementation developed by [Blockapps](https://blockapps.net/)
* If you are interested in developing a light application that will run entirely in a web browser, then we recommend using [EthereumJS](https://github.com/ethereum/ethereumjs-lib) as a basis. 
* If you want to create a small hardware project, look into the implementation for the [Raspberry Pi](https://github.com/ethereum/wiki/wiki/Raspberry-Pi-instructions)
* If you want to install geth for non-ubuntu linux then we recommend you look into [building from source](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)
* If you want more flexibility on the Mac, try [Homebrew](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Mac)


### Run it

Geth and Eth are multipurpose command line tools that run a full Ethereum node. They offer multiple interfaces: the [command line](https://ethereum.gitbooks.io/frontier-guide/content/cli.html) subcommands and options, a [JSON-RPC server](https://ethereum.gitbooks.io/frontier-guide/content/rpc.html) and an [interactive console](https://ethereum.gitbooks.io/frontier-guide/content/jsre.html).

For the purposes of this guide, we will focus on the console, a JavaScript environment that contains all of the main features that you probably want. Depending on your client, paste either of these commands:

**Instructions for Geth:**

    geth console

**Instructions for Eth:**

Eth still has a built-in console, but it will be removed soon. Start it using

    eth

and then use either `geth attach` (if you also have geth) or the following npm console. Eth might take some time to start up.

    npm install -g ethereum-console
    ethconsole

The first time you start the command line you will be presented with a license. Before you can use it, you **must** accept this license, please read it carefully.

**ATTENTION: If you just want to test the technology and play around, DON'T USE THE MAIN NETWORK. Read further to find out how to deploy a private test network without spending your ether.**


#### Connecting to a private test net

Sometimes you might not want to connect to the live public network; instead you can choose to create your own private testnet. This is very useful if you don't need to test public contracts and want just to try- or develop on the technology. Since you are the only member of your private network you are responsible for finding all blocks, validating all transactions and executing all smart contracts. This makes development cheaper and easier as you have the ability to flexibly control the inclusion of transactions in your own personal blockchain.

**Geth:**

    geth --datadir ~/.ethereum_private init ~/dev/genesis.json

    geth --fast --cache 512 --ipcpath ~/Library/Ethereum/geth.ipc --networkid 12345 --datadir ~/.ethereum_private  console 

The first command is used to seed your network with the genesis block and set the datadir. The second command uses the datadir and starts the network. It also attaches a console to the network via the IPC (interprocess communication) path.

**Eth:**

    eth --private 12345 --genesis-json ~/test/genesis.json --db-path ~/.ethereum_experiment

Replace 12345 with any random number you want to use as the network ID. It's a good idea to change the content of the genesis block because if someone accidentally connects to your testnet using the real chain, your local copy will be considered a stale fork and updated to the _"real"_ one. Changing the datadir also changes your local copy of the blockchain, otherwise, in order to successfully mine a block, you would need to mine against the difficulty of the last block present in your local copy of the blockchain - which may take several hours.

If you want to create a private network you should, for security reasons, use a different genesis block (a database that contains all the transactions from the Ether sales). You can [read our announcement blog post on how to generate your file](https://blog.ethereum.org/2015/07/27/final-steps/). In the near future we will provide better ways to get other genesis blocks.

These commands prevent anyone who doesn't know your chosen — secret — nonce, network id and genesis file, from connecting to you or providing you with unwanted data. If you *want* to connect to other peers and create a small private network of multiple computers they will all need to use the same networkid and an identical genesis block. You will also have to help each node find the others. To do that, first you need your own Node URL:

    admin.nodeInfo.enode

Which will return your node url - make a note of it and then on the other clients, tell them to add your peer by executing this command:

    admin.addPeer("YOURNODEURL")

You don't need to add every client to one another, as once connected, they will share information about any other peers they are connected to.

If you are using **Eth** then simply [figure out your IP](https://www.google.com/search?&q=my+ip) and execute this command:

    web3.admin.net.connect("YOURIP:30303")


#### Logs

If you are running Geth you'll notice that there are many log entries popping up on your console - sometimes while you type. This is because all warnings and progress information are logged live into your terminal by the client. If you want to save the logs to a file you can view later, use this command:

    geth console 2>>geth.log

Geth supports multiple terminal windows and you may start a new one with the logs in one and your console in another. This will give you the exact same functionality as the original console, but without the clutter. To do this open a new terminal window and input:

    geth attach

The console has auto completion of commands and command-history support that persists between sessions. You can complete a command by pressing the tab key, geth will then auto complete the current statement or show a list of available completions when multiple completions are possible. You can navigate your command history by using the up and down arrow keys.


#### Learn more on running a node

* [Backup and restore](http://ethdocs.org/en/latest/account-management.html#backup-and-restore-accounts)
* [Connecting to the network](http://ethdocs.org/en/latest/network/connecting-to-the-network.html)


### Usage examples


#### Creating accounts

In order to do anything on an Ethereum network you need ether, and to get it, you will need to create an account. There are [various ways to go around this](http://ethdocs.org/en/latest/account-management.html), but the simplest one is through the console.

**CAUTION:** If you were running Ethereum during the olympic phase or earlier in the development, **do not reuse keys** generated before the release of the Frontier client software 1.0, because otherwise they might be **vulnerable to [replay attacks](https://en.wikipedia.org/wiki/Replay_attack)**. Backup those keys, and create new ones using the Frontier release clients.

    personal.newAccount("Write here a good, randomly generated, passphrase!")

**Note: Pick up a good passphrase and write it down. If you lose the passphrase you used to encrypt your account, you will not be able to access that account. Repeat: There are no safety nets. It is NOT possible to access your account without a valid passphrase and there is no "forgot my password" option here. See [this XKCD](https://xkcd.com/936/) for details.**

**DO NOT FORGET YOUR PASSPHRASE! **

You may create as many or as few accounts as you like. By convention we call the first account you create your primary account. You can see all your accounts with the command:

    web3.eth.accounts

The ordering of the accounts reflects the time of their creation. Keyfiles are stored under DATADIR/keystore and can be transferred between clients by copying the files contained within. The files are encrypted with your passphrase and should be backed up if they contain any amount of ether. Note, however, if you transfer individual key files, the order of accounts presented may change and you may not end up the same account on the same position. So be aware that relying on account index is sound only as long as you do not copy external keyfiles to your keystore.


#### Get the balance of any account

All commands on the console are actually in JavaScript, so you can create variables and daisy chain functions. You can also write any “eth” function as “web3.eth” since it’s actually part of the main “web3” object.

Try this for example:

    var primaryAccount = web3.eth.accounts[0]

You now have a variable called primaryAccount that you can use in other calls. To get the balance of any account, use the function _eth.getBalance_, like this:

    web3.eth.getBalance(primaryAccount)

 Your balance should return 0, since you just created it. In order to do the next steps you need to have some ether in your account so you can pay the gas costs. In the next section you'll learn what gas is, and how you can interact with the network.


#### Check all balances at once

The command line tools are JavaScript environments, which means you can create functions just like you would in JavaScript. For example, if you want to check the balance of all your accounts at once, use this JavaScript code snippet.

It will iterate over each of your accounts and print their balance in ether, you can use the following code:

    function checkAllBalances() {
      web3.eth.getAccounts(function(err, accounts) {
       accounts.forEach(function(id) {
        web3.eth.getBalance(id, function(err, balance) {
         console.log("" + id + ":\tbalance: " + web3.fromWei(balance, "ether") + " ether");
       });
      });
     });
    };

Once you executed the line above, all you need to check all of your balances is to call the below function:

    checkAllBalances()


**Tip: if you have many small handy scripts like this you use frequently, you can save them to a file and then load them all at once using _loadScript_:**

    loadScript('/some/script/here.js')


#### Learn more

* [Account Types, Gas, and Transactions](http://ethdocs.org/en/latest/contracts-and-transactions/account-types-gas-and-transactions.html)
* [Developing on Ethereum](http://ethdocs.org/en/latest/contracts-and-transactions/contracts.html#writing-a-contract)
* [Developer tools](http://ethdocs.org/en/latest/contracts-and-transactions/developer-tools.html#developer-tools)
* [Solidity Documentation](https://solidity.readthedocs.io/en/latest/)
