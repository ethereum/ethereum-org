

### Crowdfund your idea

Sometimes a good idea takes a lot of funds and collective effort. You could ask for donations, but donors prefer to give to projects they are more certain will get traction and proper funding. This is an example where a crowdfunding would be ideal: you set up a goal and a deadline for reaching it. If you miss your goal, the donations are returned, therefore reducing the risk for donors. Since the code is open and auditable, there is no need for a centralized, trusted platform and therefore the only fees everyone will pay are just the gas fees.

#### Tokens and DAOs

In this example we will make a better crowdfunding by solving two important problems: how rewards are managed and kept, and how the money is spent after the funds are raised.

Rewards in crowdfundings are usually handled by a central unchangeable database that keeps track of all donors: anyone who missed the deadline for the campaign cannot get in anymore and any donor who changed their mind can't get out. Instead we are going to do this the decentralized way and just create a [token](./token) to keep track of rewards, anyone who contributes gets a token that they can trade, sell or keep for later. When the time comes to give the physical reward the producer only needs to exchange the tokens for real products. Donors get to keep their tokens, even if the project doesn't achieve its goals, as a souvenir.

Also, generally those who are funding can't have any say on how the money is spent after the funds are raised and mismanagement often causes projects never to deliver anything at all. In this project we will use a [Democratic Organization](./dao) that will have to approve any money coming out of the system. This is often called a **crowdsale** or **crowd equity** and is so fundamental that in some cases the token can be the reward itself, especially in projects where a group of people gather together to build a common public good.

![Get the necessary contracts](/images/tutorial/token-crowdsale.png)


* If you are just testing, switch the wallet to the testnet and start mining.

