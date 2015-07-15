# Greeter

Now that you’ve mastered the basics of Ethereum, let’s move into your first serious contract. It’s a big open territory and sometimes you might feel lonely, so our first order of business will be to create a little automatic companion to greet you whenever you feel lonely. We’ll call him the “Greeter”.

```js
contract greeter {
  function greet(bytes32 input) returns (bytes32) {
    if (input == "") {  return "Hello, World"; }
    return input; 
  }
}
```

As you can see, the Greeter is an intelligent digital entity that lives on the blockchain and is able to have conversations with anyone who interacts with it, based on it’s input. It might not be a talker, but it’s a great listener.

Before you are able to upload it to the network, you need two things: the compiled code, and the Application Binary Interface, which is a sort of user guide on how to interact with the contract.

The first you can get by using a compiler. You should have a solidity compiler built in on your geth console. To test it, use this command:

```js
eth.getCompilers()
```

If you have it installed, it should output something like this:

```js
['Solidity' ]
```

If instead the command returns an error, then read the documentation on how to install a compiler, use Aleth zero or use the  online solidity compiler. 

If you have Geth Solidity Compiler installed,  you need now reformat by removing spaces so it fits into a string variable:

```js
var greeterSource = 'contract greeter { function greet(bytes32 input) returns(bytes32) { if (input == "") { return "Hello, World!"; } return input; } }'
```

Once you sucessfully executed the above, compile it and publish to the network using the following commands:

```js
var greeterCompiled = eth.compile.solidity(greeterSource).greeter
var primaryAccount = eth.accounts[0]
var greeterAddress = eth.sendTransaction({data: greeterCompiled.code, from: primaryAccount}); 
```

You will probably be asked for the password you picked in the beginning. You are choosing from which account will pay for the transaction. Wait a minute for your transaction to be picked up and then type:

```js
eth.getCode(greeterAddress)
```

This should return the code of your contract. If it returns “0x”, it means that your transaction has not been picked up yet. Wait a little bit more. If it still hasn't check if you are connected to the network

```js
net.peerCount
```

If you have more than 0 peers and it takes more than a minute or two for your transaction to be mined, your gas price might have been too low. You can experiment with different gas prices like this:

```js
var greeterAddress = eth.sendTransaction({data: greeterCompiled.code, from: primaryAccount, gas: 100000, gasPrice: web3.toWei(10, "szabo")}); 
```


The latest gas price can be checked at the [Network Stats Dashboard](https://stats.ethdev.com). Don't get hanged too much on the specific unit conventions or the values of the numbers above, just tweak around that range. Go too up and you might reach gas limit of the block, go too low and the price might be too low, or the gas insufficient for the transaction to be picked up.

After your code has been accepted, `eth.getCode(codeAddress)` will return a string which is your compiled code in hex notation. If that’s the case, congratulations, your little Greeter is live! If the contract is created again (by performing another `eth.sendTransactio`n), it will be published to a new address. To ensure that old contracts can be cleaned and recover it's ether balance, be sure to include a `Suicide` call on it.

Now that your contract is live on the network, anyone can interact with it by instantiating a local copy. But in order to do that, your computer needs to know how to interact with it, which is what the Application Binary Interface (ABI) is for. This is how you instantiate a contract:


```js
greeterContract = eth.contract(greeterCompiled.info.abiDefinition)
greeterInstance = new greeterContract(greeterAddress)
```

**Tip:** if the solidity compiler isn't properly installed in your machine, you can get the ABI from the online compiler . To do so, use the code below carefully replacing the first line variable with the abi from your compiler.

```js
greeterAbiDefinition = [{  constant: false,  inputs: [{    name: 'input',    type: 'bytes32'  } ],  name: 'greet',  outputs: [{    name: '',    type: 'bytes32'  } ],  type: 'function'} ]
greeterContract = eth.contract(greeterAbiDefinition)
greeterInstance = new greeterContract(greeterAddress)
```


Your instance is ready. In order to call it, just type the following command in your terminal:

```js
greeterInstance.greet.call("");
```

If your greeter returned `“Hello World”` then congratulations, you just created your first digital conversationalist bot!  Try again with: 

```js
greeterInstance.greet.call("hi");
```

Try for yourself:  You can experiment changing its parameters to make it smarter. You could have it charge ether for its profound advice by adding:

```js
if (msg.value>0) { return "Thanks!"; }
```

Before the last return statement.




