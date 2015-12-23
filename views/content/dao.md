
## Decentralized Autonomous Organization

> **"On the Blockchain, no one knows you're a fridge"**
> - Richard Brown

So far, all contracts we listed were owned and executed by other accounts probably held by humans. But there is no discriminations against robots or humans on the Ethereum ecosystem and contracts can create arbitrary actions like any other account would. Contracts can own tokens, participate in crowdsales even be voting members of other contracts. 

On this section we are going to build a decentralized and democratic organization that exists solely on the blockchain, but that it can do anything that a simple account would be able to. The organization has a central manager that decides who are the members and the voting rules, but as we'll see, this can also be changed.

The way this particular democracy works is that it has an *Owner** which works like an administrator, CEO or a President. The *Owner* can add (or remove) voting members to the organization. Any member can make a proposal, which is in the form of an ethereum transaction to either send ether or execute some contract and other members can vote in support or against the proposal. Once a predetermined amount of time and a certain number of members has voted, the proposal can be executed: the contract counts the votes and if there are enough votes it will execute the given transaction.

### The Blockchain Congress

#### The code


    contract owned {
        address public owner;

        function owned() {
            owner = msg.sender;
        }

        modifier onlyOwner {
            if (msg.sender != owner) throw;
            _
        }

        function transferOwnership(address newOwner) onlyOwner {
            owner = newOwner;
        }
    }

    contract Congress is owned {

        /* Contract Variables and events */
        uint public minimumQuorum;
        uint public debatingPeriodInMinutes;
        int public majorityMargin;
        Proposal[] public proposals;
        uint public numProposals;
        mapping (address => bool) public isMember;
        mapping (uint => Member) public members;
        uint public numberOfMembers;


        event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
        event Voted(uint proposalID, bool position, address voter, string justification);
        event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
        event MembershipChanged(address member, bool isMember);
        event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, int majorityMargin);
        
        struct Member {
            address member;
            bool canVote;
            uint memberSince;
        }

        struct Proposal {
            address recipient;
            uint amount;
            string description;
            uint votingDeadline;
            bool executed;
            bool proposalPassed;
            uint numberOfVotes;
            int currentResult;
            bytes32 proposalHash;
            Vote[] votes;
            mapping (address => bool) voted;
        }

        struct Vote {
            bool inSupport;
            address voter;
            string justification;
        }
        
        /* modifier that allows only shareholders to vote and create new proposals */
        modifier onlyMembers {
            if (!isMember[msg.sender]) throw;
            _
        }
        
        /* First time setup */
        function Congress(uint minimumQuorumForProposals, uint minutesForDebate, int marginOfVotesForMajority, address congressLeader) {
            minimumQuorum = minimumQuorumForProposals;
            debatingPeriodInMinutes = minutesForDebate;
            majorityMargin = marginOfVotesForMajority;
            isMember[msg.sender] = true;
            if (congressLeader != 0) owner = congressLeader;
        }
        
        /*make member*/
        function changeMembership(address targetMember, bool canVote) onlyOwner {
            isMember[targetMember] = canVote;
            MembershipChanged(targetMember, canVote);
        }
        
        /*change rules*/
        function changeVotingRules(uint minimumQuorumForProposals, uint minutesForDebate, int marginOfVotesForMajority) onlyOwner {
            minimumQuorum = minimumQuorumForProposals;
            debatingPeriodInMinutes = minutesForDebate;
            majorityMargin = marginOfVotesForMajority;
            
            ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
        }

        /* Function to create a new proposal */
        function newProposal(address beneficiary, uint etherAmount, string JobDescription, bytes transactionBytecode) onlyMembers returns (uint proposalID) {
            proposalID = proposals.length++;
            Proposal p = proposals[proposalID];
            p.recipient = beneficiary;
            p.amount = etherAmount;
            p.description = JobDescription;
            p.proposalHash = sha3(beneficiary, etherAmount, transactionBytecode);
            p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
            p.executed = false;
            p.proposalPassed = false;
            p.numberOfVotes = 0;
            ProposalAdded(proposalID, beneficiary, etherAmount, JobDescription);
            numProposals = proposalID+1;
        }
        
        /* function to check if a proposal code matches */
        function checkProposalCode(uint proposalNumber, address beneficiary, uint etherAmount, bytes transactionBytecode) constant returns (bool codeChecksOut) {
            Proposal p = proposals[proposalNumber];
            return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
        }
        
        function vote(uint proposalNumber, bool supportsProposal, string justificationText) onlyMembers returns (uint voteID){
            Proposal p = proposals[proposalNumber];         // Get the proposal
            if (p.voted[msg.sender] == true) throw;         // If has already voted, cancel
            p.voted[msg.sender] = true;                     // Set this voter as having voted
            p.numberOfVotes++;                              // Increase the number of votes
            if (supportsProposal) {                         // If they support the proposal
                p.currentResult++;                          // Increase score
            } else {                                        // If they don't
                p.currentResult--;                          // Decrease the score
            }
            // Create a log of this event
            Voted(proposalNumber,  supportsProposal, msg.sender, justificationText);
        }

        function executeProposal(uint proposalNumber, bytes transactionBytecode) returns (int result) {
            Proposal p = proposals[proposalNumber];
            /* Check if the proposal can be executed */
            if (now < p.votingDeadline                                                  // has the voting deadline arrived?  
                || p.executed                                                           // has it been already executed? 
                || p.proposalHash != sha3(p.recipient, p.amount, transactionBytecode)   // Does the transaction code match the proposal? 
                || p.numberOfVotes <= minimumQuorum)                                    // has minimum quorum?
                throw;
            
            /* execute result */
            if (p.currentResult > majorityMargin) {     
                /* If difference between support and opposition is larger than margin */
                p.recipient.call.value(p.amount*1000000000000000000)(transactionBytecode);
                p.executed = true;
                p.proposalPassed = true;
            } else {
                p.executed = true;
                p.proposalPassed = false;
            } 
            // Fire Events
            ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
        }
    }


#### How to deploy 

Open the wallet (if you are only testing, go to the menu develop > network > testnet), go to the **contracts* tab and then press **deploy contract**, and on the **solidity code** box, paste the code above. On the contract picker, choose **Congress** and you'll see the setup variables.

* **Minimum quorum for proposals** is the minimum amount of votes a proposal needs to have before it can be executed.
* **Minutes for debate** is the minimum amount of time (in minutes) that needs to pass before it can be executed
* **Margin of votes for majority** A proposal passes if there are more than 50% of the votes plus the margin. Leave at 0 for simple majority, put it at the *number of members - 1* to require an absolute consensus.

![DAO Setup](/images/tutorial/dao-setup.png) 


You can change these parameters later, choose a name, 5 minutes for debate time and leave the remaining of them at 0. A little lower on the page you'll see an estimate cost of your contract in ether. You can try lowering the price if you want to save, but that might mean having to wait longer for your contract to be created. Click **Deploy**, type your password and wait.

