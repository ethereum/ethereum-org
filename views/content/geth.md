# Welcome to the Frontier!

The Frontier is the first live release of the Ethereum network. As such you are entering uncharted territory and you are invited to test the grounds and explore. There is a lot of danger, there may still be undiscovered traps, there may be ravaging bands of pirates waiting to attack you, but there also is vast room for opportunities.

In order to navigate the Frontier, you’ll need to use the command line. If you are not comfortable using it, we strongly advise you to step back, watch from a distance for a while and wait until more user friendly tools are made available. Remember, there are no safety nets and for everything you do here, you are mostly on your own.

* **Learn More**
  * [What is Ethereum?](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  * [Safety Caveats](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  * [License and Contributors](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  

### Install: Mac and Linux

The Frontier tool is called Geth (the old english third person singular conjugation of “to go”. Quite appropriate given geth is written in Go). In order to get it, open your command line tool (if you are unsure how to do this, consider waiting for a more user friendly release) and paste the command below. 

    bash <(curl https://install-geth.ethereum.org)  

(old script - remove this when the above is tested)
    
    bash <(curl https://raw.githubusercontent.com/ethereum/frontier-release/master/bin/install.sh)

Paste the above one-liner in your terminal for an automated install script. This script will detect your OS and will attempt to install the ethereum CLI. 

#### Other platforms and install options:

* [Linux (using PPA, build from source)](http://ethereum.gitbooks.io/frontier-guide/content/installing_linux.html)
* [Mac (Homebrew or build from source)](http://ethereum.gitbooks.io/frontier-guide/content/installing_mac.html)
* [Windows (Chocolatey or build from source)](http://ethereum.gitbooks.io/frontier-guide/content/installing_windows.html)
* [Docker](http://ethereum.gitbooks.io/frontier-guide/content/using_docker.html)
* [Raspberry Pi](https://github.com/ethereum/wiki/wiki/Raspberry-Pi-instructions)


### Run it

Geth is a multipurpose command line tool that runs a full Ethereum node implemented in Go. It offers three interfaces: the [command line](http://ethereum.gitbooks.io/frontier-guide/content/cli.html) subcommands and options, a [JSON-RPC server](http://ethereum.gitbooks.io/frontier-guide/content/rpc.html) and an [interactive console](http://ethereum.gitbooks.io/frontier-guide/content/jsre.html).

For the purposes of this guide, we will focus on the Console, a JavaScript environment that contains all the main features you probably want. To start it, simply type:

    geth console

Tip: Typing **web3** will list all the available packages, fields and functions provided by Geth. The most commonly used you should be aware of are the packages: **admin** (administering your node), **pesonal** (managing your accounts), **miner** (handling mining operations) and **eth** (interacting with the blockchain).

**ATTENTION: If you just want to test the technology and play around, DON'T USE THE MAIN NETWORK. Read further to find out how to deploy a private test network without spending your ether.**


### Connecting to a private test net

Sometimes you might not want to connect to the live public network. Instead, you can choose to create your own private testnet. This is very useful if you don't need to test public contracts and want just to try- or develop on the technology. Since you would be only one mining, you can easily get a lot of ether to test your code. 

    geth --networkid 12345 --genesisnonce 678 --datadir ~/.ethereum_experiment console

Replace 12345 with any random number you want to use as the network ID. Changing the genesis nonce is optional but it's important because if someone accidentally connects to your testnet using the real chain, your local copy will be considered a stale fork and updated to the _"real"_ one. Changing the datadir also changes your local copy of the blockchain, otherwise, in order to successfully mine a block, you would need to mine against the difficulty of the last block present in your local copy of the blockchain - which may take several hours. 

This will prevent anyone who doesn't know your chosen — secret — nonce and network id, from connecting to you or providing you with unwanted data. If you *want* to connect to other peers and create a small private network of multiple computers, you have to help each node find the others. To do that, first you need your Node URL:

    admin.nodeInfo.NodeUrl

Then on the other clients, tell them to add your peer by executing this command:

    admin.addPeer(YOURNODEURL)

You don't need to add all clients to every other, once connected, they will share information about the other node each one is connected to.


### Logs 

You'll notice that there are many log entries popping up on your console, sometimes while you type. This is because all the warnings and progress information are logged live by a running node. If you want to save the logs to a file you can see later, use this command:

    geth console 2>>geth.log

An better solution however, is to run multiple terminal windows with the logs in one and your current task in another. This can be done by attaching a new console to an already running Geth process. This will give you the exact same functionality as the original console, but in a fresh and clean environment.

    geth attach

The console has history that persists between sessions. You can navigate your command history by using the up and down arrow keys.

#### Learn More on Running

* [Backup and restore](http://ethereum.gitbooks.io/frontier-guide/content/backup_restore.html)
* [Connecting to the network](http://ethereum.gitbooks.io/frontier-guide/content/connecting.html)
* [Monitoring your nodes](http://ethereum.gitbooks.io/frontier-guide/content/netstats.html)
* [Setting up a cluster](http://ethereum.gitbooks.io/frontier-guide/content/cluster.html)


### Creating accounts

In order to do most actions in Ethereum you need ether, and to get it, you will need to generate an account. There are [various ways to go around this](http://ethereum.gitbooks.io/frontier-guide/content/managing_accounts.html), but the simplest one is through the Geth console:

    personal.newAccount("Write here a good, randomly generated, passphrase!")

**Note: Pick up a good passphrase and write it down. If you lose the passphrase you used to encrypt your account, you will not be able to access that account. Repeat: There are no safety nets. It is NOT possible to access your account without a valid passphrase and there is no "forgot my password" option here.**

**DO NOT FORGET YOUR PASSPHRASE! **

You may create as many or as few accounts as you like. By convention we call the first account you create your primary account. You can see all your accounts with the command:
 
    eth.accounts


### Get the balance of any account

All commands on the console are actually in JavaScript, so you can create variables and daisy chain functions. You can also write any “eth” function as “web3.eth” since it’s actually part of the main “web3” object.

Try this for example:

    var primaryAccount = eth.accounts[0]

You now have a variable called primaryAccount that you can use in other calls. To get the balance of any account, use the function _eth.getBalance_, like this:

    eth.getBalance(primaryAccount)

 Your balance should return 0, since you just created it. In order to do the next steps you need to have some ether in your account so you can pay the gas costs. In the next section you'll learn what gas is, and how you can interact with the network.


### Check All Balances at once

Geth is a javascript environment, that means you can create functions just like you would in javascript. For example, if you want to check the balance of all your accounts at once, use this JavaScript code snippet. It will iterate over each of your accounts and print their balance in ether:
 
    function checkAllBalances() { 
      var i = 0; 
      eth.accounts.forEach(function(id) {
        console.log("eth.accounts["+i+"]: " + id + "\tbalance: " + web3.fromWei(eth.getBalance(id), "ether") + " ether"); 
        i++;
      })
    }; 

Once you executed the line above, all you need to check your whole balance is:

    checkAllBalances() 
