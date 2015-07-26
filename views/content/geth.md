# Welcome to the Frontier!

The Frontier is the first live release of the Ethereum network. As such you are entering uncharted territory and you are invited to test the grounds and explore. There is a lot of danger, there may still be undiscovered traps, there may be ravaging bands of pirates waiting to attack you, but there also is vast room for opportunities.

In order to navigate the Frontier, you’ll need to use the command line. If you are not comfortable using it, we strongly advise you to step back, watch from a distance for a while and wait until more user friendly tools are made available. Remember, there are no safety nets and for everything you do here, you are mostly on your own.

* **Learn More**
  * [What is Ethereum?](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  * [Safety Caveats](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  * [License and Contributors](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  

### Install: Mac and Linux

The Frontier tool is called Geth (the old english third person singular conjugation of “to go”. Quite appropriate given geth is written in Go). In order to 'geth' it, open your command line tool (if you are unsure how to do this, consider waiting for a more user friendly release) and paste the command below: 

    bash <(curl https://install-geth.ethereum.org)  

(old script - remove this when the above is tested)
    
    bash <(curl https://raw.githubusercontent.com/ethereum/frontier-release/master/bin/install.sh)

Paste the above one-liner in your terminal for an automated install script. This script will detect your OS and will attempt to install the ethereum CLI. 

### Windows

Install [Chocolatey](https://chocolatey.org) and then run: 

    choco install geth-stable

#### Other platforms and install options:

* [Linux (using PPA, build from source)](http://ethereum.gitbooks.io/frontier-guide/content/installing_linux.html)
* [Mac (Homebrew or build from source)](http://ethereum.gitbooks.io/frontier-guide/content/installing_mac.html)
* [Windows (Chocolatey or build from source)](http://ethereum.gitbooks.io/frontier-guide/content/installing_windows.html)
* [Docker](http://ethereum.gitbooks.io/frontier-guide/content/using_docker.html)
* [Raspberry Pi](https://github.com/ethereum/wiki/wiki/Raspberry-Pi-instructions)

### Create the genesis block

Currently Geth will not initialise unless you have created and loaded a 'genesis block'. This is the first block in what will eventually be the canonical Ethereum blockchain. It contains the pre-loaded account balances of everyone who participated in the ether pre-sale and most importantly a piece of secret information whose release will trigger the creation of ethereum. If you are trying to run Frontier during the first few days, you will have to take an extra step, which is to create the genesis block yourself. 

If you dont trust us to create a fair genesis block, we can provide you a script to generate one for yourself, which we were able to write while our lawyer was distracted, so he won't mind.

    sudo easy_install pip
    sudo pip install bitcoin
    curl -o genesis_block_generator.py https://raw.githubusercontent.com/ethereum/pyethsaletool/master/genesis_block_generator.py
    python genesis_block_generator.py > genesis_block.json
    
If you don't want to go through this process, and are happy not being a part of the network right at the beginning we will try to provide a downloadable file as soon as one is available.

### Run it

Geth is a multipurpose command line tool that runs a full Ethereum node implemented in Go. It offers three interfaces: the [command line](http://ethereum.gitbooks.io/frontier-guide/content/cli.html) subcommands and options, a [JSON-RPC server](http://ethereum.gitbooks.io/frontier-guide/content/rpc.html) and an [interactive console](http://ethereum.gitbooks.io/frontier-guide/content/jsre.html).

For the purposes of this guide, we will focus on the Console, a JavaScript environment that contains all the main features you probably want. To start it, simply type:

    geth console

Tip: Typing **web3** will list all the available packages, fields and functions provided by Geth. The most commonly used you should be aware of are the packages: **admin** (administering your node), **personal** (managing your accounts), **miner** (handling mining operations) and **eth** (interacting with the blockchain).

If you have sucessfully built (or downloaded) the genesis block then launch the real network by doing this:

    geth  --genesis path/to/genesis.json  console 

**ATTENTION: If you just want to test the technology and play around, DON'T USE THE MAIN NETWORK. Read further to find out how to deploy a private test network without spending your ether.**


### Connecting to a private test net

Sometimes you might not want to connect to the live public network; Instead you can choose to create your own private testnet. This is very useful if you don't need to test public contracts and want just to try- or develop on the technology. Since you are the only member of your private network you are responsible for finding all blocks, validating all transactions and executing all smart contracts. This makes development cheaper and easier as you have the ability to flexibly control the inclusion of transactions in your own personal blockchain.

    geth --networkid 12345 --genesis ~/dev/genesis.json --datadir ~/.ethereum_experiment console

Replace 12345 with any random number you want to use as the network ID. It's a good idea to change the content of the genesis block because if someone accidentally connects to your testnet using the real chain, your local copy will be considered a stale fork and updated to the _"real"_ one. Changing the datadir also changes your local copy of the blockchain, otherwise, in order to successfully mine a block, you would need to mine against the difficulty of the last block present in your local copy of the blockchain - which may take several hours. 

This will prevent anyone who doesn't know your chosen — secret — nonce and network id, from connecting to you or providing you with unwanted data. If you *want* to connect to other peers and create a small private network of multiple computers they will all need to use the same networkid and an identical genesis block. You will also have to help each node find the others. To do that, first you need your own Node URL:

    admin.nodeInfo.NodeUrl

Which will return your node url - make a note of it and then on the other clients, tell them to add your peer by executing this command:

    admin.addPeer("YOURNODEURL")

You don't need to add every client to one another, as once connected, they will share information about any other peers they are connected to.


### Logs 

You'll notice that there are many log entries popping up on your console - sometimes while you type. This is because all warnings and progress information are logged live into your terminal by the client. If you want to save the logs to a file you can view later, use this command:

    geth console 2>>geth.log

Geth supports multiple terminal windows and you may start a new one with the logs in one and your console in another. This will give you the exact same functionality as the original console, but without the clutter. To do this open a new terminal window and input:

    geth attach

The console has history that persists between sessions. You can navigate your command history by using the up and down arrow keys.

#### Learn More on Running a node

* [Backup and restore](http://ethereum.gitbooks.io/frontier-guide/content/backup_restore.html)
* [Connecting to the network](http://ethereum.gitbooks.io/frontier-guide/content/connecting.html)
* [Monitoring your nodes](http://ethereum.gitbooks.io/frontier-guide/content/netstats.html)
* [Setting up a cluster](http://ethereum.gitbooks.io/frontier-guide/content/cluster.html)


### Creating accounts

In order to do anything on an Ethereum network you need ether, and to get it, you will need to generate an account. There are [various ways to go around this](http://ethereum.gitbooks.io/frontier-guide/content/managing_accounts.html), but the simplest one is through the Geth console:

    personal.newAccount("Write here a good, randomly generated, passphrase!")

**Note: Pick up a good passphrase and write it down. If you lose the passphrase you used to encrypt your account, you will not be able to access that account. Repeat: There are no safety nets. It is NOT possible to access your account without a valid passphrase and there is no "forgot my password" option here. See [this XKCD](https://xkcd.com/936/) for details**

**DO NOT FORGET YOUR PASSPHRASE! **

You may create as many or as few accounts as you like. By convention we call the first account you create your primary account. You can see all your accounts with the command:
 
    eth.accounts

The ordering of the accounts reflects the time of their creation. Keyfiles are stored under DATADIR/keystore and can be transferred between clients by copying the files contained within. The files are encrypted with your passphrase and should be backed up if they contain any amount of ether. Note, however, if you transfer individual key files, the order of accounts presented may change and you may not end up the same account on the same position. So be aware that relying on account index is sound only as long as you do not copy external keyfiles to your keystore.

### Get the balance of any account

All commands on the console are actually in JavaScript, so you can create variables and daisy chain functions. You can also write any “eth” function as “web3.eth” since it’s actually part of the main “web3” object.

Try this for example:

    var primaryAccount = eth.accounts[0]

You now have a variable called primaryAccount that you can use in other calls. To get the balance of any account, use the function _eth.getBalance_, like this:

    eth.getBalance(primaryAccount)

 Your balance should return 0, since you just created it. In order to do the next steps you need to have some ether in your account so you can pay the gas costs. In the next section you'll learn what gas is, and how you can interact with the network.


### Check All Balances at once

Geth is a JavaScript environment, that means you can create functions just like you would in JavaScript. For example, if you want to check the balance of all your accounts at once, use this JavaScript code snippet. It will iterate over each of your accounts and print their balance in ether:
 
    function checkAllBalances() { 
      var i = 0; 
      eth.accounts.forEach(function(id) {
        console.log("eth.accounts["+i+"]: " + id + "\tbalance: " + web3.fromWei(eth.getBalance(id), "ether") + " ether"); 
        i++;
      })
    }; 

Once you executed the line above, all you need to check all of your balances is to call the below function:

    checkAllBalances() 


**Tip: if you have many small handy scripts like this you use frequently, you can save them to a file and then load them all at once using _loadScript_:**

    loadScript('/some/script/here.js')


