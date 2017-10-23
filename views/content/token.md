### The Coin

We are going to create a digital token. Tokens in the ethereum ecosystem can represent any fungible tradable good: coins, loyalty points, gold certificates, IOUs, in game items, etc. Since all tokens implement some basic features in a standard way, this also means that your token will be instantly compatible with the ethereum wallet and any other client or contract that uses the same standards.

#### Minimum Viable Token

The standard token contract can be quite complex. But in essence a very basic token boils down to this:

```
!!!include(solidity/token-minimal.sol)!!!
```

#### The code

But if you just want to copy paste a more complete code, then use this:


```
!!!include(solidity/token-erc20.sol)!!!
```

#### Understanding the code

![Deploy New Contract](/images/tutorial/deploy-new-contract.png)


So let's start with the basics. Open the **Wallet** app, go to the *Contracts* tab and then *Deploy New Contract*. On the *Solidity Contract Source code* text field, type the code below:

```
    contract MyToken {
        /* This creates an array with all balances */
        mapping (address => uint256) public balanceOf;
    }
```

A mapping means an associative array, where you associate addresses with balances. The addresses are in the basic hexadecimal ethereum format, while the balances are integers, ranging from 0 to 115 quattuorvigintillion. If you don't know how much a quattuorvigintillion is, it's many vigintillions more than anything you are planning to use your tokens for. The *public* keyword, means that this variable will be accessible by anyone on the blockchain, meaning all balances are public (as they need to be, in order for clients to display them).

![Edit New Contract](/images/tutorial/edit-contract.png)

If you published your contract right away, it would work but wouldn't be very useful: it would be a contract that could query the balance of your coin for any address–but since you never created a single coin, every one of them would return 0. So we are going to create a few tokens on startup. Add this code *before* the last closing bracket, just under the *mapping..* line.

```
    function MyToken() {
        balanceOf[msg.sender] = 21000000;
    }
```

Notice that the *function MyToken* has the same name as the *contract MyToken*. This is very important and if you rename one, you have to rename the other too: this is a special, startup function that runs only once and once only when the contract is first uploaded to the network. This function will set the balance of *msg.sender*, the user which deployed the contract, with a balance of 21 million.

The choice of 21 million was rather arbitrary, and you can change it to anything you want in the code, but there's a better way: instead, supply it as a parameter for the function, like this:

```
    function MyToken(uint256 initialSupply) {
        balanceOf[msg.sender] = initialSupply;
    }
```

Take a look at the right column besides the contract and you'll see a drop down, written *pick a contract*. Select the "MyToken" contract and you'll see that now it shows a section called *Constructor parameters*. These are changeable parameters for your token, so you can reuse the same code and only change these variables in the future.

![Edit New Contract](/images/tutorial/function-picker.png)


Right now you have a functional contract that created balances of tokens but since there isn't any function to move it, all it does is stay on the same account. So we are going to implement that now. Write the following code *before the last bracket*.

```
    /* Send coins */
    function transfer(address _to, uint256 _value) {
        /* Add and subtract new balances */
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }
```

This is a very straightforward function: it has a recipient and a value as the parameter and whenever someone calls it, it will subtract the *_value* from their balance and add it to the *_to* balance. Right away there's an obvious problem: what happens if the person wants to send more than it owns? Since we don't want to handle debt in this particular contract, we are simply going to make a quick check and if the sender doesn't have enough funds the contract execution will simply stop. It's also to check for overflows, to avoid having a number so big that it becomes zero again.

To stop a contract execution mid execution you can either **return** or **throw** The former will cost less gas but it can be more headache as any changes you did to the contract so far will be kept. In the other hand, 'throw' will cancel all contract execution, revert any changes that transaction could have made and the sender will lose all ether he sent for gas. But since the Wallet can detect that a contract will throw, it always shows an alert, therefore preventing any ether to be spent at all.

```
    function transfer(address _to, uint256 _value) {
        /* Check if sender has balance and for overflows */
        require(balanceOf[msg.sender] >= _value && balanceOf[_to] + _value >= balanceOf[_to]);

        /* Add and subtract new balances */
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }
```

