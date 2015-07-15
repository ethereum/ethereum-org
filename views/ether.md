Already feeling comfortable? Time to get some ether. There are three different ways:

### 1. Get ether from someone else


That is by far the easiest way to get ether, but you need to know someone who is willing to give you a hand. If you have such a friend, then type:


```
eth.accounts[0]
```

Copy the address and send it to them hoping to receive some love through the ether. If you don't know anyone who can provide it for you, you can use a faucet, which hand out test ether for free. Try the Zerogox or EtherParty faucets.  If the faucets are not online for some reason, you can also try asking directly to the community on IRC. 

### 2. Mining ether

Since you are one of the first pioneers, it might be possible to acquire ether by mining. You can start your mining operation by typing


```
admin.miner.start()
```

Before you can really find blocks your computer needs to go through a process called “building a DAG”. The DAG (which stands for “Directed Acyclic Graph”) is a large block of data that is required for mining, intended to prevent ASIC appliances (which stands for “Application Specific Integrated Circuits”) from being mass manufactured for mining ethereum.  It is intended to protect pioneers like yourself so that you will only ever need your home computer to mine.. The DAG should take about 10 minutes to generate and as soon as it finishes it will start mining automatically. If at any point you want to see what’s going on, you can type


```
admin.miner.hashrate() 
```

This gives you an idea of how much work your computer is doing per second. Now head to the Network Stats Page and take a look at the Difficulty. Divide that number by your current hashrate and that will give you an estimate, in seconds, of how long you can expect to wait until you mine a block and get some ether. This is an overestimate because it does not take in consideration the number and rewards for uncle blocks. You can use this code snippet to do this automatically:


```
Math.floor(10 * eth.getBlock("latest").difficulty /( 60 * admin.miner.hashrate()))/10 + " Minutes"
```


If you have successfully mined a block you will see a message like this in the logfile:

 
 ```
 🔨 Mined block #12345
```


Your coinbase is the account where your mining reward is sent, by default it is the primary account. In order to check your earnings, you can display your coinbase balance:


```
web3.fromWei(eth.getBalance(eth.coinbase), "ether")
```


Note: the mining rewards in the frontier network are only 10% of what they’ll be when the Homestead phase begins. Frontier should be always considered a test network for the network.

Things to do: If you are serious about mining, then you can also: read more about mining with ‘geth’, understand the current proof of work and why it is ASIC resistant, read up about proof of stake, or start your GPU mining operation.  Read the Mining Documentation or check out the ethereum mining guide on our forums. 

### 3. Importing from the presale

Before you decide to import your presale ether wallet, please remember that Frontier is a test network. It’s dangerous, potentially full of bugs and is prone to instability. While all account balances above 1 ether will be moved over to homestead when it launches, the money in contracts will not. There are many potential mishaps, money can be lost, stolen or locked into a broken contract. We strongly advise you to only move funds that you are willing to risk. If you still want to go forward, then importing your presale wallet is very easy (if you remember your password that is). First you have to quit the console by pressing control+c and getting back to the terminal application. 

Now get your presale file on your computer and find the path to it. Finally, type:


```
geth wallet import /path/to/my/presale.wallet
```

This will prompt for your password and imports your ether presale account. It can be used non-interactively with the --password option taking a passwordfile as argument containing the wallet password in cleartext.



## Sending your first transaction

There are two types of accounts in ethereum:

normal accounts, which hold only ether that can be moved with a private key and
contract addresses, which hold ether controlled by its own internal code. Let’s focus on the former first. 

And similarly, your transactions are also of two types: transactions sent to normal accounts are ether transfers, while the rest is communication with smart contracts, 

Before you send your first ether transfer you need a friend to send your ether to. If you don’t have any, you can also create as many new accounts as you want, following the steps discussed above and simply move your funds between accounts you own. After you’ve done that, run this:  

```
var sender = eth.accounts[0];
var receiver = eth.accounts[1];
var amount = web3.toWei(0.01, "ether");
```

The first two lines set local variables with account numbers for easier access later.. Change the sender and receiver address as much as you like. If you are adding an address instead, put it in between quotes like ‘0xffd25e388bf07765e6d7a00d6ae83fa750460c7e'. The third line converts the token units as required by the network..

Although there are many names for ether denominations we will use only two: “ether” and “wei”. The wei is the minimum atomic unit of ether, and is what is used on the system level. Most day to day transactions will be done with ether, which is equivalent to one quintillion wei, or a 1 followed by 18 zeros. So before sending any transactions it’s very important to convert it to wei, and for that, use the web3.toWei function. (If you are dealing with small amounts of ether, it might be useful to use “finney”, which is a shorthand for a thousandth of an ether, but in most cases ether will suffice).

After having set the variables above, send the transaction with:


```
eth.sendTransaction({from:sender, to:receiver, value: amount})
```


After waiting a few seconds, the transaction should be complete. To check the balance of an account, you simply type:


```
eth.getBalance(eth.accounts[0]);
```




Tip: if you want to check the balance of all your accounts at once, use this JavaScript code snippet:

This code will run in each of your accounts and print its balance in ether.

```
function checkAllBalances() { 
var i =0; 
eth.accounts.forEach( function(e){
  console.log("  eth.accounts["+i+"]: " +  e + " \tbalance: " + web3.fromWei(eth.getBalance(e), "ether") + " ether"); 
i++; 
})
}; 
```

Once you executed the line above, all you need to check your whole balance is:

```
checkAllBalances();
```

Try it yourself:  tweak this javascript function to make it show another unit, like “finney”.  

Learn more: Read the transactions documentation

# Easier addresses: 
## the Name Registrar

All accounts are referenced in the network by their public address. But addresses are long, difficult to write down, hard to memorize and immutable. The last one is specially important if you want to be able to generate fresh accounts in your name, or upgrade the code of your contract. In order to solve this, there is a default name registrar contract which is used to associate the long addresses with short, human-friendly names.

Names have to use only alphanumeric characters and, cannot contain blank spaces. In future releases the name registrar will likely implement a bidding process to prevent name squatting but for now, it's a first come first served based. So as long as no one else registered the name, you can claim it.

First, select your name:


```
var myName = "bob"
```


Then, check the availability of your name:

```
registrar.addr(myName)
```

If that function returns "0x00..", you can claim it to yourself:


```
registrar.reserve.sendTransaction(myName, {from: eth.accounts[0]});
```


Wait for the previous transaction to be picked up. Wait up to thirty seconds and then try:


```
registrar.owner(myName)
```


 If it returns your address, it means you own that name and are able to set your chosen name to any address you want:


```
registrar.setAddress.sendTransaction(myName, eth.accounts[1], true,{from: eth.accounts[0]});
```



You can send a transaction to anyone by name instead of account simply by typing 


```
eth.sendTransaction({from: eth.accounts[0], to: registrar.addr("bob"), value: web3.toWei(1, "ether")})
```



Tip: don't mistake registrar.addr for registrar.owner. The first is to which address that name is pointed at: anyone can point a name to anywhere else, just like anyone can forward a link to google.com, but only the owner of the name can change and update the link. You can set both to be the same address.