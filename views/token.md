
# Coin

Now that you have your name secured, let's create a currency for your country. Currencies are much more interesting and useful than they seem, they are in essence just a tradeable token, but can become much more, depending on how you use them. It's value depends on it's use: a token can be used to control access (an entrance ticket), can be used for voting rights in an organization (a share), can be placeholders for an asset held by a third party (a certificate of ownership) or even be simply used as an exchange of value within a context (a currency). 

You could do all those things by creating a centralized server, but using an Ethereum token contract comes with some free qualities: for one, it's a decentralized service and tokens can be still exchanged even if the original service goes down for any reason. The code guarantees that no tokens will ever be created other than the ones set in the original code. Finally, by having each user hold it's own token, this eliminates the scenarios where one single server break in can result in the loss of funds from thousands of clients.

This is the code for the contract we're building:
 
```js
contract token { 
    mapping (address => uint) balances;
  
  // Initializes contract with 10 000 tokens to the creator of the contract
  function token() {
        balances[msg.sender] = 10000;
    }
  // Very simple trade function
    function sendToken(address receiver, uint amount) returns(bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        return true;
    }
  
  // Check balances of any account
  function getBalance(address account) returns(uint balance){
    return balances[account];
  }
  
}
```

If you have ever programmed, you won't find it hard to understand what it does: it's a contract that generates 10 thousand tokens to the creator of the contract, and then allows anyone with a balance to send it to others.  

So let's run it!

```js
var tokenSource = 'contract token { mapping (address => uint) balances;  function token() { balances[msg.sender] = 10000; } function sendToken(address receiver, uint amount) returns(bool sufficient) {        if (balances[msg.sender] < amount) return false;        balances[msg.sender] -= amount; balances[receiver] += amount;        return true; } function getBalance(address account) returns(uint balance){ return balances[account]; } }'
```

Now let’s set up the contract, just like we did in the previous section. Since this is a more complex contract than the Greeter, we will add more gas than the default. Extra Gas is returned.

```js
var tokenCompiled = eth.compile.solidity(tokenSource).token
var primaryAccount = eth.accounts[0]
var tokenAddress = eth.sendTransaction({data: tokenCompiled.code, from: primaryAccount, gas:1000000}); 
```

Wait minute until and use the code below to test if your code has been deployed.

```js
eth.getCode(tokenAddress)
```

And then 

```js
tokenContract = eth.contract(tokenCompiled.info.abiDefinition)
tokenInstance = new tokenContract(tokenAddress)
```

You can check your own balance with:

```js
tokenInstance.getBalance.call(primaryAccount)
```

It should have all the 10 000 coins that were created once the contract was published. Since there is not any other defined way for new coins to be issued, those are all that will ever exist. 

Now of course those tokens aren't very useful if you hoard them all, so in order to send them to someone else, use this command:

```js
tokenInstance.sendToken.sendTransaction(eth.accounts[1], 100, {from: primaryAccount})
```

The reason that the first command was `.call()` and the second is a `.sendTransaction()` is that the former is just a read operation and the latter is using gas to change the state of the blockchain, and as such, it needs to be set who is it coming from. Now, wait a minute and check both accounts balances:

```js
tokenInstance.getBalance.call(eth.accounts([0])
tokenInstance.getBalance.call(eth.accounts([1])
```

**Try for yourself:** You just created your own cryptocurrency, imagine all the possibilities! Right now this cryptocurrency is quite limited as there will only ever be 10,000 coins and all are controlled by the coin creator, but you can change that. By adding the following function you issue a coin for everyone who finds an ethereum block:

```js
mapping (uint => address) miningReward;
function claimMiningReward() {
  if (msg.sender == block.coinbase && miningReward[block.number] == 0) {
    balances[msg.sender] += 1;
miningReward[block.number] = msg.sender;
  }
}
```

You could modify this to anything else: maybe reward someone who finds a solution for a new puzzle, wins a game of chess, install a solar panel—as long as that can be somehow translated to a contract. Or maybe you want to create a central bank for your personal country, so you can keep track of hours worked, favors owed or control of property. In that case you might want to add a function to allow the bank to remotely freeze funds and destroy tokens if needed.


##Future improvements, not yet implemented: 

* [Formal proofing](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#documentation-output) is a way where the contract developer will be able to assert some invariant qualities of the contract, like the total cap of the coin.
* [Meta coin standard](https://github.com/ethereum/cpp-ethereum/wiki/MetaCoin-API)is a proposed standardization of function names for coin and token contracts, to allow them to be automatically added to other ethereum contract that utilizes trading, like exchanges or escrow.