Now all that is missing is having some basic information about the contract. In the near future this can be handled by a token registry, but for now we'll add them directly to the contract:

    string public name;
    string public symbol;
    uint8 public decimals;

And now we update the **constructor function** to allow all those variables to be set up at the start:

```
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MyToken(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
    }
```

Finally we now need something called **Events**. These are special, empty functions that you call to help clients like the Ethereum Wallet keep track of activities happening in the contract. Events should start with a capital letter. Add this line at the beginning of the contract to declare the event:

```
    event Transfer(address indexed from, address indexed to, uint256 value);
```

And then you just need to add these two lines inside the "transfer" function:

```
        /* Notify anyone listening that this transfer took place */
        Transfer(msg.sender, _to, _value);
```

And now your token is ready!

#### Noticed the comments?

What are those @notice and @param comments, you might ask? That's [Natspec](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format) an emerging standard for a natural language specification, which allows wallets to show the user a natural language description of what the contract is about to do. While not currently supported by many wallets, this will change in the future, so it's nice to be prepared.

#### How to deploy

If you aren't there already, open the Ethereum Wallet, go to the contracts tab and then click "deploy new contract".

Now get the token source from above and paste it into the "Solidity source field". If the code compiles without any error, you should see a "pick a contract" drop down on the right. Get it and select the "MyToken" contract. On the right column you'll see all the parameters you need to personalize your own token. You can tweak them as you please, but for the purpose of this tutorial we recommend you to pick these parameters: 10,000 as the supply, any name you want, "%" for a symbol and 2 decimal places. Your app should be looking like this:

[![Ethereum Wallet Screenshot 2015-12-03 at 3.50.36 PM 10](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-10.png)](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-10.png)

Scroll to the end of the page and you'll see an estimate of the computation cost of that contract and you can select a fee on how much ether you are willing to pay for it. **Any excess ether you don't spend will be returned to you** so you can leave the default settings if you wish. Press "deploy", type your account password and wait a few seconds for your transaction to be picked up.

[![Ethereum Wallet Screenshot 2015-12-03 at 3.50.36 PM 11](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-11.png)](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-11.png)

You'll be redirected to the front page where you can see your transaction waiting for confirmations. Click the account named "Etherbase" (your main account) and after no more than a minute you should see that your account will show that you have 100% of the shares you just created.  To send some to a few friends: select "send", and then choose which currency you want to send (ether or your newly created share), paste your friend's address on the "to" field and press "send".

![Screen Shot 2015-12-03 at 9.48.15 AM](/images/tutorial/Screen-Shot-2015-12-03-at-9.48.15-AM.png)

If you send it to a friend, they will not see anything in their wallet yet. This is because the wallet only tracks tokens it knows about, and you have to add these manually. Now go to the "Contracts" tab and you should see a link for your newly created contract. Click on it to go to its page. Since this is a very simple contract page there isn't much to do here, just click "copy address" and paste the contract address on a text editor, you'll need it shortly.

To add a token to watch, go to the contracts page and then click "Watch Token". A pop-up will appear and you only need to paste the contract address. The token name, symbol and decimal number should be automatically filled but if it's not you can put anything you want (it will only affect how it displays on your wallet). Once you do this, you'll automatically be shown any balance you have of that token and you'll be able to send it to anyone else.

[![Ethereum Wallet Beta 4 Screen Shot 2015-12-03 at 9.44.42 AM](/images/tutorial/Screen-Shot-2015-12-03-at-9.44.42-AM.png)](/images/tutorial/Screen-Shot-2015-12-03-at-9.44.42-AM.png)

