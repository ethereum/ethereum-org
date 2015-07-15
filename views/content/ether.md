
## What is Ether?

Ether is a necessary element -- a fuel -- for operating the distributed application platform Ethereum. It is a form of payment made by the clients of the platform to the machines executing the requested operations. To put it another way, ether is the incentive ensuring that developers write quality applications (wasteful code costs more), and that the network remains healthy (people are compensated for their contributed resources).


Feeling comfortable? Time to get some ether!

**If you just want to test the technology, you probably don't need real ether. [Just deploy a private test net](../geth/) and you will be able get free test ether by mining**.


## Get Ether

### 1. Earn it by helping run the network

The ethereum network kept running by computers all over the world. In order to reward the computational costs of both processing the contracts and securing the network, there is a reward that is given for the computer who was able to create the latest block on the chain. Every 12 seconds, in average, a new block is added to the blockchain with the latest transactions and the computer that was generated it will be given 5 ether. Due to the nature of the algorithm for block generating, this process is guaranteed to be random and rewards are given in proportion to the computational power of each machine. 

This process is usually called **_mining_** in the crypto-currency lingo.

#### CPU MINING

If you are on a [private network](../geth) (and if you just want to test the technology for free, you should) then any normal computer with a normal CPU will be able to run the network and earn test ether (ether that is only redeemable on the test network where it was generated). This is a the best choice for small scale network or testing privately, as it's less resource intensive. On the real network however, a normal desktop (or laptop) computer might prove very impractical. 

Before you do any minining, you need to set which address will receive your earnings (called "etherbase").

    miner.setEtherbase(eth.accounts[0])

Then to begin mining, just type:

    miner.start() 

Before you can find any blocks however, your computer needs to go through a process called “building a DAG”. This DAG (short for “Directed Acyclic Graph”) is a large data structure (~1GB) required for mining, intended to prevent ASIC machines (“Application Specific Integrated Circuits”) from being mass manufactured for mining ether. Its goal is to protect miners like yourself, so that you will only ever need your home computer to remain competitive. The DAG should take about 10 minutes to generate and as soon as it finishes, Geth will start mining automatically.

If you have successfully mined a block you will see a message like this among the logs:
  
    🔨 Mined block #12345
 
To check your earnings, you can display your balance with:
 
    web3.fromWei(eth.getBalance(eth.coinbase), "ether")

#### GPU MINING

