# Welcome to the Frontier!

The Frontier is the first live release of the Ethereum network. As such you are entering uncharted territory and you are invited to test the grounds and explore. There is a lot of danger, there may still be undiscovered traps, there may be ravaging bands of pirates waiting to attack you, but there also is vast room for opportunities.

In order to navigate the Frontier, you’ll need to use the command line. If you are not comfortable using it, we strongly advise you to step back, watch from a distance for a while and wait until more user friendly tools are made available. Remember, there are no safety nets and for everything you do here, you are mostly on your own.

* **Learn More**
  * [What is Ethereum?](http://guide.ethereum.org/ethereum.html)
  * [Frontier Release](http://guide.ethereum.org/frontier.html)
  * [License and Contributors](http://guide.ethereum.org/contributors.html)
  

# Clients

For [security purposes](https://blog.ethereum.org/2015/03/05/ethereum-development-process/) three indenpendent implementations were created for Ethereum. The clients have almost identical functionality so which one you pick is left to personal choice on platform, language and what are your planned use for the network. 

If you are building a business that needs to have always on connections to the ethereum network, we recommend you run at least one instance of both clients, to ensure reliability.

## Geth

![Logo for C++](/images/icons/gopher.png)

The **Go** implementation is called **Geth** (the old english third person singular conjugation of “to go”. Quite appropriate given geth is written in Go). Geth has been audited for security and will be the future basis for the end user facing **Mist Browser**, so if you have experience on web development and is interested in building frontend for html dapps, you should experiment with Geth.


### Install: Mac and Linux

In order to 'geth' it, open your command line tool (if you are unsure how to do this, consider waiting for a more user friendly release) paste the above one-liner in your terminal for an automated install script. This script will detect your OS and will attempt to install Geth. 

    bash <(curl https://install-geth.ethereum.org -L)

Paste the above one-liner in your terminal for an automated install script. This script will detect your OS and will attempt to install the ethereum CLI. 

### Windows

Install [Chocolatey](https://chocolatey.org) and then run this on the [command prompt](http://windows.microsoft.com/en-us/windows-vista/open-a-command-prompt-window): 

    choco install geth-stable -version 1.0.0.0

## Eth

![Logo for C++](/images/icons/cpp.png)

The **C++** implementation is simply called **Eth**. It performs slightly faster and is the basis for the future release of the contract development toolset **Mix IDE**. Eth also comes with some powerful network analyze tools like Alethzero and an in browser solidity compiler. If you are serious about GPU mining and is interested in using ethereum as the backend for projects that involve internet of things, then the Eth client, the C++ client, is for you. 

### Install: Mac and Linux

Paste the above one-liner in your terminal for an automated install script. This script will detect your OS and will attempt to install Eth:

    bash <(curl https://install-eth.ethereum.org -L)


### Windows

Open the [command prompt](http://windows.microsoft.com/en-us/windows-vista/open-a-command-prompt-window) and paste this: 

    bitsadmin /transfer cpp-ethereum "https://build.ethdev.com/builds/Windows%20C%2B%2B%20develop%20branch/Ethereum%20%28%2B%2B%29-win64-latest.exe" %temp%\eth++.exe & %temp%\eth++.exe


## Python

![Logo for Python](/images/icons/python.png)

The **Python** implementation is called Pyethapp. If you are interested in understanding how ethereum works and how to extend it, the code base of this client is probably the most readable and has a great contract tester library with fast development cycles. It is not meant for high-end usage as performance in this client is not as high priority as clarity and reliability. If you are a Python developer that wants to build decentralized apps or you are interested in Ethereum for research, or an academic purpose, this is a great client: we invite you to [take a look and contribute to it](https://github.com/ethereum/pyethapp).  

## Other Options

* If you are interested in developing a light application that will run entirely in a web browser, then we recommend using [EthereumJS](https://github.com/ethereum/ethereumjs-lib) as a basis. 
* If you want to create a small hardware project, look into the implementation for the [Raspberry Pi](https://github.com/ethereum/wiki/wiki/Raspberry-Pi-instructions)
* If you want to install geth for non-ubuntu linux then we recommend you look into [building from source using PPA](http://guide.ethereum.org/installing_linux.html)
* If you want more flexibility on the Mac, try [Homebrew](http://guide.ethereum.org/installing_mac.html)
* Also available: [Docker](http://guide.ethereum.org/using_docker.html)

### Create the genesis block

Frontier users will need to first generate, then load the Genesis block into their Ethereum client. The Genesis block is pretty much a database file: it contains all the transactions from the Ether sale, and when a user inputs it into the client, it represents their decision to join the network under its terms: it is the first step to consensus.

Because the ether pre-sale took place entirely on the bitcoin blockchain, its contents are public, and anyone can generate and verify the Genesis block. In the interest of decentralization and transparency, Ethereum does not provide the Genesis block as a download, but instead has created an open source script that anyone can use to generate the file, a link to which can be found later on in this article. 

[Read our announcement blog post on how to generate your file](https://blog.ethereum.org/2015/07/27/final-steps/). This is probably a temporary step: once the network is healthy enough and reached a higlhy secured consensus on the genesis, then this step will become unnecessary. If you don't want to go through this process, and are happy not being a part of the network right at the beginning then just sit tight and wait for upcoming releases.

### Run it

Geth and Eth are multipurpose command line tools that runs a full Ethereum node implemented in Go. They offer multiple interfaces: the [command line](http://guide.ethereum.org/cli.html) subcommands and options, a [JSON-RPC server](http://guide.ethereum.org/rpc.html) and an [interactive console](http://guide.ethereum.org/jsre.html).

For the purposes of this guide, we will focus on the Console, a JavaScript environment that contains all the main features you probably want. Depending on your client, paste either of these commands:

**Instructions for Geth:**

    geth --genesis path/to/genesis.json console

**Instructions for Eth:** 

    eth --frontier --network-id 1 -b --genesis-json path/to/genesis.json -i  

The first time you start the command line you will be presented with a license. Before you can use them, you **must** accept this license, please read it careful.

**ATTENTION: If you just want to test the technology and play around, DON'T USE THE MAIN NETWORK. Read further to find out how to deploy a private test network without spending your ether.**


### Connecting to a private test net

Sometimes you might not want to connect to the live public network; Instead you can choose to create your own private testnet. This is very useful if you don't need to test public contracts and want just to try- or develop on the technology. Since you are the only member of your private network you are responsible for finding all blocks, validating all transactions and executing all smart contracts. This makes development cheaper and easier as you have the ability to flexibly control the inclusion of transactions in your own personal blockchain.

**Geth:**

    geth --networkid 12345 --genesis ~/test/genesis.json --datadir ~/.ethereum_experiment console

**Eth:**

    eth --private 12345 --genesis-json ~/test/genesis.json --db-path ~/.ethereum_experiment -i

Replace 12345 with any random number you want to use as the network ID. It's a good idea to change the content of the genesis block because if someone accidentally connects to your testnet using the real chain, your local copy will be considered a stale fork and updated to the _"real"_ one. Changing the datadir also changes your local copy of the blockchain, otherwise, in order to successfully mine a block, you would need to mine against the difficulty of the last block present in your local copy of the blockchain - which may take several hours. 

This will prevent anyone who doesn't know your chosen — secret — nonce and network id, from connecting to you or providing you with unwanted data. If you *want* to connect to other peers and create a small private network of multiple computers they will all need to use the same networkid and an identical genesis block. You will also have to help each node find the others. To do that, first you need your own Node URL:

    admin.nodeInfo.NodeUrl

Which will return your node url - make a note of it and then on the other clients, tell them to add your peer by executing this command:

    admin.addPeer("YOURNODEURL")

You don't need to add every client to one another, as once connected, they will share information about any other peers they are connected to.

If you are using **Eth** then simply [figure out your IP](https://www.google.com/search?&q=my+ip) and execute this command:

    web3.admin.net.connect("YOURIP:30303")


### Logs 

If you are running Geth you'll notice that there are many log entries popping up on your console - sometimes while you type. This is because all warnings and progress information are logged live into your terminal by the client. If you want to save the logs to a file you can view later, use this command:

    geth console 2>>geth.log

Geth supports multiple terminal windows and you may start a new one with the logs in one and your console in another. This will give you the exact same functionality as the original console, but without the clutter. To do this open a new terminal window and input:

    geth attach

The console has auto completion and history support that persists between sessions. You can complete a command by pressing the tab key, geth will then auto complete the current statement or show a list of available completions when multiple completions are possible. You can navigate your command history by using the up and down arrow keys.

#### Learn More on Running a node

* [Backup and restore](http://guide.ethereum.org/backup_restore.html)
* [Connecting to the network](http://guide.ethereum.org/connecting.html)
* [Monitoring your nodes](http://guide.ethereum.org/netstats.html)
* [Setting up a cluster](http://guide.ethereum.org/cluster.html)


### Creating accounts

In order to do anything on an Ethereum network you need ether, and to get it, you will need to generate an account. There are [various ways to go around this](http://guide.ethereum.org/managing_accounts.html), but the simplest one is through the console. 

**ATTENTION:** If you were running Ethereum during the olympic phase or earlier in the development, **do not reuse keys** generated before the release of the Frontier client software 1.0, because otherwise they might be vulnerable to [replay attacks](https://en.wikipedia.org/wiki/Replay_attack). Backup those keys, and create new ones using the Frontire release clients.

**GETH**:

    personal.newAccount("Write here a good, randomly generated, passphrase!")

**ETH**:

    web3.admin.eth.newAccount({name:"account01",password:"Write here a good, randomly generated, passphrase!", passwordHint:"my hint"})

**Note: Pick up a good passphrase and write it down. If you lose the passphrase you used to encrypt your account, you will not be able to access that account. Repeat: There are no safety nets. It is NOT possible to access your account without a valid passphrase and there is no "forgot my password" option here. See [this XKCD](https://xkcd.com/936/) for details**

Password hint is optional. You can pick any name you want, it isn't very important.


**DO NOT FORGET YOUR PASSPHRASE! **

You may create as many or as few accounts as you like. By convention we call the first account you create your primary account. You can see all your accounts with the command:
 
    web3.eth.accounts

The ordering of the accounts reflects the time of their creation. Keyfiles are stored under DATADIR/keystore and can be transferred between clients by copying the files contained within. The files are encrypted with your passphrase and should be backed up if they contain any amount of ether. Note, however, if you transfer individual key files, the order of accounts presented may change and you may not end up the same account on the same position. So be aware that relying on account index is sound only as long as you do not copy external keyfiles to your keystore.

### Get the balance of any account

All commands on the console are actually in JavaScript, so you can create variables and daisy chain functions. You can also write any “eth” function as “web3.eth” since it’s actually part of the main “web3” object.

Try this for example:

    var primaryAccount = web3.eth.accounts[0]

You now have a variable called primaryAccount that you can use in other calls. To get the balance of any account, use the function _eth.getBalance_, like this:

    web3.eth.getBalance(primaryAccount)

 Your balance should return 0, since you just created it. In order to do the next steps you need to have some ether in your account so you can pay the gas costs. In the next section you'll learn what gas is, and how you can interact with the network.


### Check All Balances at once

The command line tools are JavaScript environments, which means you can create functions just like you would in JavaScript. For example, if you want to check the balance of all your accounts at once, use this JavaScript code snippet. 

It will iterate over each of your accounts and print their balance in ether, you can use the following code on **Geth** (this will not work in **Eth**):
 
    function checkAllBalances() { 
      var i = 0; 
      web3.eth.accounts.forEach(function(id) {
        console.log("web3.eth.accounts["+i+"]: " + id + "\tbalance: " + web3.fromWei(web3.eth.getBalance(id), "ether") + " ether"); 
        i++;
      })
    }; 

Once you executed the line above, all you need to check all of your balances is to call the below function:

    checkAllBalances() 


**Tip: if you have many small handy scripts like this you use frequently, you can save them to a file and then load them all at once using _loadScript_:**

    loadScript('/some/script/here.js')


