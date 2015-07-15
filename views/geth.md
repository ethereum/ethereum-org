# Welcome to the Frontier!

The Frontier is the first live release of the Ethereum network. As such you are entering uncharted territory and you are invited to test the grounds and explore. There is a lot of danger, there may still be undiscovered traps, there may be ravaging bands of pirates waiting to attack you, but there also is vast room for opportunities.

In order to navigate the Frontier, you’ll need to use the command line. If you are not comfortable using it, we strongly advise you to step back, watch from a distance for a while and wait until more user friendly tools are made available. Remember, there are no safety nets and for everything you do here, you are mostly on your own.


## Hitching up your wagon.

The Frontier tool is called Geth (the old english third person singular conjugation of “to go”. Quite appropriate given geth is written in Go). In order to get it, open your command line tool (if you are unsure how to do this, consider waiting for a more user friendly release) and paste the command below. 


```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/cubedro/frontier.ethereum.org/master/bin/install.rb)"
```

Or, alternatively


```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/cubedro/frontier.ethereum.org/master/bin/install.rb)"
```


Paste the above one-liner in your terminal for an automated install script. This script will detect your OS and will attempt to install the ethereum CLI. Please click the button below if you'd like to see a step by step description of the installer script.

Geth is a multipurpose command line tool that runs a full Ethereum node implemented in Go. It offers three interfaces: the command line subcommands and options [link], a JSON-RPC server and an interactive console. For the purposes of this guide, we will focus on the Console, a javascript environment that contains all the main features you probably want. Type the code below on your terminal


```
geth console 2>>geth.log
```


You are ready to start. The 2>>geth.log creates a text file with the output of your console. On a linux machine or Mac OS you can run one terminal with the geth console and a second one with the logging output by opening a new terminal and typing: tty
The output will be something like: /dev/pts/13 (or on Mac /dev/tty002). Then in your main terminal type: geth console 2>> /dev/pts/13  This will allow you to monitor your node without cluttering your console.
 
The geth console has history that persists between sessions. You can navigate your command history by using the up and down arrow keys.

Tip: sometimes you might not need to connect to the live public network, you can instead choose to create your own private testnet. This is very useful if you don't need to test external contracts and want just to test the technology, because you won't have to compete with other miners and will easily generate a lot of test ether to play around (replace 12345 with any number


```
geth —networkid 12345 console
```


If you use a private testnet, it may be a good idea to start with a 'fresh' blockchain, and not the real blockchain. Otherwise, in order to successfully mine a block, you'll need to mine against the difficulty of the last block present in your local copy of the blockchain - which may take several hours. This is done via the _--datadir_ parameter: 


```
geth --networkid=-123 --datadir=~/.ethereum_experiment console`
```

* **Learn More**
  * [What is Ethereum?](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  * [Safety Caveats](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)
  * [License and Contributors](http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html)

<div class="recipe">
  <h5>Learn more at the <strong>Frontier Guide</strong></h5>
  <h4>Initial Set up</h4>
  <ul>
    <li><a href="http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html">Safety Caveats</a></li>
    <li><a href="http://ethereum.gitbooks.io/frontier-guide/content/ethereum.html">License and Contributors</a></li>
  </ul>
</div>

## Starting down the trail.


In order to do most actions in Ethereum you need ether, and to get it, you will need to generate an address (see here for detailed documentation on managing your accounts). Type: 


```
admin.newAccount()
```


You’ll be asked for a passphrase. Choose one wisely and you will be prompted to type it twice. Do NOT forget this passphrase, otherwise it will not be possible to recover any funds you may have on your account. You’ve been warned!

Tip: Typing “admin” by itself will bring up a list of sub commands used to administer your geth installation.

The Following command generates an address and associates it with your local machine. You can create multiple accounts by executing the same command again. Go on, try it:


```
admin.newAccount()
```


By convention we call the first account you create your primary account. You can see all your accounts with the command:


```
eth.accounts
```


Notice that it outputs a Javascript array. It’s because all commands on the console are actually in javascript, so you can create variables and daisychain functions. You can also write any “eth” function as “web3.eth” since it’s actually part of the main “web3” object.

Try this for example:


```
var primaryAccount = eth.accounts[0]
```


You now have a variable called primaryAccount that you can use in other calls, like this:


```
eth.getBalance(primaryAccount)
```


