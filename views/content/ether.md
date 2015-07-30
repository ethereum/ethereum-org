
## What is Ether?

Ether is a necessary element -- a fuel -- for operating the distributed application platform Ethereum. It is a form of payment made by the clients of the platform to the machines executing the requested operations. To put it another way, ether is the incentive ensuring that developers write quality applications (wasteful code costs more), and that the network remains healthy (people are compensated for their contributed resources).


Feeling comfortable? Time to get some ether!

**If you just want to test the technology, you probably don't need real ether. [Just deploy a private test net](../geth/) and you will be able get free test ether by mining**.


## Get Ether

### 1. Earn it by helping run the network

The Ethereum network is kept running by computers all over the world. In order to reward the computational costs of both processing the contracts and securing the network, there is a reward that is given to the computer that was able to create the latest block on the chain. Every 12 seconds, on average, a new block is added to the blockchain with the latest transactions processed by the network and the computer that generated this block will be awarded 5 ether. Due to the nature of the algorithm for block generation, this process (generating a proof of work) is guaranteed to be random and rewards are given in proportion to the computational power of each machine. 

This process is usually called **_mining_** in the crypto-currency lingo.

#### CPU MINING

If you are on a [private network](../geth) (and if you just want to test the technology for free, you should) then any normal computer with a normal CPU will be able to run the network and earn test ether (ether that is only redeemable on the test network where it was generated) through mining. This is a the best choice for small scale network or testing privately, as it's less resource intensive. On the real (or live test) network a normal desktop (or laptop) computer might take a very long time to succesfully mine a block and receive ether.

Before you do any mining, you need to set which address will receive your earnings (called "etherbase"). You only need to this once. Here's how to set your etherbase and then start mining:

**Geth:**

    miner.setEtherbase(eth.accounts[0]) 
    miner.start() 


**Eth:**

    web3.admin.eth.setMiningBenefactor(web3.eth.accounts[0]) 
    web3.admin.eth.setMining(true)


Before you can find any blocks, however, your computer needs to go through a process called “building a DAG”. This DAG (short for “Directed Acyclic Graph”) is a large data structure (~1GB) required for mining, intended to prevent ASIC machines (“Application Specific Integrated Circuits”) from being mass manufactured for mining ether. Its goal is to protect miners like yourself, so that you will only ever need your home computer to remain competitive. The DAG should take about 10 minutes to generate and as soon as it finishes, Geth will start mining automatically.

If you have successfully mined a block you will see a message like this among the logs:
  
    🔨 Mined block #123456
 
To check your earnings, you can display your balance with:
 
    web3.fromWei(eth.getBalance(web3.eth.accounts[0]), "ether")

#### GPU MINING


If you are serious about mining on the live ethereum network and get real ether rewards, then you should use a dedicated computer with very powerful graphic cards in order to run the network. 


**Instructions for Eth:** 

If you are using **Eth** then GPU mining comes out of the box. Simply quit the console (press control+C multiple times and then enter) and then start it with the --GPU option turned on:

    eth --frontier -b --genesis path/to/genesis.json -i -m on --G

Once you started, just follow the same instructions as normal CPU mining.


**Instructions for Geth**