And now you have your own crypto token! Tokens by themselves can be useful as [value exchange on local communities](https://en.wikipedia.org/wiki/Local_currency), ways to [keep track of worked hours](https://en.wikipedia.org/wiki/Time-based_currency) or other loyalty programs. But can we make a currency have an intrinsic value by making it useful?


### Improve your token

You can deploy your whole crypto token without ever touching a line of code, but the real magic happens when you start customizing it. The following sections will be suggestions on functions you can add to your token to make it fit your needs more.

#### More basic functions

You'll notice that there some more functions in your basic token contract, like approve, sendFrom and others. These functions are there for your token to interact with other contracts: if you want, say, sell tokens to a decentralized exchange, just sending them to an address will not be enough as the exchange will not be aware of the new tokens or who sent them, because contracts aren't able to subscribe to **Events** only to **function calls**. So for contracts, you should first approve an amount of tokens they can move from your account and then ping them to let them know they should do their thing - or do the two actions in one, with **approveAndCall**.

Because many of these functions are having to reimplement the transferring of tokens, it makes sense to change them to an internal function, which can only be called by the contract itself:

```
    /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
        require (balanceOf[_from] > _value);                // Check if the sender has enough
        require (balanceOf[_to] + _value > balanceOf[_to]); // Check for overflows
        require(!frozenAccount[_from]);                     // Check if sender is frozen
        require(!frozenAccount[_to]);                       // Check if recipient is frozen
        balanceOf[_from] -= _value;                         // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient
        Transfer(_from, _to, _value);
    }
```

Now all your functions that result in the transfer of coins, can do their own checks and then call **transfer** with the correct parameters. Notice that this function will move coins from any account to any other, without requiring anyone's permission to do so: that's why it's an internal function, only called by the contract: if you add any function calling it, make sure it properly verifies if the caller should be have permission to move those.

#### Centralized Administrator

All dapps are fully decentralized by default, but that doesn't mean they can't have some sort of central manager, if you want them to. Maybe you want the ability to mint more coins, maybe you want to ban some people from using your currency. You can add any of those features, but the catch is that you can only add them at the beginning, so all the token holders will always know exactly the rules of the game before they decide to own one.

For that to happen, you need a central controller of currency. This could be a simple account, but could also be a contract and therefore the decision on creating more tokens will depend on the contract: if it's a democratic organization that can be up to vote, or maybe it can be just a way to limit the power of the token owner.

In order to do that we'll learn a very useful property of contracts: **inheritance**. Inheritance allows a contract to acquire properties of a parent contract, without having to redefine all of them. This makes the code cleaner and easier to reuse. Add this code to the first line of your code, before **contract MyToken {**.

```
    contract owned {
        address public owner;

        function owned() {
            owner = msg.sender;
        }

        modifier onlyOwner {
            require(msg.sender == owner);
            _;
        }

        function transferOwnership(address newOwner) onlyOwner {
            owner = newOwner;
        }
    }
```

This creates a very basic contract that doesn't do anything except define some generic functions about a contract that can be "owned". Now the next step is just add the text *is owned* to your contract:

```
    contract MyToken is owned {
        /* the rest of the contract as usual */
```

This means that all the functions inside **MyToken** now can access the variable *owner* and the modifier *onlyOwner*. The contract also gets a function to transfer ownership. Since it might be interesting to set the owner of the contract at startup, you can also add this to the *constructor function*:

```
    function MyToken(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol,
        address centralMinter
        ) {
        if(centralMinter != 0 ) owner = centralMinter;
    }
```

#### Central Mint

Suppose you want the amount of coins in circulation to change. This is the case when your tokens actually represent an off blockchain asset (like gold certificates or government currencies) and you want the virtual inventory to reflect the real one. This might also be the case when the currency holders expect some control of the price of the token, and want to issue or remove tokens from circulation.

First we need to add a variable to store the **totalSupply** and assign it in our constructor function.

```
    contract MyToken {
        uint256 public totalSupply;

        function MyToken(...) {
            totalSupply = initialSupply;
            ...
        }
        ...
    }
```

Now let's add a new function finally that will enable the owner to create new tokens:

```
    function mintToken(address target, uint256 mintedAmount) onlyOwner {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(0, owner, mintedAmount);
        Transfer(owner, target, mintedAmount);
    }
```

Notice the modifier **onlyOwner** on the end of the function name. This means that this function will be rewritten at compilation to inherit the code from the **modifier onlyOwner** we had defined before. This function's code will be inserted where there's an underline on the modifier function, meaning that this particular function can only be called by the account that is set as the owner. Just add this to a contract with an **owner** modifier and you'll be able to create more coins.

#### Freezing of assets

Depending on your use case, you might need to have some regulatory hurdles on who can and cannot use your tokens. For that to happen, you can add a parameter that enables the contract owner to freeze or unfreeze assets.

Add this variable and function anywhere inside the contract. You can put them anywhere but for good practice we recommend you put the mappings with the other mappings and events with the other events.

```
    mapping (address => bool) public frozenAccount;
    event FrozenFunds(address target, bool frozen);

    function freezeAccount(address target, bool freeze) onlyOwner {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }
```

With this code, all accounts are unfrozen by default but the owner can set any of them into a freeze state by calling **Freeze Account**. Unfortunately freezing has no practical effect, because we haven't added anything to the transfer function. We are changing that now:

```
    function transfer(address _to, uint256 _value) {
        require(!frozenAccount[msg.sender]);
```

Now any account that is frozen will still have their funds intact, but won't be able to move them. All accounts are unfrozen by default until you freeze them, but you can easily revert that behavior into a whitelist where you need to manually approve every account. Just rename **frozenAccount** into **approvedAccount** and change the last line to:

```
        require(approvedAccount[msg.sender]);
```

#### Automatic selling and buying

So far, you've relied on utility and trust to value your token. But if you want you can make the token's value be backed by ether (or other tokens) by creating a fund that automatically sells and buys them at market value.

First, let's set the price for buying and selling:

```
    uint256 public sellPrice;
    uint256 public buyPrice;

    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }
```

This is acceptable for a price that doesn't change very often, as every new price change will require you to execute a transaction and spend a bit of ether. If you want to have a constant floating price we recommend investigating [standard data feeds](https://github.com/ethereum/wiki/wiki/Standardized_Contract_APIs#data-feeds)

The next step is making the buy and sell functions:

```
    function buy() payable returns (uint amount){
        amount = msg.value / buyPrice;                    // calculates the amount
        require(balanceOf[this] >= amount);               // checks if it has enough to sell
        balanceOf[msg.sender] += amount;                  // adds the amount to buyer's balance
        balanceOf[this] -= amount;                        // subtracts amount from seller's balance
        Transfer(this, msg.sender, amount);               // execute an event reflecting the change
        return amount;                                    // ends function and returns
    }

    function sell(uint amount) returns (uint revenue){
        require(balanceOf[msg.sender] >= amount);         // checks if the sender has enough to sell
        balanceOf[this] += amount;                        // adds the amount to owner's balance
        balanceOf[msg.sender] -= amount;                  // subtracts the amount from seller's balance
        revenue = amount * sellPrice;
        require(msg.sender.send(revenue));                // sends ether to the seller: it's important to do this last to prevent recursion attacks
        Transfer(msg.sender, this, amount);               // executes an event reflecting on the change
        return revenue;                                   // ends function and returns
    }
```

Notice that this will not create new tokens but change the balance the contract owns. The contract can hold both its own tokens and ether and the owner of the contract, while it can set prices or in some cases create new tokens (if applicable) it cannot touch the bank's tokens or ether. The only way this contract can move funds is by selling and buying them.

**Note** Buy and sell "prices" are not set in ether, but in *wei* the minimum currency of the system (equivalent to the cent in the Euro and Dollar, or the Satoshi in Bitcoin). One ether is 1000000000000000000 wei. So when setting prices for your token in ether, add 18 zeros at the end.

When creating the contract, **send enough ether to it so that it can buy back all the tokens on the market** otherwise your contract will be insolvent and your users won't be able to sell their tokens.

The previous examples, of course, describe a contract with a single central buyer and seller, a much more interesting contract would allow a market where anyone can bid different prices, or maybe it would load the prices directly from an external source.

#### Autorefill

Everytime you make a transaction on ethereum you need to pay a fee to the miner of the block that will calculate the result of your smart contract. [While this might change in the future](https://github.com/ethereum/EIPs/issues/28), for the moment fees can only be paid in ether and therefore all users of your tokens need it. Tokens in accounts with a balance smaller than the fee are stuck until the owner can pay for the necessary fee. But in some usecases, you might not want your users to think about ethereum, blockchain or how to obtain ether, so one possible approach would have your coin automatically refill the user balance as soon as it detects the balance is dangerously low.

In order to do that, first you need to create a variable that will hold the threshold amount and a function to change it. If you don't know any value, set it to **5 finney (0.005 ether)**.

```
    uint minBalanceForAccounts;

    function setMinBalance(uint minimumBalanceInFinney) onlyOwner {
         minBalanceForAccounts = minimumBalanceInFinney * 1 finney;
    }
```

Then, add this line to the **transfer** function so that the sender is refunded:

```
    /* Send coins */
    function transfer(address _to, uint256 _value) {
        ...
        if(msg.sender.balance < minBalanceForAccounts)
            sell((minBalanceForAccounts - msg.sender.balance) / sellPrice);
    }
```

You can also instead change it so that the fee is paid forward to the receiver by the sender:

```
    /* Send coins */
    function transfer(address _to, uint256 _value) {
        ...
        if(_to.balance<minBalanceForAccounts)
            _to.send(sell((minBalanceForAccounts - _to.balance) / sellPrice));
    }
```

This will ensure that no account receiving the token has less than the necessary ether to pay the fees.

#### Proof of Work

There are some ways to tie your coin supply to a mathematical formula. One of the simplest ways would be to make it a "merged mining" with ether, meaning that anyone who finds a block on ethereum would also get a reward from your coin, given that anyone calls the reward function on that block. You can do it using the [special keyword coinbase](https://solidity.readthedocs.org/en/latest/units-and-global-variables.html#block-and-transaction-properties) that refers to the miner who finds the block.

```
    function giveBlockReward() {
        balanceOf[block.coinbase] += 1;
    }
```

It's also possible to add a mathematical formula, so that anyone who can do math can win a reward. On this next example you have to calculate the cubic root of the current challenge gets a point and the right to set the next challenge:

```
    uint currentChallenge = 1; // Can you figure out the cubic root of this number?

    function rewardMathGeniuses(uint answerToCurrentReward, uint nextChallenge) {
        require(answerToCurrentReward**3 == currentChallenge); // If answer is wrong do not continue
        balanceOf[msg.sender] += 1;         // Reward the player
        currentChallenge = nextChallenge;   // Set the next challenge
    }
```

Of course while calculating cubic roots can be hard for someone to do on their heads, they are very easy with a calculator, so this game could be easily broken by a computer. Also since the last winner can choose the next challenge, they could pick something they know and therefore would not be a very fair game to other players. There are tasks that are easy for humans but hard for computers but they are usually very hard to code in simple scripts like these. Instead a fairer system should be one that is very hard for a computer to do, but isn't very hard for a computer to verify. A great candidate would be to create a hash challenge where the challenger has to generate hashes from multiple numbers until they find one that is lower than a given difficulty.

This process was first proposed by Adam Back in 1997 as [Hashcash](https://en.wikipedia.org/wiki/Hashcash) and then was implemented in Bitcoin by Satoshi Nakamoto as **Proof of work** in 2008. Ethereum was launched using such system for its security model, but is planning to move from a Proof of Work security model into a [mixed proof of stake and betting system called *Casper*](https://blog.ethereum.org/2015/12/28/understanding-serenity-part-2-casper/).

But if you like Hashing as a form of random issuance of coins, you can still create your own ethereum based currency that has a proof of work issuance:

```
    bytes32 public currentChallenge;                         // The coin starts with a challenge
    uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
    uint public difficulty = 10**32;                         // Difficulty starts reasonably low

    function proofOfWork(uint nonce){
        bytes8 n = bytes8(sha3(nonce, currentChallenge));    // Generate a random hash based on input
        require(n >= bytes8(difficulty));                   // Check if it's under the difficulty

        uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
        require(timeSinceLastProof >=  5 seconds);         // Rewards cannot be given too quickly
        balanceOf[msg.sender] += timeSinceLastProof / 60 seconds;  // The reward to the winner grows by the minute

        difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty

        timeOfLastProof = now;                              // Reset the counter
        currentChallenge = sha3(nonce, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    }
```

Also change the **Constructor function** (the one that has the same name as the contract, which is called at first upload) to add this line, so the difficulty adjustment will not go crazy:

        timeOfLastProof = now;

Once the contract is online, select the function "Proof of work", add your favorite number on the **nonce** field and try to execute it. If the confirmation window gives a red warning saying *"Data can't be execute"* go back and pick another number until you find one that allows the transaction to go forward: this process is random. If you find one you will be awarded 1 token for every minute that has passed since the last reward was given, and then the challenge difficulty will be adjusted up or down to target an average of 10 minutes per reward.

This process of trying to find the number that will give you a reward is what is called *mining*: if difficulty rises it can be very hard to find a lucky number, but it will always be easy to verify that you found one.


### Improved Coin

#### Full coin code

If you add all the advanced options, this is how the final code should look like:

![Advanced Token](/images/tutorial/advanced-token-deploy.png)


```
!!!include(solidity/token-advanced.sol)!!!
```

#### Deploying

Scroll down and you'll see an estimated cost for deployment. If you want you can change the slider to set a smaller fee, but if the price is too below the average market rate your transaction might take longer to pick up. Click *Deploy* and type your password. After a few seconds you'll be redirected to the dashboard and under **Latest transactions** you'll see a line saying "creating contract". Wait for a few seconds for someone to pick your transaction and then you'll see a slow blue rectangle representing how many other nodes have seen your transaction and confirmed them. The more confirmations you have, the more assurance you have that your code has been deployed.

![Created Token](/images/tutorial/created-token.png)

Click on the link that says *Admin page* and you'll be taken the simplest central bank dashboard in the world,   where you can do anything you want with your newly created currency.

On the left side under *Read from contract* you have all the options and functions you can use to read information from the contract, for free. If your token has an owner, it will display its address here. Copy that address and paste it on **Balance of** and it will show you the balance of any account (the balance is also automatically shown on any account page that has tokens).

On the right side, under **Write to Contract** you'll see all the functions you can use to alter or change the blockchain in any way. These will cost gas. If you created a contract that allows you to mint new coins, you should have a function called "Mint Token". Select it.

![Manage central dollar](/images/tutorial/manage-central-dollar.png)

Select the address where those new currencies will be created and then the amount (if you have decimals set at 2, then add 2 zeros after the amount, to create the correct quantity). On **Execute from** select the account that set as owner, leave the ether amount at zero and then press execute.

After a few confirmations, the recipient balance will be updated to reflect the new amount. But your recipient wallet might not show it automatically: in order to be aware of custom tokens, the wallet must add them manually to a watch list. Copy your token address (at the admin page, press *copy address*) and send that to your recipient. If they haven't already they should go to the contracts tab, press **Watch Token** and then add the address there. Name, symbols and decimal amounts displayed can be customized by the end user, especially if they have other tokens with similar (or the same) name. The main icon is not changeable and users should pay attention to them when sending and receiving tokens to ensure they are dealing with the real deal and not some copycat token.

![add token](/images/tutorial/add-token.png)


## Using your coin

Once you've deployed your tokens, they will be added to your list of watched tokens, and the total balance will be shown on your account. In order to send tokens, just go to the **Send** tab and select an account that contains tokens. The tokens the account has will be listed just under *Ether*. Select them and then type the amount of tokens you want to send.

If you want to add someone else's token, just go to the **Contracts** tab and click **Watch token**. For example, to add the **Unicorn (🦄)** token to your watch list, just add the address **0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7** and the remaining information will be loaded automatically. Click *Ok* and your token will be added.

![Invisible Unicorns](/images/tutorial/unicorn-token.png)

Unicorn tokens are memorabilia created exclusively for those who have donated to the address **0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359** that is controlled by the Ethereum Foundation. For more information about them [read it here](./donate)

### Now what?

You just learned how you can use ethereum to issue a token, that can represent anything you want. But what can you do with the tokens? You can use, for instance, the tokens to [represent a share in a company](./dao#the-shareholder-association) or you can use a [central committee](./dao#the-code) to vote on when to issue new coins to control inflation. You can also use them to raise money for a cause, via a [crowdsale](./crowdsale). What will you build next?