In a few seconds you'll be taken to the dashboard, scroll down and you'll be able to see your transaction being created. In under a minute you'll see the transaction sucessful and a new unique icon will have been created. Click the contract's name to see it (you can get to it at any time on the *Contracts* tab).

![DAO Just created](/images/tutorial/dao-just-created.png) 


#### Sharing with others


If you want to share your DAO with others, then they need both the contract address and the interface file, a small text string that works as an instruction manual of the contract. Click **copy address** to get the former and **show interface** for the former.

On the other computer, go into the contracts tab and then click on **watch contract**. Add the correct address and interface and press **Ok**.

![Add Contract](/images/tutorial/add-contract.png)


#### Interacting with the contract


On the **"read from contract"** you can see all the functions you can execute for free on the contract, as they are just reading information from the blockchain. Here you can see, for instance, that the current "owner"  of the contract (that should be the account that uploaded the contract).  

On the **"Write to contract"** you have a list of all the functions that will attempt to do some computation that saves data to the blockchain, and therefore will cost ether. Select "newProposal" and it will show all the options options for that function.  

Before interacting with the contract, you'll need to add new members so they can vote. On the **select function** picker, choose **Change Membership**. Add the address of the person you want to make a member and check the box **can vote** (to remove a member, do the same but leave the box unticked). On **execute from** make sure that you have the same account that is set as the owner  as this is an action only the main administrator can execute. Press **execute** and wait a few seconds for the next block to go through with your change. 

There's no list of members, but you can check if anyone is a member by putting their address on the **Is a member** function, below **owner** on the *Read from contract* column.

Also, if you want the contract to have any money of its own, you need to deposit some ether (or other token) into it, otherwise you'll have a pretty toothless organization. Press **Deposit** on the top left corner.

#### Add a simple proposal: send ether

Now let's add the first proposal to the contract. On the function picker, select **New proposal**.

For "beneficiary" add the address of someone you want to send ether to, then put how many ethers you want on the "etherAmount" (must be an integer) and finally some text describing the reason you want to do this. Leave transactionByteCode blank for now. Click execute and type your password. After a few seconds the numProposals will increase to 1 and the first proposal, number 0, will appear on the left column. As you add more proposals, you can see any of them by simply putting the proposal number on the "proposals" field and you can read all about it.  

Voting on a proposal is also very simple. Choose "vote" on the function picker. Type the proposal Number on the first box and check the "Yes" box if you agree with it (or leave it blank to vote against it). Click "**execute**" to send your vote.  

![Add new proposal](/images/tutorial/dao-add-proposal.png)


When the voting time has passed, you can select **"executeProposal"**. If the proposal was simply sending ether, then you can also leave the "**transactionBytecode**" field blank. After pressing "execute" but before typing your password, pay attention to the screen that appears. 

**If there is a warning on the "estimated fee consumption" field, then this means that for some reason the function called will not execute and will be abruptly terminated. It can mean many things, but in the context of this contract this warning will show up whenever you try to execute a contract before its deadline has passed, or if the user is trying to send a different bytecode data than the original proposal had. For security reasons if any of these things happens, the contract execution is abruptly terminated and the user that attempted the illegal transaction will lose the all the ether he sent to pay transaction fees.**

If the transaction was executed, then after a few seconds you should be able the result: **executed** will turn to true and the correct amount of ether should be subtracted from this contract's balance and into the recipient address. 

#### Add a complex proposal: own another token

You can use this democracy to execute any transaction on ethereum, as long as you can figure out the bytecode that that transaction generates. Luckily for us, you can use the wallet to do precisely that!

In this example, we'll use a token to show that this contract can hold more than ether and can do transactions in any other ethereum-based asset. First, [create a token](./token/) that belongs to one your normal accounts. On the contract page, click deposit some of them to your new congress contract (for simplicity, don't send more than half your coins to your DAO). After than we are going to simulate the action you want to execute. So if you want to propose that the DAO send 500mg of a gold token to a person as a payment, then follow the steps that you'd do to execute that transaction from an account you own and press "send" but when the confirmation screens pops up, **don't type your password**.


![Select the bytecode](/images/tutorial/select-code.png)

Instead, copy the code displayed on the "data" field and save it to a text file or notepad. Cancel the transaction. You'll also need the address of the contract you'll be calling for that operation, in this case the token contract. You can find it on the contracts tab: save that somewhere too.

Now go back to your DAO contract and add a new proposal. In the **beneficiary** field, add the address of the token contract , leave **ether amount** as 0, a good description to the **Job description** and finally add the data code you've saved to the **transaction bytecode**.


Now go back to the democracy contract and create a new proposal with these parameters:

*   As the **beneficiary**, put the address of your token (pay attention if it's the same icon)
*   Leave **Ether amount** blank
*   On the **Job description** just write a small description on what you want to accomplish
*   On the **Transaction Bytecode**, paste the bytecode you saved from the data field on the previous step

![New proposal](/images/tutorial/new-proposal-token.png)

In a few seconds you should be able to see that the details on the proposal. You'll notice that the transaction bytecode won't be shown there and instead there's only a "transaction hash". Unlike the other fields, Bytecode can be extremely very and therefore expensive to store on the blockchain, so instead of archiving it, the person executing the call later will provide the bytecode.  

But that of course creates a security hole: how can a proposal be voted without the actual code being there? And what prevents a user from executing a different code after the proposal has been voted on? That's where transaction hash comes in. Scroll a bit on the "read from contract" function list and you'll see a proposal checker function, where anyone can put all the function parameters and check if they match the one being voted on. This also guarantees that proposals don't get executed unless the hash of the bytecode matches exactly the one on the provided code.  

[caption id="attachment_2335" align="aligncenter" width="500"][![It's an older code, but it checks out](/images/tutorial/check-code.png)](/images/tutorial/check-code.png) [It's an older code, but it checks out](https://www.youtube.com/watch?v=4HJ-Y8YTo8Q)[/caption]

Anyone can actually check the proposal very easily by following the same steps to get the correct bytecode and then adding the proposal number and other parameters to the function called **Check proposal code** on the bottom of **Read from contract**.

The rest of the voting process remains the same: all members can vote and after the deadline, someone can execute the proposal. The only difference is that this time you'll have to provide the same bytecode you've submitted before. Pay attention to any warnings on the confirmation window: if it says it won't execute your code, check to see if the deadline has already passed, if there are enough votes and if your transaction bytecode checks out.

#### Make it better

Here are some drawbacks of this current DAO that we leave as an exercise to the reader:

* Can you make the member list public and indexed?
* Can you allow members to change their votes (after votes are cast but before the votes are tallied up)?
* Currently the vote message is only visible on logs, can you make a function that will display all votes?


### The Stakeholder Association

In the previous section we created a contract that works like an invitation-only club, where members are invited or banned by the whim of the president. But this has a few drawbacks: what if someone wants to change his main address? What if some members have more weight than others? What if you actually want to trade or sell memberships or shares on an open market? What if you wanted your organization to have work as a constant decision machine by stakeholders?

We are going to modify a bit our contract to connect it to a specific token, which will work as the holding shares of the contract. First we need to create this token: go to the [token tutorial](./token) and create a simple token with **initial supply** of 100, **decimals** of 0 and a percentage sign (%) as a **symbol**. If you want to be able to trade in fractions of a percent, then increase the supply by 100x or 1000x and then add the corresponding amount of zeros as the **decimals**. Deploy this contract and save its address on a text file.

Now to the shareholder code:



    /* The token is used as a voting shares */
    contract token { mapping (address => uint256) public balanceOf;  }

    /* define 'owned' */
    contract owned {
        address public owner;

        function owned() {
            owner = msg.sender;
        }

        modifier onlyOwner {
            if (msg.sender != owner) throw;
            _
        }

        function transferOwnership(address newOwner) onlyOwner {
            owner = newOwner;
        }
    }

    /* The democracy contract itself */
    contract Association is owned {

        /* Contract Variables and events */
        uint public minimumQuorum;
        uint public debatingPeriodInMinutes;
        Proposal[] public proposals;
        uint public numProposals;
        token public sharesTokenAddress;

        event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
        event Voted(uint proposalID, bool position, address voter);
        event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
        event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, address sharesTokenAddress);

        struct Proposal {
            address recipient;
            uint amount;
            string description;
            uint votingDeadline;
            bool executed;
            bool proposalPassed;
            uint numberOfVotes;
            bytes32 proposalHash;
            Vote[] votes;
            mapping (address => bool) voted;
        }

        struct Vote {
            bool inSupport;
            address voter;
        }
        
        /* modifier that allows only shareholders to vote and create new proposals */
        modifier onlyShareholders {
            if (sharesTokenAddress.balanceOf(msg.sender) == 0) throw;
            _
        }
        
        /* First time setup */
        function Association(token sharesAddress, uint minimumSharesForVoting, uint minutesForDebate) {
            sharesTokenAddress = token(sharesAddress);
            if (minimumSharesForVoting == 0 ) minimumSharesForVoting = 1;
            minimumQuorum = minimumSharesForVoting;
            debatingPeriodInMinutes = minutesForDebate;
        }

        /*change rules*/
        function changeVotingRules(token sharesAddress, uint minimumSharesForVoting, uint minutesForDebate) onlyOwner {
            sharesTokenAddress = token(sharesAddress);
            minimumQuorum = minimumSharesForVoting;
            debatingPeriodInMinutes = minutesForDebate;
            ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, sharesTokenAddress);
        }

        /* Function to create a new proposal */
        function newProposal(address beneficiary, uint etherAmount, string JobDescription, bytes transactionBytecode) onlyShareholders returns (uint proposalID) {
            proposalID = proposals.length++;
            Proposal p = proposals[proposalID];
            p.recipient = beneficiary;
            p.amount = etherAmount;
            p.description = JobDescription;
            p.proposalHash = sha3(beneficiary, etherAmount, transactionBytecode);
            p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
            p.executed = false;
            p.proposalPassed = false;
            p.numberOfVotes = 0;
            ProposalAdded(proposalID, beneficiary, etherAmount, JobDescription);
            numProposals = proposalID+1;
        }
        
        /* function to check if a proposal code matches */
        function checkProposalCode(uint proposalNumber, address beneficiary, uint etherAmount, bytes transactionBytecode) constant returns (bool codeChecksOut) {
            Proposal p = proposals[proposalNumber];
            return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
        }
        
        /* */
        function vote(uint proposalNumber, bool supportsProposal) onlyShareholders returns (uint voteID){
            Proposal p = proposals[proposalNumber];
            if (p.voted[msg.sender] == true) throw;
            
            voteID = p.votes.length++;
            p.votes[voteID] = Vote({inSupport: supportsProposal, voter: msg.sender});
            p.voted[msg.sender] = true;
            p.numberOfVotes = voteID +1;
            Voted(proposalNumber,  supportsProposal, msg.sender);
        }
        
        function executeProposal(uint proposalNumber, bytes transactionBytecode) returns (int result) {
            Proposal p = proposals[proposalNumber];
            /* Check if the proposal can be executed */
            if (now < p.votingDeadline  /* has the voting deadline arrived? */ 
                ||  p.executed        /* has it been already executed? */
                ||  p.proposalHash != sha3(p.recipient, p.amount, transactionBytecode)) /* Does the transaction code match the proposal? */
                throw;

            /* tally the votes */
            uint quorum = 0;
            uint yea = 0; 
            uint nay = 0;
            
            for (uint i = 0; i <  p.votes.length; ++i) {
                Vote v = p.votes[i];
                uint voteWeight = sharesTokenAddress.balanceOf(v.voter); 
                quorum += voteWeight;
                if (v.inSupport) {
                    yea += voteWeight;
                } else {
                    nay += voteWeight;
                }
            }
            
            /* execute result */
            if (quorum <= minimumQuorum) {
                /* Not enough significant voters */
                throw;
            } else if (yea > nay ) {
                /* has quorum and was approved */
                p.recipient.call.value(p.amount*1000000000000000000)(transactionBytecode);
                p.executed = true;
                p.proposalPassed = true;
            } else {
                p.executed = true;
                p.proposalPassed = false;
            } 
            // Fire Events
            ProposalTallied(proposalNumber, result, quorum, p.proposalPassed);
        }
    }


#### Deploy and usage

The code is deployed almost exactly like the previous code, but you need to also put a **shares token address** which is the address of the token that will work as a share with voting rights.

Notice these lines of codes: first we describe the token contract to our new contract. Since it only uses the **balanceOf** function, we only need to add that single line.
 
    contract token { mapping (address => uint256) public balanceOf;  }
 
Then we define a variable of the *type* token, meaning that it will inherit all the functions we described earlier. Finally we point the token variable to an address on the blockchain, so it can use that and request live information. This is the simplest way to make one contract understand the other in ethereum.

    contract Association {
        token public sharesTokenAddress;
    ...
    function Association(token sharesAddress, uint minimumSharesForVoting, uint minutesForDebate) {
            sharesTokenAddress = token(sharesAddress);

This association presents a challenge that the previous congress didn't had: since anyone with tokens can vote and the balances can change very quickly, the actual score of the proposal can't be counted when the shareholder votes, otherwise someone would be able to vote multiple times by simply sending his share to different addresses. So in this contract only the vote position is recorded and then the real score is tallied up on the **execute proposal** phase.       

    /* tally the votes */
    uint quorum = 0;
    uint yea = 0; 
    uint nay = 0;

    for (uint i = 0; i <  p.votes.length; ++i) {
        Vote v = p.votes[i];
        uint voteWeight = sharesTokenAddress.balanceOf(v.voter); 
        quorum += voteWeight;
        if (v.inSupport) {
            yea += voteWeight;
        } else {
            nay += voteWeight;
        }
    }

Another way to achieve the same goal would to create the a single signed integer to keep score of the votes and check if it was positive or negative on the end, but you'd have to convert the *unsigned integer* balanceOf into a *signed integer* using **int score = int(voteWeight);**

Using this DAO is exactly like the previous: members create new proposals, vote on them, wait until the deadline passes and then anyone can count the votes and execute it.

![Association example](/images/tutorial/association-dao.png)



### But how can I limit the owner's power?

On this contract the address set as **owner** has some special powers: they can add or ban members at will, change the margin needed for a win, alter the time required for debate and the quorum necessary for the vote to pass. But this can be solved by using yet another power the owner has: to change ownership.

The owner could change the ownership to no one by pointing the new owner as *0x00000...*. This would guarantee that the rules will never change, but it's an irreversible action. The owner can also change the ownership to the contract itself: just click on "copy address" and add it on the "new owner" field. This would make that all the powers of the owner could be executed by creating proposals.

If you want, you can also set one contract as the owner of the other: suppose you wanted a corporate structure where you wanted a President for life that had the power to appoint board members, which could then issue more shares and finally these shares voted on how to spend a budget. You could create that an **Association** contract, that used a **[mintable token](./token)** owned by a **congress** finally owned by a single account.

But what if you wanted different rules for voting? Maybe to change voting rules you'd need a 80% consensus, or maybe the members are different. In that case, you can create another identical DAO or use some other source code and plug that one as the owner of the first.





### Liquid democracy

Voting on all expenses and actions of a contract takes time and requires users to be constantly active, informed and attentive. Another interesting approach is to elect an apointed account that will have control over a contract and then be able to take swift decisions over it.
 
We are going to implement what's called a version of what's usually called **Liquid Democracy**, which is a more flexible delegative democracy. In this kind of democracy, any voter can be a potential delegate: instead of voting the candidate you want, you just say which voter you trust to handle this decision for you. Your voting weight is delegated to them and they can in turn delegate it to another voter they trust and so on. The end result should be that the most voted account is one that has trust connections to the largest amount of voters.


#### The code

    contract token { mapping (address => uint256) public balanceOf;  }

    contract LiquidDemocracy {
        token public votingToken;
        address public appointee;
        mapping (address => uint) public voterId;
        uint public numberOfVotes;
        DelegatedVote[] public delegatedVotes;

        event NewAppointee(address newAppointee, bool changed);
        
        struct DelegatedVote {
            address nominee;
            address voter;
        }
            
        function LiquidDemocracy(address votingWeightToken) {
            votingToken = token(votingWeightToken); 
            delegatedVotes.length++;
            delegatedVotes[0] = DelegatedVote({nominee: 0, voter: 0});
        }

        function execute(address target, uint valueInWei, bytes32 bytecode){
            if (msg.sender != appointee) throw;          // If caller is the current appointee,
            target.call.value(valueInWei)(bytecode);     // Then execute the command.
        }
        
        function vote(address nominatedAddress)  returns (uint voteIndex) {
            if (voterId[msg.sender]== 0) {
                voterId[msg.sender] = delegatedVotes.length;
                numberOfVotes++;
                voteIndex = delegatedVotes.length++;
                numberOfVotes = voteIndex;
            } else {
                voteIndex = voterId[msg.sender];
            }
            
            delegatedVotes[voteIndex] = DelegatedVote({nominee: nominatedAddress, voter: msg.sender});
        }         
        
        function calculateAppointee(uint extraRoundsOfDelegation) returns (address winner){

            mapping (address => uint) temporaryWeight;
            address currentWinner = appointee;
            uint currentMax = 0;
            uint weight = 0;
            DelegatedVote v = delegatedVotes[0];

            // First, distribute the initial weight
            for (uint i=1; i< delegatedVotes.length; i++){
                v = delegatedVotes[i];
                temporaryWeight[v.nominee] += votingToken.balanceOf(v.voter);
            }
            
            // then pass multiple times to calculate the final weight
            for (uint n=0; n < extraRoundsOfDelegation+3; n++){
                for (i=1; i< delegatedVotes.length; i++){
                    v = delegatedVotes[i];                  
                    weight = temporaryWeight[v.voter];                  
                    temporaryWeight[v.voter] = 0;
                    temporaryWeight[v.nominee] += weight;
                }  
            }
            
            // finally calculate the winner
            for (i=1; i< delegatedVotes.length; i++){
                v = delegatedVotes[i];
                if (temporaryWeight[v.nominee] > currentMax) {
                    currentWinner = v.nominee;
                    currentMax = temporaryWeight[v.nominee];
                }
            }
            
            // set the winner and log
            NewAppointee(currentWinner, appointee == currentWinner);
            appointee = currentWinner;
            return currentWinner;
        }
    }


#### Highlights 

The most important piece of code is the **execute** contract. It can only be called by the contract or account elected as the **appointee* for this contract. That person or software can execute any command in the name of the Liquid Democracy contract, so if you use this contract as the **owner** of another contract, the appointee will be, indirectly, the temporary owner of that contract.

    function execute(address target, bytes32 bytecode){
            if (msg.sender != appointee) throw;          // If caller is the current appointee,
            target.call.value(msg.value)(bytecode);     // Then execute the command.
        }


#### How to use it

First, you need a token. If you have followed the **Stakeholder association** tutorial above, you can use the same token as you had previously, otherwise just [deploy a new token](./token/) and distribute it among some accounts. Copy the token address.

Now deploy the democracy contract, and make sure that you put the token address on the **Voting weight token**. Now deploy the Liquid democracy and go to its page. First have any of the stakeholders **vote** on who they would trust to make decisions on behalf of this contract. You can vote on yourself if you want to be the final decision maker, or on the zero address, if you'd rather have no one representing you on that role. If the person you apointed apoints someone else, then your vote will be redirected to that final person and so on, until it either reaches someone who didn't vote or that voted on themselves.

When enough people have voted execute the **Calculate appointee**. Anyone can run that contract anytime and it will recalculate who is the current most trusted person on the network. They will then be set as the **appointee** of the contract. 

The appointee is the only account that can use the **execute** function of the contract, this is very important role as the execute function will allow the contract to do anything in the name of the contract: move ether, move tokens, execute other contracts. The only thing the appointee cannot do is change the nature of the democracy itself: at any point if he loses support he will be immediately dismissed from the post of appointee.

As an example of what that can do: create a [Mintable Token](./token/) and set the address of the **liquid democracy** as the issuer of the token. Now go to the mintable token page and use any account to follow the steps as if you were going to create new tokens, but stop on the confirmation window. Instead of typing your password, instead save the **Bytecode** on a separate text file, together with the address of the Mintable Token. Now go back to the Liquid Democracy and choose **execute**: set the **target** as the mint address, leave value at 0 and put the bytecode you just copied on the **bytecode** field. If  you are not the appointee then the transaction will immediatly halt and you'll lose your fee, but if are calling that transaction from the appointee account then it should execute as if the democracy was requesting the function from the mint. [Use this power responsibly](https://www.youtube.com/watch?v=b23wrRfy7SM).  

**Warning** In some contracts, like the Congress and the Association above, one of the powers of the **owner** is to execute a function called **change ownership**. If you set the **liquid democracy** as the owner of one of these contracts, you should remove that function, or limit it in some other way, otherwise the **apointee** will be able to change ownership of that contract from the democracy to themselves, executing a coup that will render the apointee position irrelevant. 


### Approval Election



----




[Creating a token is fun](https://blog.ethereum.org/2015/12/03/how-to-build-your-own-cryptocurrency/), but what is the value of a token that doesn't do anything new? We are now going to create a new contract that uses the tokens we just created. The contract will be a Democratic organization that lives on the blockchain and that anyone holding a share token will be able to vote on proposals.  

So let's go back to "**Contracts**" and then "**Deploy Contract**" and paste the [DAO source code](http://chriseth.github.io/browser-solidity/?gist=192371538cf5e43e6dab) on the **"Solidity Source"** field. Choose the contract "Democracy" on the Picker and then select these parameters:  

*   On the **amount** field you can add any ether amount you want your DAO to start with. Since you can send ether to it at any time in the future, if this is the first time you've been doing this then keep the amount at 0 and send the money later.
*   On the **sharesAddress** field, paste the address of the token contract you just created. Pay attention to the icon and color of the little circle that appears by the side of the address. If it doesn’t match exactly the one for the contract you created previously, then there's an error.
*   On **minimumSharesForVoting** pick what is the minimum quorum of shareholders that need to vote on an issue before it passes. Here you must put the integer number of the minimum token possible, so if you created a token with 2 decimal places, putting 500 here will mean that in order for a proposal to be executed then the number of votes must be more than 5% of the total shares of the company.
*   **minutesForDebating: **this is the minimum time a proposal must be discussed and voted on before the results can be tallied up. Put a small number like 10 minutes if you want just to create something for testing, but put something like 20,000 if you want to store large amounts of ether, so all proposals must stay there for at least two weeks.

Your contract should be looking something like this:  

**[![Ethereum Wallet Screenshot 2015-12-03 at 3.50.36 PM 16](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-16.png)](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-16.png)**  

After a few seconds you'll be redirected to a the dashboard where you'll see your new contract being created:  

**[![Ethereum Wallet Screenshot 2015-12-03 at 3.50.36 PM 13](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-13.png)](/images/tutorial/Ethereum-Wallet-Screenshot-2015-12-03-at-3.50.36-PM-13.png)**  


**[![Ethereum Wallet Screen Shot 2015-12-03 at 9.57.34 AM](/images/tutorial/Screen-Shot-2015-12-03-at-9.57.34-AM.png)](/images/tutorial/Screen-Shot-2015-12-03-at-9.57.34-AM.png)**  



**[![Ethereum Wallet Screen Shot 2015-12-01 at 6.10.32 PM](/images/tutorial/Screen-Shot-2015-12-01-at-6.10.32-PM.png)](/images/tutorial/Screen-Shot-2015-12-01-at-6.10.32-PM.png)**  



[![Screen Shot 2015-12-01 at 6.18.22 PM](/images/tutorial/Screen-Shot-2015-12-01-at-6.18.22-PM.png)](/images/tutorial/Screen-Shot-2015-12-01-at-6.18.22-PM.png)  


**[![Ethereum Wallet Screen Shot 2015-12-01 at 6.21.30 PM](/images/tutorial/Screen-Shot-2015-12-01-at-6.21.30-PM.png)](/images/tutorial/Screen-Shot-2015-12-01-at-6.21.30-PM.png)**  

If everything went well you should be able to see the results of the vote in a few seconds. The "**openToVote**" parameter on the first box will turn to false while the **proposalPassed** will reflect if the proposal has been accepted or not. You should also be able to see that the Ether balance of the contract will go down and the equivalent ether will be sent to the beneficiary of the ether you wanted to send.  

Now take a moment to let that in: you just created an organization that only exists on the blockchain, that obeys votes based on completely digital tokens, but yet it can move real value around and create a very real impact on the world. Also notice that the organization is not under your control anymore: it will execute only the exact code you used to create it, forever. You can't bribe it, you can't earmark it and the same rules apply either you are moving 0.01 or 1,000,000 ethers.  

Can it get any better than this? Actually, it can. [On our next post we will explore how you can use "transactionBytecode" to allow the DAO to execute any kind of ethereum transaction](https://blog.ethereum.org/2015/12/07/ethereum-in-practice-part-3-how-to-build-your-own-transparent-bank-on-the-blockchain/), even owning or creating other contracts. We'll also modify the token code to allow the DAO to control the amount of a token that exists on circulation and how to send it forward.


----




We are going to modify the token contract to allow it to be minted by your DAO. So save the address of your current DAO in a note pad (pay attention to the icon) and [grab this source code](http://chriseth.github.io/browser-solidity/?gist=1e8ebf35ff1fd48aca46) and you know the drill: **contracts > deploy new contract > solidity source code > pick contract**  

You can fill the parameters any way you want (yes, emojis are permitted on the string fields) but you'll notice one new field that didn't exist before: Central Minter. Here add the address of your newly created democracy contract.  

[![Ethereum Wallet 2015-12-01 at 7.09.11 PM](/images/tutorial/Screen-Shot-2015-12-01-at-7.09.11-PM.png)](/images/tutorial/Screen-Shot-2015-12-01-at-7.09.11-PM.png)  

Click Deploy and let's wait for the transaction to be picked up. After it has at least two confirmations, go to your democracy contract and you'll notice that now it owns a million of your new coins. Now if you go to the Contracts tab you'll see that there is a new **DAO dollar (admin page)** contract on your collection.  

Select the "mintToken" function to your right and then put any address you own as the "target", and then the amount of new mints you want to create from thin air in their account. Press "**execute**" but **don't press send**! You'll notice that there is a warning saying that the transaction can't be executed. This happens because only the **Minter** (which is currently set to the DAO address) can call that function and you are calling it with your main account. But the calling code is the same, which is why you can simply copy it.  

Instead, **copy the contract execution code from the "data" field** and put it aside on a notepad. Also get the address of your new "Mint" contract and save it somewhere.  

[![Ethereum Wallet Screen-Shot-2015-12-01-at-7.17.06-PM](/images/tutorial/Screen-Shot-2015-12-01-at-7.17.06-PM.png)](/images/tutorial/Screen-Shot-2015-12-01-at-7.17.06-PM.png)  


Now everyone can vote on the proposal and after the voting period has passed, anyone with the correct bytecode can ask the votes to be tallied up and the contract to be executed. If the proposal has enough support then the newly minted coins should appear on Alice's account, as if it was a transfer from address Zero.  

[caption id="attachment_2336" align="aligncenter" width="2322"][![Why a transfer from code zero? Because it says so on the code. You can change that as you will](/images/tutorial/Screen-Shot-2015-12-02-at-12.02.43-PM.png)](/images/tutorial/Screen-Shot-2015-12-02-at-12.02.43-PM.png) Why a transfer from address zero? Because doing the opposite, sending a coin to 0x00 is a way to effectively destroy it, but more importantly, because it says so on the contract code. You can change that as you prefer.[/caption]  

And now you have a central minter contract that exists solely on the blockchain, completelly fraud-proof as all their activities are logged transparently. The mint can also take coins from circulation by simply sending the coins it has to address Zero, or by freezing the funds on any account, but it's **mathematically impossible** for the Mint to do any of those actions or generate more coins without the support of enough shareholders of the mint.  

Possible uses of this DAO:

*   The creation of a universal stable crypto currency. By controlling the total amount of coins in circulation the Mint shareholders can attempt to create an asset whose value doesn't fluctuate too wildly.
*   Issuance of certificates of backed assets: the coins can represent an external currency or items that the Mint owns and can prove to it's shareholders and token holders. When the Mint acquires or sells more of these assets it can burn or generate more assets to guarantee that their digital inventory will always match their real counterpart
*   Digitally backed assets. The Mint can hold ether or other ethereum based digital currencies and use that to back the value of the currencies circulating

## Improvements Suggestions

There are multiple ways that this structure can be yet improved, but we will leave it as an exercise and challenge to the reader:

1.  Right now votes are made by shareholders based on freely tradable tokens. Can instead membership be based on invitation, each member getting a single vote (or maybe use [quadratic voting](http://ericposner.com/quadratic-voting/) or [liquid democracy](https://en.wikipedia.org/wiki/Delegative_democracy))?
2.  What about other voting mechanisms? Maybe the vote instead of being a boolean could be a more flexible arrangement: you could vote to postpone the decision, or you can make a vote that is neutral but still count to the quorum
3.  Currently all proposals have the same debating period. Can you make that proportional to the value transfer being proposed? How would you calculate that to tokens?
4.  Can you create a better token that can be automatically created by sending ether into it, which can then be retrieved by burning the token, at a fluctuating market price?
5.  What else can the DAO own or do, besides tokens?




-----

# Democracy DAO



So far you have created a tradeable token and you successfully distributed it among all those who were willing to help fundraise a 100 ethers. That's all very interesting but what exactly are those tokens for?  Why would anyone want to own or trade it for anything else valuable? If you can convince your new token is the next big money maybe others will want it, but so far your token offers no value per se. We are going to change that, by creating your first decentralized autonomous organization, or DAO.

Think of the DAO as the constitution of a country, the executive branch of a government or maybe like a  robotic manager for an organization. The DAO receives the money that your organization raises, keeps it safe and uses it to fund whatever its members want. The robot is incorruptible, will never defraud the bank, never create secret plans, never use the money for anything other than what its constituents voted on. The DAO will never disappear, never run away and cannot be controlled by anyone other than its own citizens.

The token we distributed using the crowdsale is the only citizen document needed. Anyone who holds any token is able to create and vote on proposals. Similar to being a shareholder in a company, the token can be traded on the open market and the vote is proportional to amounts of tokens the voter holds.  

Take a moment to dream about the revolutionary possibilities this would allow, and now you can do it yourself, in under a 100 lines of code:


### The Code

    


    contract token { mapping (address => uint) public coinBalanceOf;   function token() { }   function sendCoin(address receiver, uint amount) returns(bool sufficient) {  } }


    contract Democracy {
    
        uint public minimumQuorum;
        uint public debatingPeriod;
        token public voterShare;
        address public founder;
        Proposal[] public proposals;
        uint public numProposals;
        
        event ProposalAdded(uint proposalID, address recipient, uint amount, bytes32 data, string description);
        event Voted(uint proposalID, int position, address voter);
        event ProposalTallied(uint proposalID, int result, uint quorum, bool active);

        struct Proposal {
            address recipient;
            uint amount;
            bytes32 data;
            string description;
            uint creationDate;
            bool active;
            Vote[] votes;
            mapping (address => bool) voted;
        }
        
        struct Vote {
            int position;
            address voter;
        }
        
        function Democracy(token _voterShareAddress, uint _minimumQuorum, uint _debatingPeriod) {
            founder = msg.sender;  
            voterShare = token(_voterShareAddress);
            minimumQuorum = _minimumQuorum || 10;
            debatingPeriod = _debatingPeriod * 1 minutes || 30 days;
        }
    
        
        function newProposal(address _recipient, uint _amount, bytes32 _data, string _description) returns (uint proposalID) {
            if (voterShare.coinBalanceOf(msg.sender)>0) {
                proposalID = proposals.length++;
                Proposal p = proposals[proposalID];
                p.recipient = _recipient;
                p.amount = _amount;
                p.data = _data;
                p.description = _description;
                p.creationDate = now;
                p.active = true;
                ProposalAdded(proposalID, _recipient, _amount, _data, _description);
                numProposals = proposalID+1;
            }
        }
        
        function vote(uint _proposalID, int _position) returns (uint voteID){
            if (voterShare.coinBalanceOf(msg.sender)>0 && (_position >= -1 || _position <= 1 )) {
                Proposal p = proposals[_proposalID];
                if (p.voted[msg.sender] == true) return;
                voteID = p.votes.length++;
                p.votes[voteID] = Vote({position: _position, voter: msg.sender});
                p.voted[msg.sender] = true;
                Voted(_proposalID,  _position, msg.sender);
            }
        }
        
        function executeProposal(uint _proposalID) returns (int result) {
            Proposal p = proposals[_proposalID];
            /* Check if debating period is over */
            if (now > (p.creationDate + debatingPeriod) && p.active){   
                uint quorum = 0;
                /* tally the votes */
                for (uint i = 0; i <  p.votes.length; ++i) {
                    Vote v = p.votes[i];
                    uint voteWeight = voterShare.coinBalanceOf(v.voter); 
                    quorum += voteWeight;
                    result += int(voteWeight) * v.position;
                }
                /* execute result */
                if (quorum > minimumQuorum && result > 0 ) {
                    p.recipient.call.value(p.amount)(p.data);
                    p.active = false;
                } else if (quorum > minimumQuorum && result < 0) {
                    p.active = false;
                }
                ProposalTallied(_proposalID, result, quorum, p.active);
            }
        }
    }





There's a lot of going on but it's simpler than it looks. The rules of your organization are very simple: anyone with at least one token can create proposals to send funds from the country's account. After a week of debate and votes, if it has received votes worth a total of 100 tokens or more and has more approvals than rejections, the funds will be sent. If the quorum hasn't been met or it ends on a tie, then voting is kept until it's resolved. Otherwise, the proposal is locked and kept for historical purposes.

So let's recap what this means: in the last two sections you created 10,000 tokens, sent 1,000 of those to another account you control, 2,000 to a friend named Alice and distributed 5,000 of them via a crowdsale.  This means that you no longer control over 50% of the votes in the DAO, and if Alice and the community bands together, they can outvote any spending decision on the 100 ethers raised so far. This is exactly how a democracy should work. If you don't want to be a part of your country anymore the only thing you can do is sell your own tokens on a decentralized exchange and opt out, but you cannot prevent the others from doing so.


### Set Up your Organization

So open your console and let's get ready to finally put your country online. First, let's set the right parameters, pick them with care:

    var _voterShareAddress = token.address;
    var _minimumQuorum = 10; // Minimum amount of voter tokens the proposal needs to pass
    var _debatingPeriod = 60; // debating period, in minutes;

With these default parameters anyone with any tokens can make a proposal on how to spend the organization's money. The proposal has 1 hour to be debated and it will pass if it has at least votes from at least 0.1% of the total tokens and has more support than rejections. Pick those parameters with care, as you won't be able to change them in the future.
    
    var daoCompiled = eth.compile.solidity('contract token { mapping (address => uint) public coinBalanceOf; function token() { } function sendCoin(address receiver, uint amount) returns(bool sufficient) { } } contract Democracy { uint public minimumQuorum; uint public debatingPeriod; token public voterShare; address public founder; Proposal[] public proposals; uint public numProposals; event ProposalAdded(uint proposalID, address recipient, uint amount, bytes32 data, string description); event Voted(uint proposalID, int position, address voter); event ProposalTallied(uint proposalID, int result, uint quorum, bool active); struct Proposal { address recipient; uint amount; bytes32 data; string description; uint creationDate; bool active; Vote[] votes; mapping (address => bool) voted; } struct Vote { int position; address voter; } function Democracy(token _voterShareAddress, uint _minimumQuorum, uint _debatingPeriod) { founder = msg.sender; voterShare = token(_voterShareAddress); minimumQuorum = _minimumQuorum || 10; debatingPeriod = _debatingPeriod * 1 minutes || 30 days; } function newProposal(address _recipient, uint _amount, bytes32 _data, string _description) returns (uint proposalID) { if (voterShare.coinBalanceOf(msg.sender)>0) { proposalID = proposals.length++; Proposal p = proposals[proposalID]; p.recipient = _recipient; p.amount = _amount; p.data = _data; p.description = _description; p.creationDate = now; p.active = true; ProposalAdded(proposalID, _recipient, _amount, _data, _description); numProposals = proposalID+1; } else { return 0; } } function vote(uint _proposalID, int _position) returns (uint voteID){ if (voterShare.coinBalanceOf(msg.sender)>0 && (_position >= -1 || _position <= 1 )) { Proposal p = proposals[_proposalID]; if (p.voted[msg.sender] == true) return; voteID = p.votes.length++; Vote v = p.votes[voteID]; v.position = _position; v.voter = msg.sender; p.voted[msg.sender] = true; Voted(_proposalID, _position, msg.sender); } else { return 0; } } function executeProposal(uint _proposalID) returns (int result) { Proposal p = proposals[_proposalID]; /* Check if debating period is over */ if (now > (p.creationDate + debatingPeriod) && p.active){ uint quorum = 0; /* tally the votes */ for (uint i = 0; i < p.votes.length; ++i) { Vote v = p.votes[i]; uint voteWeight = voterShare.coinBalanceOf(v.voter); quorum += voteWeight; result += int(voteWeight) * v.position; } /* execute result */ if (quorum > minimumQuorum && result > 0 ) { p.recipient.call.value(p.amount)(p.data); p.active = false; } else if (quorum > minimumQuorum && result < 0) { p.active = false; } } ProposalTallied(_proposalID, result, quorum, p.active); } }');

    var democracyContract = web3.eth.contract(daoCompiled.Democracy.info.abiDefinition);
    
    var democracy = democracyContract.new(
      _voterShareAddress, 
      _minimumQuorum, 
      _debatingPeriod, 
      {
        from:web3.eth.accounts[0], 
        data:daoCompiled.Democracy.code, 
        gas: 3000000
      }, function(e, contract){
        if(!e) {

          if(!contract.address) {
            console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

          } else {
            console.log("Contract mined! Address: " + contract.address);
            console.log(contract);
          }

        }
    });

**If you are using the _online compiler_ Copy the contract code to the [online solidity compiler](https://chriseth.github.io/browser-solidity/), and then grab the content of the box labeled **Geth Deploy**. Since you have already set the parameters, you don't need to change anything to that text, simply paste the resulting text on your geth window.**

Wait a minute until the miners pick it up. It will cost you about 850k Gas. Once that is picked up, it's time to instantiate it and set it up, by pointing it to the correct address of the token contract you created previously. 

If everything worked out, you can take a look at the whole organization by executing this string:

    "This organization has " +  democracy.numProposals() + " proposals and uses the token at the address " + democracy.voterShare() ;

If everything is setup then your DAO should return a proposal count of 0 and an address marked as the "founder". While there are still no proposals, the founder of the DAO can change the address of the token to anything it wants. 

### Register your organization name

Let's also register a name for your contract so it's easily accessible (don't forget to check your name availability with registrar.addr("nameYouWant") before reserving!)

    var name = "MyPersonalDemocracy"
    registrar.reserve.sendTransaction(name, {from: eth.accounts[0]})
    var democracy = eth.contract(daoCompiled.Democracy.info.abiDefinition).at(democracy.address);
    democracy.setup.sendTransaction(registrar.addr("MyFirstCoin"),{from:eth.accounts[0]})

Wait for the previous transactions to be picked up and then:

    registrar.setAddress.sendTransaction(name, democracy.address, true,{from: eth.accounts[0]});


### The Democracy Watchbots


    var event = democracy.ProposalAdded({}, '', function(error, result){
      if (!error)
        console.log("New Proposal #"+ result.args.proposalID +"!\n Send " + web3.fromWei(result.args.amount, "ether") + " ether to " + result.args.recipient.substring(2,8) + "... for " + result.args.description  )
    });
    var eventVote = democracy.Voted({}, '', function(error, result){
      if (!error)
        var opinion = "";
        if (result.args.position > 0) { 
          opinion = "in favor" 
        } else if (result.args.position < 0) { 
          opinion = "against" 
        } else { 
          opinion = "abstaining" 
        }

        console.log("Vote on Proposal #"+ result.args.proposalID +"!\n " + result.args.voter + " is " + opinion )
    });
    var eventTally = democracy.ProposalTallied({}, '', function(error, result){
      if (!error)
        var totalCount = "";
        if (result.args.result > 1) { 
          totalCount = "passed" 
        } else if (result.args.result < 1) { 
          totalCount = "rejected" 
        } else { 
          totalCount = "a tie" 
        }
        console.log("Votes counted on Proposal #"+ result.args.proposalID +"!\n With a total of " + Math.abs(result.args.result) + " out of " + result.args.quorum + ", proposal is " + totalCount + ". Proposal is " + (result.args.active? " still on the floor" : "archived") )
    });


### Interacting with the DAO

After you are satisfied with what you want, it's time to get all that ether you got from the crowdfunding into your new organization:

    eth.sendTransaction({from: eth.accounts[1], to: democracy.address, value: web3.toWei(100, "ether")})

This should take only a minute and your country is ready for business! Now, as a first priority, your organisation needs a nice logo, but unless you are a designer, you have no idea how to do that. For the sake of argument let's say you find that your friend Bob is a great designer who's willing to do it for only 10 ethers, so you want to propose to hire him. 

    recipient = registrar.addr("bob");
    amount =  web3.toWei(10, "ether");
    shortNote = "Logo Design";

    democracy.newProposal.sendTransaction( recipient, amount, '', shortNote,  {from: eth.accounts[0], gas:1000000})

After a minute, anyone can check the proposal recipient and amount by executing these commands:

    "This organization has " +  (Number(democracy.numProposals())+1) + " pending proposals";

### Keep an eye on the organization

Unlike most governments, your country's government is completely transparent and easily programmable. As a small demonstration here's a snippet of code that goes through all the current proposals and prints what they are and for whom:

       

    function checkAllProposals() {
        console.log("Country Balance: " + web3.fromWei( eth.getBalance(democracy.address), "ether") );
        for (i = 0; i< (Number(democracy.numProposals())); i++ ) { 
            var p = democracy.proposals(i); 
            var timeleft = Math.floor(((Math.floor(Date.now() / 1000)) - Number(p[4]) - Number(democracy.debatingPeriod()))/60);  
            console.log("Proposal #" + i + " Send " + web3.fromWei( p[1], "ether") + " ether to address " + p[0].substring(2,6) + " for "+ p[3] + ".\t Deadline:"+ Math.abs(Math.floor(timeleft)) + (timeleft>0?" minutes ago ":" minutes left ") + (p[5]? " Active":" Archived") ); 
        }
    }

    checkAllProposals();

A concerned citizen could easily write a bot that periodically pings the blockchain and then publicizes any new proposals that were put forth, guaranteeing total transparency.

Now of course you want other people to be able to vote on your proposals. You can check the crowdsale tutorial on the best way to register your contract app so that all the user needs is a name, but for now let's use the easier version. Anyone should be able to instantiate a local copy of your country in their computer by using this giant command: 


    democracy = eth.contract( [{ constant: true, inputs: [{ name: '', type: 'uint256' } ], name: 'proposals', outputs: [{ name: 'recipient', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'data', type: 'bytes32' }, { name: 'descriptionHash', type: 'bytes32' }, { name: 'creationDate', type: 'uint256' }, { name: 'numVotes', type: 'uint256' }, { name: 'quorum', type: 'uint256' }, { name: 'active', type: 'bool' } ], type: 'function' }, { constant: false, inputs: [{ name: '_proposalID', type: 'uint256' } ], name: 'executeProposal', outputs: [{ name: 'result', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'debatingPeriod', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'numProposals', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'founder', outputs: [{ name: '', type: 'address' } ], type: 'function' }, { constant: false, inputs: [{ name: '_proposalID', type: 'uint256' }, { name: '_position', type: 'int256' } ], name: 'vote', outputs: [{ name: 'voteID', type: 'uint256' } ], type: 'function' }, { constant: false, inputs: [{ name: '_voterShareAddress', type: 'address' } ], name: 'setup', outputs: [ ], type: 'function' }, { constant: false, inputs: [{ name: '_recipient', type: 'address' }, { name: '_amount', type: 'uint256' }, { name: '_data', type: 'bytes32' }, { name: '_descriptionHash', type: 'bytes32' } ], name: 'newProposal', outputs: [{ name: 'proposalID', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'minimumQuorum', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { inputs: [ ], type: 'constructor' } ] ).at(registrar.addr('MyPersonalCountry'))

Then anyone who owns any of your tokens can vote on the proposals by doing this:

    var proposalID = 0;
    var position = -1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
    democracy.vote.sendTransaction(proposalID, position, {from: eth.accounts[0], gas: 1000000});

    var proposalID = 1;
    var position = 1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
    democracy.vote.sendTransaction(proposalID, position, {from: eth.accounts[0], gas: 1000000});


Unless you changed the basic parameters in the code, any proposal will have to be debated for at least a week until it can be executed. After that anyone—even a non-citizen—can demand the votes to be counted and the proposal to be executed. The votes are tallied and weighted at that moment and if the proposal is accepted then the ether is sent immediately and the proposal is archived. If the votes end in a tie or the minimum quorum hasn’t been reached, the voting is kept open until the stalemate is resolved. If it loses, then it's archived and cannot be voted again.

    var proposalID = 1;
    democracy.executeProposal.sendTransaction(proposalID, {from: eth.accounts[0], gas: 1000000});


If the proposal passed then you should be able to see Bob's ethers arriving on his address:

    web3.fromWei(eth.getBalance(democracy.address), "ether") + " ether";
    web3.fromWei(eth.getBalance(registrar.addr("bob")), "ether") + " ether";


**Try for yourself:**  This is a very simple democracy contract, which could be vastly improved: currently, all proposals have the same debating time and are won by direct vote and simple majority.  Can you change that so it will have some situations, depending on the amount proposed, that the debate might be longer or that it would require a larger majority? Also think about some way where citizens didn't need to vote on every issue and could temporarily delegate their votes to a special representative. You might have also noticed that we added a tiny description for each proposal. This could be used as a title for the proposal or could be a hash of a larger document describing it in detail.

### Let's go exploring!

You have reached the end of this tutorial, but it's just the beginning of a great adventure. Look back and see how much you accomplished: you created a living, talking robot, your own cryptocurrency, raised funds through a trustless crowdfunding and used it to kickstart your own personal democratic organization. 

For the sake of simplicity, we only used the democratic organization you created to send ether around, the native currency of ethereum. While that might be good enough for some, this is only scratching the surface of what can be done. In the ethereum network contracts have all the same rights as any normal user, meaning that your organization could do any of the transactions that you executed coming from your own accounts. 


### What could happen next?

* The greeter contract you created at the beginning could be improved to charge ether for its services and could funnel those funds into the DAO.

* The tokens you still control could be sold on a decentralized exchange or traded for goods and services to fund further develop the first contract and grow the organization.

* Your DAO could own its own name on the name registrar, and then change where it's redirecting in order to update itself if the token holders approved.

* The organization could hold not only ethers, but any kind of other coin created on ethereum, including assets whose value are tied to the bitcoin or dollar. 

* The DAO could be programmed to allow a proposal with multiple transactions, some scheduled to the future. 
It could also own shares of other DAO's, meaning it could vote on larger organization or be a part of a federation of DAO's.

* The Token Contract could be reprogrammed to hold ether or to hold other tokens and distribute it to the token holders. This would link the value of the token to the value of other assets, so paying dividends could be accomplished by simply moving funds to the token address.

This all means that this tiny society you created could grow, get funding from third parties, pay recurrent salaries, own any kind of crypto-assets and even use crowdsales to fund its activities. All with full transparency, complete accountability and complete immunity from any human interference. While the network lives the contracts will execute exactly the code they were created to execute, without any exception, forever.

So what will your contract be? Will it be a country, a company, a non-profit group? What will your code do? 

That's up to you.