There are currently two options for GPU mining in Geth available. You can read a more detailed description on how to install it on this [mining post](https://forum.ethereum.org/discussion/197/mining-faq-live-updates).

* **C++ Etherminer**. This is a version for the pro miners. To install it, follow the guide to [install the whole C++ ethereum code](https://github.com/ethereum/cpp-ethereum/wiki/Installing-clients). 

* **Go experimental GPU branch**. It's experimental so you need to build go from source to get it. This version is focused for hobbyists and developers. To install it, [clone geth from source](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu) and then switch to the [GPU Miner branch](https://github.com/ethereum/go-ethereum/tree/gpuminer)


Both setups are explain in further detail in the [Frontier reference](http://guide.ethereum.org/mining.html)

#### More information on Mining

* Frontier's proof of work algorithm does not make use of Scrypt or Sha256, instead, it leverages [EtHash](https://github.com/ethereum/wiki/wiki/Ethash), a Hashimoto / Dagger hybrid. You can read all about the theory behind this and its design in the [Frontier gitBook, mining chapter](http://guide.ethereum.org/mining.html). Note that for Serenity (a future release, a major milestone on the Ethereum development roadmap) we are planning to switch to Proof of Stake (PoS).

* The Ethash proof of work algorithm is memory hard, you'll need at least 1+GB of RAM on each GPU. I say 1+ because the DAG, which is the set of data that's being pushed in and out of the GPU to make parallelisation costly, will start at 1GB and will continue growing indefinitely. 2GB should be a good approximation of what's needed to continue mining throughout the year.

* Mining prowess roughly scales proportionally to [memory bandwidth](https://en.wikipedia.org/wiki/AMD_Radeon_Rx_200_series#Chipset_table). As our implementation is written in OpenCL, AMD GPUs will be 'faster' than similarly priced NVIDIA GPUs. Empirical evidence has already confirmed this, with R9 290x regularly topping benchmarks. 

* ASICs and FPGAs is be strongly discouraged by being rendered financially inefficient, which was confirmed in [an independent audit](https://github.com/LeastAuthority/ethereum-analyses/blob/master/PoW.md#HardwareFeasibility). Don't expect to see them on the market, and if you do, proceed with extreme caution.


### 2. Use Bitcoins

![bitcoin and ethereum](images/bitcoin-and-ethereum-sitting-on-a-tree@2x.png)

Ethereum would never be possible without bitcoin—both the technology and the currency—and we see ourselves not as a competiting currency but as complementary within the digital ecosystem. Ether is to be treated as "crypto-fuel", a token whose purpose is to pay for computation, and is not intended to be used as or considered a currency, asset, share or anything else.

There are many ways in which you can use Bitcoins within the Ethereum ecosystem:

* **Trade BTC for ETH:** multiple third party companies are working to make the exchanging of ether and bitcoins as easy and seamless as possible. If so desired one could trade a bitcoins for ether with the purpose of executing contracts and trade it back immediately in order to keep their value pegged and secured by the bitcoin network.

* **Use a pegged derivative:** Ethereum is a great tool for creating complex trading between multiple parties. If you have a source for the price of Bitcoin that all parties trust, then it's possible to create an [ethereum based currency](../token) whose value is pegged to the market value of Bitcoin. This means that you could trade a btc to a token that is guaranteed to always trade back to the same amount of bitcoins while still being fully compatible with other ethereum contracts. There are multiple ways of doing that and as some of these projects go live and are tested by the community, we will list them here.

* **Use a Bitcoin relay to convert a 2 way peg**: [the bitcoin relay](https://github.com/ethereum/btcrelay/) is a piece of code that allows you to sidechain a bitcoin into ethereum. This means that you can use bitcoin native limited scripting capability to lock a bitcoin into a contract that is directly connected to an ethereum contract, which can then issue an ethereum based token that is guaranteed to be backed by bitcoin. The relay is under development and as implementations are tested and proved to be secure, we will list them here.


### 3. Importing from the presale wallet

Before you decide to import your presale ether wallet, please remember that Frontier is a public, live test network. **It is dangerous, potentially full of bugs and is prone to instability. If you understand the risks and still want to go forward, then importing your presale wallet is very easy.

If you are still on the console, then quit it by pressing _control+C_ multiple times and pressing enter.

Then, if you are using **Geth** execute this:

    geth wallet import /path/to/my/presale.wallet 

Alternatively, if you are using **Eth** execute this:

    eth --import-presale /path/to/my/presale.wallet

This will prompt for your password and imports your ether presale account. It can be used non-interactively with the _--password_ option taking a password file as argument containing the wallet password in cleartext.

If this does not work, please do not hesitate in contacting us on our [forums](http://forum.ethereum.org), [reddit](http://reddit.com/r/ethereum) or at **info (at) ethereum.org**.

If you don't feel comfortable securing your ether right now but just want to check that your presale wallet is included in the blockchain, then use our [online balance checker](#balance)

Read [more about accounts](http://guide.ethereum.org/managing_accounts.html).

### 4. Get ether from a friend

That is by far the easiest way to get ether, but you need to know someone who is willing to give you a hand. If you do have such a friend, then you can send them one of your addresses the the hopes of getting some sweet sweet ether:

    eth.accounts[0] 

Ether sent to your account should show up almost immediately, transactions being integrated into the system every 12 seconds. Make sure you are in sync with the network, otherwise your local Geth will not know about the transfer.



## Sending your first transaction

**ATTENTION: Ethereum addresses don't have, yet, built-in checks on them. That means that if you mistype an address, your ether will be lost forever, without a secondary confirmation window. If you are moving a significang amount, start with smaller quantities that you can afford to lose, until you feel confortable enough.**

There are two types of accounts in Ethereum: *normal accounts*, holding ether that can only be moved with a private key and *contracts*, which hold ether only controlled by their own internal code. In this section we focus on the former. The remainder of this guide will be dedicated to the latter.

Similarly, your transactions are also of two types: those sent to normal accounts are *ether transfers*, while the rest are *communication* with smart contracts.

Before you execute your first ether transfer you need a friend to send your ether to. If you don’t have any, you can also create as many new accounts as you want, following the steps discussed previously and simply move your funds between accounts you own. Assuming you created a second account to send the ether to:
     
    var sender    = web3.eth.accounts[0];
    var recipient = web3.eth.accounts[1];

    var amount = web3.toWei(0.01, "ether");

The first two lines set local variables with account numbers for easier access later. Change the sender and recipient addresses to whatever you like. If you are adding a friend's account address instead, put it in between quotes like ‘0xffd25e388bf07765e6d7a00d6ae83fa750460c7e'. The third line converts the chosen amount to the network's base unit (wei).

Although there are many names for ether denominations, we will use only two: “ether” and “wei”. Wei is the atomic unit of ether, and is the one used on the system level. Most day-to-day transactions will be done with ether, which is equivalent to one quintillion wei, or a 1 followed by 18 zeros. So before sending any transactions, it’s very important to convert the amount to wei, and for that, you can use the _web3.toWei_ function.

After having set the variables above, send the transaction with:

    web3.eth.sendTransaction({from: sender, to: recipient, value: amount})

Waiting a few seconds, the transaction should be complete. To check the balance of an account, simply type:

    web3.eth.getBalance(recipient)

**Tip:** If you are using _Geth_ then you can just use **eth** instead of **web3.eth** command.

### Transaction Receipts

Anytime you create a transaction in Ethereum, the string that is returned is the **Transaction Hash**. You can use those to keep track of a transaction in progress, or the amount of gas spent in a past transaction using _eth.getTransaction()_ and _eth.getTransactionReceipt_. Here's how to use it:

    var tx =  web3.eth.sendTransaction({from: web3.eth.accounts[0], to: web3.eth.accounts[1], value: amount});
    web3.eth.getTransaction(tx);

And if the transaction has been picked up already, you can check its receipt with this:

    web3.eth.getTransactionReceipt(tx);