This is a summary,  but you can read the [full mining guide here](https://forum.ethereum.org/discussion/197/mining-faq-live-updates).

If you are serious about mining on the live ethereum network and get real ether rewards, then you should use a dedicated computer with very powerful graphic cards in order to run the network. 

Mining, for the time being, is best left to Linux. We will likely be releasing Windows releases to provide the best support that we can... however we cannot guarantee it. If you must use Windows, using a workaround such as Virtualbox or Vmware is probably recommended for the time being, but this will not be an appropriate mining setup.

Frontier does not make use of Scrypt or Sha256, but instead, it leverages of [EtHash](https://github.com/ethereum/wiki/wiki/Ethash), a Hashimoto / Dagger hybrid. You can read all about the theory behind this and it's design on the [Frontier gitBook, mining chapter](http://ethereum.gitbooks.io/frontier-guide/content/mining.html).

For the Serenity (a future version of Ethereum) release we are planning to switch to PoS.

The algorithm is memory hard, you'll need at least 1+GB of RAM on each GPU. I say 1+ because the DAG, which is the set of data that's being pushed in and out of the GPU to make parallelisation costly, will start at 1GB and will continue growing indefinitely. 2GB should be a good approximation of what's needed to continue mining throughout the year.

Mining prowess roughly scales proportionally to [memory bandwidth](https://en.wikipedia.org/wiki/AMD_Radeon_Rx_200_series#Chipset_table). As our implementation is written in OpenCL, AMD GPUs will be 'faster' than similarly priced NVIDIA GPUs. Empiric evidence has already confirmed this, with R9 290x regularly topping benchmarks. 

ASICs and FPGAs is be strongly discouraged by being rendered financially inefficient, which was confirmed in [an independent audit](https://github.com/LeastAuthority/ethereum-analyses/blob/master/PoW.md#HardwareFeasibility). Don't expect to see them on the market, and if you do, proceed with extreme caution.

There are currently two options for GPU miners available. 

* **Go experimental GPU branch**. It's experimental so you need to build go from source to get it. This version is focused for hobbyist and developers. To install it, [clone geth from source](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu) and then switch to the [GPU Miner branch](https://github.com/ethereum/go-ethereum/tree/gpuminer)

* **C++ Etherminer**. This is a version for the pro miners. To install it, follow the guide to [install the whole C++ ethereum code](https://github.com/ethereum/cpp-ethereum/wiki/Installing-clients). 


### 2. Importing from the presale wallet

Before you decide to import your presale ether wallet, please remember that Frontier is a public, live test network. **It is dangerous, potentially full of bugs and is prone to instability.** While all account balances above 1 ether will be moved over to Homestead when it launches, the ether in contracts will not. There are many potential mishaps, ether can be lost, stolen or locked into a broken contract. We strongly advise you to only move funds that you are willing to risk. If you understand the risks and still want to go forward, then importing your presale wallet is very easy.

If you are still on the console, then quit it by pressing _control+C_, then execute this:

    geth wallet import /path/to/my/presale.wallet 

This will prompt for your password and imports your ether presale account. It can be used non-interactively with the _--password_ option taking a password file as argument containing the wallet password in cleartext.

If this does not work, please do not hesitate in contacting us on our [foruns](http://forum.ethereum.org), [reddit](http://reddit.com/r/ethereum) or at **info (at) ethereum.org**.



### 3. Use Bitcoins

![bitcoin and ethereum](images/bitcoin-and-ethereum-sitting-on-a-tree@2x.png)

Ethereum would never be possible without bitcoin—both the technology and the currency—and it sees itself not as a competiting currency but as complementary to the digital ecossystem. Ether is to be treated as "crypto-fuel", a token whose purpose is to pay for computation, and is not intended to be used as or considered a currency, asset, share or anything else.

There are many ways in which you can use Bitcoins within the Ethereum ecossystem:

* **Trade BTC for ETH:** we are working with multiple exchanges to make the exchanging of ether and bitcoins as easy and seamless as possible. If so desired one could trade a bitcoins for ether with the purpose of executing contracts and trade it back immediately in order to keep their value pegged and secured by the butcoin network. As those exchanges go live, we will list them here.

* **Use a pegged derivative:** Ethereum is a great tool for creating complex trading between multiple parties. If you have a source for the price of Bitcoin that all parties trust, then it's possible to create an [ethereum based currency](../token) whose value is pegged to the market value of Bitcoin. This means that you could trade a btc to a token that is guaranteed to always trade back to the same amount of bitcoins while still being fully compatible with other ethereum contracts. There are multiple ways of doing that and as some of these projects go live and are tested by the community, we will list them here.

* **Use a Bitcoin relay to convert a 2 way peg**: [the bitcoin relay](https://github.com/ethereum/btcrelay/) is a piece of code that allows you to sidechain a bitcoin into ethereum. This means that you can use bitcoin native limited scripting capability to lock a bitcoin into a contract that is directly connected to an ethereum contract, which can then issue an ethereum based token that is guaranteed to be backed by bitcoin. The relay is under development and as implementations are tested and proved to be secure, we will list them here.


### 4. Get ether from a friend

That is by far the easiest way to get ether, but you need to know someone who is willing to give you a hand. If you do have such a friend, then you can send them one of your addresses the the hopes of getting some sweet sweet ether:

    eth.accounts[0] 

Ether sent to your account should show up almost immediately, transactions being integrated into the system every 12 seconds. Make sure you are in sync with the network, otherwise your local Geth will not know about the transfer.



## Sending your first transaction

There are two types of accounts in Ethereum: *normal accounts*, holding ether that can only be moved with a private key and *contracts*, which hold ether only controlled by their own internal code. In this section we focus on the former. The remainder of this guide will be dedicated an entire page for the latter.

Similarly, your transactions are also of two types: those sent to normal accounts are *ether transfers*, while the rest are *communication* with smart contracts.

Before you execute your first ether transfer you need a friend to send your ether to. If you don’t have any, you can also create as many new accounts as you want, following the steps discussed previously and simply move your funds between accounts you own. Assuming you created a second account to send the ether to:
     
    var sender    = eth.accounts[0];
    var recipient = eth.accounts[1];

    var amount = web3.toWei(0.01, "ether");

The first two lines set local variables with account numbers for easier access later. Change the sender and recipient addresses as much as you like. If you are adding a friend's account address instead, put it in between quotes like ‘0xffd25e388bf07765e6d7a00d6ae83fa750460c7e'. The third line converts the chosen amount to the network's base unit.

Although there are many names for ether denominations, we will use only two: “ether” and “wei”. Wei is the atomic unit of ether, and is the one used on the system level. Most day to day transactions will be done with ether, which is equivalent to one quintillion wei, or a 1 followed by 18 zeros. So before sending any transactions, it’s very important to convert it to wei, and for that, use the _web3.toWei_ function. (If you are dealing with very small amounts of ether, it might be useful to use “finney”, which is a shorthand for a thousandth of an ether, but usually ether will suffice).

After having set the variables above, send the transaction with:

    eth.sendTransaction({from: sender, to: recipient, value: amount})

Waiting a few seconds, the transaction should be complete. To check the balance of an account, simply type:

    eth.getBalance(eth.accounts[0])


### Transaction Receipts

Anytime you create a transaction in Ethereum, the string that is returned is the **Transaction Hash**. You can use those to keep track of a transaction in progress, or the amount of gas spent in a past transaction using _eth.getTransaction()_ and _eth.getTransactionReceipt_. Here's how to use it:

    var tx =  eth.sendTransaction({from: eth.accounts[1], to: eth.accounts[0], value: amount});
    eth.getTransaction(tx);

And if the transaction has been picked up already, you can check it's receipt with this:

    eth.getTransactionReceipt(tx);


## Easier addresses: the Name Registrar

All accounts are referenced in the network by their public address. But addresses are long, difficult to write down, hard to memorize and immutable. The last one is especially important if you want to generate fresh accounts in your name or upgrade the code of your contract. In order to solve this, there is a default name registrar contract which is used to associate the long addresses with short, human-friendly names.

Names have to use only alphanumeric characters and cannot contain blank spaces. In future releases the name registrar will likely implement a bidding process to prevent name squatting, but for now it's a first come first served. As long as no one else registered the name, you can claim it.

First, select your name:
 
    var myName = "bob"

Then, check the availability of your name:
 
    registrar.addr(myName)

If that function returns "0x00..", you can claim it to yourself:
 
    registrar.reserve.sendTransaction(myName, {from: eth.accounts[0]})

Wait up to thirty seconds for the previous transaction to be picked up, then try:
 
    registrar.owner(myName)

If it returns your address, it means you own that name can set it to any address you want:
 
    registrar.setAddress.sendTransaction(myName, eth.accounts[1], true,{from: eth.accounts[0]})

You can send a transaction to anyone by name instead of account simply by typing 
 
    eth.sendTransaction({from: eth.accounts[0], to: registrar.addr("bob"), value: web3.toWei(1, "ether")})

*Note: Don't mistake registrar.addr for registrar.owner. The first is to which address that name is pointed at: anyone can point a name to anywhere else, just like anyone can forward a link to google.com, but only the owner of the name can change and update the link. You can set both to be the same address.*