* First of all, create a [fixed supply token](./token#the-code). For this example, we are going to create a supply of **100**, use the name **gadgets**, the box emoji (📦) as a symbol and **0** decimal places. Deploy it and save the address.

* Now create a [shareholder association](./dao#the-shareholder-association). In this example we are going to use the address of the token we just created as the **Shares Address**, a minimum quorum of **10**, and **1500** minutes (25 hours) as the voting time. Deploy this contract and save the address.


#### The code

Now copy this code and let's create the crowdsale:

```
!!!include(solidity/crowdsale.sol)!!!
```

#### Code highlights

Notice that in the **Crowdsale** function (the one that is called upon contract creation), how the variables **deadline** and **fundingGoal** are set:

    fundingGoal = fundingGoalInEthers * 1 ether;
    deadline = now + durationInMinutes * 1 minutes;
    price = etherCostOfEachToken * 1 ether;

Those are some of the [special keywords](https://solidity.readthedocs.io/en/latest/units-and-global-variables.html) in solidity that help you code, allowing you to evaluate some things like **1 ether == 1000 finney** or **2 days == 48 hours**. Inside the system all ether amounts are kept track in **wei**, the smallest divisible unit of ether. The code above converts the funding goal into wei by multiplying it by 1,000,000,000,000,000,000 (which is what the special keyword **ether** converts into). The next line creates a timestamp that is exactly X minutes away from today by also using a combination of the special keywords **now** and **minutes**. For more global keywords, check the [solidity documentation on Globally available variables](https://solidity.readthedocs.io/en/latest/units-and-global-variables.html).

The following line will instantiate a contract at a given address:

    tokenReward = token(addressOfTokenUsedAsReward);

Notice that the contract understands what a *token* is because we defined it earlier by starting the code with:

    interface token { function transfer(address receiver, uint amount){  } }

This doesn't fully describe how the contract works or all the functions it has, but describes only the ones this contract needs: a token is a contract with a *transfer* function, and we have one at this address.


#### How to use

Go to **contracts** and then **deploy contract**:

![Crowdsale deployment](/images/tutorial/crowdsale-deploy.png)

* Put the address of the organization you just created in the field **if successful, send to**.

* Put **250** ethers as the funding goal

* If you are just doing it for a test or demonstration, put the crowdsale duration as 3-10 minutes, but if you are really raising funds you can put a larger amount, like **45,000** (31 days).

* The **ether cost of each token** should be calculated based on how many tokens you are putting up for sale (a maximum of how many you added as "initial supply" of your token on the previous step). In this example, put 5 ethers.

* The address of the token you created should be added to the **token reward address**

Put a gas price, click deploy and wait for your crowdsale to be created. Once the crowdsale page is created, you now need to deposit enough rewards so it can pay the rewards back. Click the address of the crowdsale, then deposit and send **50 gadgets** to the crowdsale.

**I have 100 gadgets. Why not sell them all?**

This is a very important point. The crowdsale we are building will be completely controlled by the token holders. This creates the danger that someone controlling 50%+1 of all the tokens will be able to send all the funds to themselves. You can try to create special code on the association contract to prevent these hostile takeovers, or you can instead have all the funds sent to a simple address. To simplify we are simply selling off half of all the gadgets: if you want to further decentralize this, split the remaining half between trusted organizations.

#### Raise funds

Once the crowdsale has all the necessary tokens, contributing to it is easy and you can do it from any ethereum wallet: just send funds to it. You can see the relevant code bit here:

    function () {
        require(!crowdsaleClosed);
        uint amount = msg.value;
        // ...

The [unnamed function](https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function) is the default function executed whenever a contract receives ether. This function will automatically check if the crowdsale is active, calculate how many tokens the caller bought and send the equivalent. If the crowdsale has ended or if the contract is out of tokens the contract will **throw** meaning the execution will be stopped and the ether sent will be returned (but all the gas will be spent).

![Crowdsale error](/images/tutorial/crowdsale-error.png)

This has the advantage that the contract prevents falling into a situation that someone will be left without their ether or tokens. In a previous version of this contract we would also [**self destruct**](https://solidity.readthedocs.io/en/latest/units-and-global-variables.html#contract-related) the contract after the crowdsale ended: this would mean that any transaction sent after that moment would lose their funds. By creating a fallback function that throws when the sale is over, we prevent anyone losing money.

The contract has a safeWithdrawl() function, without any parameters, that can be executed by the beneficiary to access the amount raised or by the funders to get back their funds in the case of a failed fundraise.

![Crowdsale execution](/images/tutorial/crowdsale-execute.png)

### Extending the crowdsale

#### What if the crowdsale overshoots its target?

In our code, only two things can happen: either the crowdsale reaches its target or it doesn't. Since the token amount is limited, it means that once the goal has been reached no one else can contribute. But the history of crowdfunding is full of projects that overshoot their goals in much less time than predicted or that raised many times over the required amount.

#### Unlimited crowdsale

So we are going to modify our project slightly so that instead of sending a limited set of tokens, the project actually creates a new token out of thin air whenever someone sends them ether. First of all, we need to create a [Mintable token](./token#central-mint).

Then modify the crowdsale to rename all mentions of **transfer** to **mintToken**:



    contract token { function mintToken(address receiver, uint amount){  } }
    // ...
        function () {
            // ...
            tokenReward.mintToken(msg.sender, amount / price);
            // ...
        }

Once you published the crowdsale contract, get its address and go into your **Token Contract** to execute a **Change Ownership** function. This will allow your crowdsale to call the **Mint Token** function as much as it wants.

**Warning:**  This opens you to the danger of hostile takeover. At any point during the crowdsale anyone who donates more than the amount already raised will be able to control the whole pie and steal it. There are many strategies to prevent that, but implementing will be left as an exercise to the reader:

* Modify the crowdsale such that when a token is bought, also send the same quantity of tokens to the founder's account so that they always control 50% of the project
* Modify the Organization to create a veto power to some trusted third party that could stop any hostile proposal
* Modify the token to allow a central trusted party to freeze token accounts, so as to require a verification that there isn't any single entity controlling a majority of them

