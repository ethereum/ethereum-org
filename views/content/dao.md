



## Decentralized Autonomous Organization

> **"On the Blockchain, no one knows you're a fridge"**
> - Richard Brown

So far, all contracts we listed were owned and executed by other accounts probably held by humans. But there is no discrimination against robots or humans in the Ethereum ecosystem and contracts can create arbitrary actions like any other account would. Contracts can own tokens, participate in crowdsales, and even be voting members of other contracts.

In this section we are going to build a decentralized and democratic organization that exists solely on the blockchain, but that can do anything that a simple account would be able to. The organization has a central manager that decides who are the members and the voting rules, but as we'll see, this can also be changed.

The way this particular democracy works is that it has an **Owner** which works like an administrator, CEO or a President. The *Owner* can add (or remove) voting members to the organization. Any member can make a proposal, which is in the form of an ethereum transaction to either send ether or execute some contract, and other members can vote in support or against the proposal. Once a predetermined amount of time and a certain number of members has voted, the proposal can be executed: the contract counts the votes and if there are enough votes it will execute the given transaction.


### The Blockchain Congress

#### The code

    pragma solidity ^0.4.2;
    contract owned {
        address public owner;

        function owned() {
            owner = msg.sender;
        }

        modifier onlyOwner {
            if (msg.sender != owner) throw;
            _;
        }

        function transferOwnership(address newOwner) onlyOwner {
            owner = newOwner;
        }
    }

    contract tokenRecipient { 
        event receivedEther(address sender, uint amount);
        event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);

        function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData){
            Token t = Token(_token);
            if (!t.transferFrom(_from, this, _value)) throw;
            receivedTokens(_from, _value, _token, _extraData);
        }

        function () payable {
            receivedEther(msg.sender, msg.value);
        }
    }
    
    contract Token {
        function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    }

    contract Congress is owned, tokenRecipient {

        /* Contract Variables and events */
        uint public minimumQuorum;
        uint public debatingPeriodInMinutes;
        int public majorityMargin;
        Proposal[] public proposals;
        uint public numProposals;
        mapping (address => uint) public memberId;
        Member[] public members;

        event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
        event Voted(uint proposalID, bool position, address voter, string justification);
        event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
        event MembershipChanged(address member, bool isMember);
        event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, int majorityMargin);

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

        struct Member {
            address member;
            string name;
            uint memberSince;
        }

        struct Vote {
            bool inSupport;
            address voter;
            string justification;
        }

        /* modifier that allows only shareholders to vote and create new proposals */
        modifier onlyMembers {
            if (memberId[msg.sender] == 0)
            throw;
            _;
        }

        /* First time setup */
        function Congress(
            uint minimumQuorumForProposals,
            uint minutesForDebate,
            int marginOfVotesForMajority, address congressLeader
        ) payable {
            changeVotingRules(minimumQuorumForProposals, minutesForDebate, marginOfVotesForMajority);
            if (congressLeader != 0) owner = congressLeader;
            // It’s necessary to add an empty first member
            addMember(0, ''); 
            // and let's add the founder, to save a step later       
            addMember(owner, 'founder');        
        }

        /*make member*/
        function addMember(address targetMember, string memberName) onlyOwner {
            uint id;
            if (memberId[targetMember] == 0) {
               memberId[targetMember] = members.length;
               id = members.length++;
               members[id] = Member({member: targetMember, memberSince: now, name: memberName});
            } else {
                id = memberId[targetMember];
                Member m = members[id];
            }
    
            MembershipChanged(targetMember, true);
        }
    
        function removeMember(address targetMember) onlyOwner {
            if (memberId[targetMember] == 0) throw;

            for (uint i = memberId[targetMember]; i<members.length-1; i++){
                members[i] = members[i+1];
            }
            delete members[members.length-1];
            members.length--;
        }

        /*change rules*/
        function changeVotingRules(
            uint minimumQuorumForProposals,
            uint minutesForDebate,
            int marginOfVotesForMajority
        ) onlyOwner {
            minimumQuorum = minimumQuorumForProposals;
            debatingPeriodInMinutes = minutesForDebate;
            majorityMargin = marginOfVotesForMajority;

            ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
        }

        /* Function to create a new proposal */
        function newProposal(
            address beneficiary,
            uint etherAmount,
            string JobDescription,
            bytes transactionBytecode
        )
            onlyMembers
            returns (uint proposalID)
        {
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
            
            return proposalID;
        }

        /* function to check if a proposal code matches */
        function checkProposalCode(
            uint proposalNumber,
            address beneficiary,
            uint etherAmount,
            bytes transactionBytecode
        )
            constant
            returns (bool codeChecksOut)
        {
            Proposal p = proposals[proposalNumber];
            return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
        }

        function vote(
            uint proposalNumber,
            bool supportsProposal,
            string justificationText
        )
            onlyMembers
            returns (uint voteID)
        {
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
            return p.numberOfVotes;
        }

        function executeProposal(uint proposalNumber, bytes transactionBytecode) {
            Proposal p = proposals[proposalNumber];
            /* Check if the proposal can be executed:
               - Has the voting deadline arrived?
               - Has it been already executed or is it being executed?
               - Does the transaction code match the proposal?
               - Has a minimum quorum?
            */

            if (now < p.votingDeadline
                || p.executed
                || p.proposalHash != sha3(p.recipient, p.amount, transactionBytecode)
                || p.numberOfVotes < minimumQuorum)
                throw;

            /* execute result */
            /* If difference between support and opposition is larger than margin */
            if (p.currentResult > majorityMargin) {
                // Avoid recursive calling

                p.executed = true;
                if (!p.recipient.call.value(p.amount * 1 ether)(transactionBytecode)) {
                    throw;
                }

                p.proposalPassed = true;
            } else {
                p.proposalPassed = false;
            }
            // Fire Events
            ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
        }
    }



#### How to deploy

Open the wallet (if you are only testing, go to the menu develop > network > testnet), go to the **Contracts** tab and then press **deploy contract**, and on the **solidity code** box, paste the code above. On the contract picker, choose **Congress** and you'll see the setup variables.

* **Minimum quorum for proposals** is the minimum amount of votes a proposal needs to have before it can be executed.
* **Minutes for debate** is the minimum amount of time (in minutes) that needs to pass before it can be executed
* **Margin of votes for majority** A proposal passes if there are more than 50% of the votes plus the margin. Leave at 0 for simple majority, put it at the *number of members - 1* to require an absolute consensus.

![DAO Setup](/images/tutorial/dao-setup.png)


You can change these parameters later, choose a name, 5 minutes for debate time and leave the remaining of them at 0. A little lower on the page you'll see an estimate cost of your contract in ether. You can try lowering the price if you want to save, but that might mean having to wait longer for your contract to be created. Click **Deploy**, type your password and wait.

In a few seconds you'll be taken to the dashboard, scroll down and you'll be able to see your transaction being created. In under a minute you'll see the transaction successful and a new unique icon will have been created. Click the contract's name to see it (you can get to it at any time on the *Contracts* tab).

![DAO Just created](/images/tutorial/dao-just-created.png)


#### Sharing with others

If you want to share your DAO with others, then they need both the contract address and the interface file, a small text string that works as an instruction manual of the contract. Click **copy address** to get the former and **show interface** to reveal the latter.

On the other computer, go into the *Contracts* tab and then click on **watch contract**. Add the correct address and interface and press **OK**.

![Add Contract](/images/tutorial/add-contract.png)


#### Interacting with the contract


On the **"read from contract"** you can see all the functions you can execute for free on the contract, as they are just reading information from the blockchain. Here you can see, for instance, the current "owner" of the contract (that should be the account that uploaded the contract).

On the **"Write to contract"** you have a list of all the functions that will attempt to do some computation that saves data to the blockchain, and therefore will cost ether. Select "newProposal" and it will show all the options for that function.

Before interacting with the contract, you'll need to add new members so they can vote. On the **"select function"** picker, choose **"Change Membership"**. Add the address of the person you want to make a member and check the box **can vote** (to remove a member, do the same but leave the box unticked). On **"execute from"** make sure that you have the same account that is set as the owner as this is an action only the main administrator can execute. Press **execute** and wait a few seconds for the next block to go through with your change.

There's no list of members, but you can check if anyone is a member by putting their address on the **Members** function on the *Read from contract* column.

Also, if you want the contract to have any money of its own, you need to deposit some ether (or other token) into it, otherwise you'll have a pretty toothless organization. Press **Deposit** on the top left corner.

#### Add a simple proposal: send ether

Now let's add the first proposal to the contract. On the function picker, select **New proposal**.

For "beneficiary" add the address of someone you want to send ether to, then put how many ethers you want on the "etherAmount" (must be an integer) and finally some text describing the reason you want to do this. Leave transactionByteCode blank for now. Click execute and type your password. After a few seconds the numProposals will increase to 1 and the first proposal, number 0, will appear on the left column. As you add more proposals, you can see any of them by simply putting the proposal number on the "proposals" field and you can read all about it.

Voting on a proposal is also very simple. Choose "vote" on the function picker. Type the proposal Number on the first box and check the "Yes" box if you agree with it (or leave it blank to vote against it). Click "**execute**" to send your vote.

![Add new proposal](/images/tutorial/dao-add-proposal.png)


When the voting time has passed, you can select **"executeProposal"**. If the proposal was simply sending ether, then you can also leave the "**transactionBytecode**" field blank. After pressing "execute" but before typing your password, pay attention to the screen that appears.

**If there is a warning on the "estimated fee consumption" field, then this means that for some reason the function called will not execute and will be abruptly terminated. It can mean many things, but in the context of this contract this warning will show up whenever you try to execute a contract before its deadline has passed, or if the user is trying to send a different bytecode data than the original proposal had. For security reasons if any of these things happens, the contract execution is abruptly terminated and the user that attempted the illegal transaction will lose all the ethers he sent to pay transaction fees.**

If the transaction was executed, then after a few seconds you should be able to see the result: **executed** will turn to true and the correct amount of ether should be subtracted from this contract's balance and into the recipient address.

#### Add a complex proposal: own another token

You can use this democracy to execute any transaction on ethereum, as long as you can figure out the bytecode that that transaction generates. Luckily for us, you can use the wallet to do precisely that!

In this example, we'll use a token to show that this contract can hold more than ether and can do transactions in any other ethereum-based asset. First, [create a token](./token) that belongs to one of your normal accounts. On the contract page, click deposit to transfer some of them to your new congress contract (for simplicity, don't send more than half your coins to your DAO). After that, we are going to simulate the action you want to execute. So if you want to propose that the DAO send 500mg of a gold token to a person as a payment, then follow the steps that you'd do to execute that transaction from an account you own and press "send" but when the confirmation screens pops up, **don't type your password**.


![Select the bytecode](/images/tutorial/select-code.png)

Instead, copy the code displayed on the "data" field and save it to a text file or notepad. Cancel the transaction. You'll also need the address of the contract you'll be calling for that operation, in this case the token contract. You can find it on the *Contracts* tab: save that somewhere too.

Now go back to the democracy contract and create a new proposal with these parameters:

*   As the **beneficiary**, put the address of your token (pay attention if it's the same icon)
*   Leave **Ether amount** blank
*   On the **Job description** just write a small description on what you want to accomplish
*   On the **Transaction Bytecode**, paste the bytecode you saved from the data field on the previous step

![New proposal](/images/tutorial/new-proposal-token.png)

In a few seconds you should be able to see the details on the proposal. You'll notice that the transaction bytecode won't be shown there and instead there's only a "transaction hash". Unlike the other fields, Bytecode can be extremely lengthy and therefore expensive to store on the blockchain, so instead of archiving it, the person executing the call later will provide the bytecode.

But that, of course, creates a security hole: how can a proposal be voted without the actual code being there? And what prevents a user from executing a different code after the proposal has been voted on? That's where transaction hash comes in. Scroll a bit on the "read from contract" function list and you'll see a proposal checker function, where anyone can put all the function parameters and check if they match the one being voted on. This also guarantees that proposals don't get executed unless the hash of the bytecode matches exactly the one on the provided code.

![It's an older code, but it checks out](/images/tutorial/check-code.png)

Anyone can actually check the proposal very easily by following the same steps to get the correct bytecode and then adding the proposal number and other parameters to the function called **Check proposal code** on the bottom of **Read from contract**.

The rest of the voting process remains the same: all members can vote and after the deadline, someone can execute the proposal. The only difference is that this time you'll have to provide the same bytecode you've submitted before. Pay attention to any warnings on the confirmation window: if it says it won't execute your code, check to see if the deadline has already passed, if there are enough votes and if your transaction bytecode checks out.

#### Make it better

Here are some drawbacks of this current DAO that we leave as an exercise to the reader:

* Can you make the member list public and indexed?
* Can you allow members to change their votes (after votes are cast but before the votes are tallied up)?
* Currently the vote message is only visible on logs, can you make a function that will display all votes?


### The Shareholder Association

In the previous section we created a contract that works like an invitation-only club, where members are invited or banned by the whim of the president. But this has a few drawbacks: what if someone wants to change his main address? What if some members have more weight than others? What if you actually want to trade or sell memberships or shares on an open market? What if you wanted your organization to have work as a constant decision machine by shareholders?

We are going to modify a bit our contract to connect it to a specific token, which will work as the holding shares of the contract. First we need to create this token: go to the [token tutorial](./token) and create a simple token with **initial supply** of 100, **decimals** of 0 and a percentage sign (%) as a **symbol**. If you want to be able to trade in fractions of a percent, then increase the supply by 100x or 1000x and then add the corresponding amount of zeros as the **decimals**. Deploy this contract and save its address on a text file.

Now to the shareholder code:


    pragma solidity ^0.4.2;
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
            _;
        }

        function transferOwnership(address newOwner) onlyOwner {
            owner = newOwner;
        }
    }

    contract tokenRecipient { 
        event receivedEther(address sender, uint amount);
        event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);

        function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData){
            Token t = Token(_token);
            if (!t.transferFrom(_from, this, _value)) throw;
            receivedTokens(_from, _value, _token, _extraData);
        }

        function () payable {
            receivedEther(msg.sender, msg.value);
        }
    }
    
    contract Token {
        function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    }

    /* The democracy contract itself */
    contract Association is owned, tokenRecipient {

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
            _;
        }

        /* First time setup */
        function Association(token sharesAddress, uint minimumSharesToPassAVote, uint minutesForDebate) payable {
            changeVotingRules(sharesAddress, minimumSharesToPassAVote, minutesForDebate);
        }

        /*change rules*/
        function changeVotingRules(token sharesAddress, uint minimumSharesToPassAVote, uint minutesForDebate) onlyOwner {
            sharesTokenAddress = token(sharesAddress);
            if (minimumSharesToPassAVote == 0 ) minimumSharesToPassAVote = 1;
            minimumQuorum = minimumSharesToPassAVote;
            debatingPeriodInMinutes = minutesForDebate;
            ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, sharesTokenAddress);
        }

        /* Function to create a new proposal */
        function newProposal(
            address beneficiary,
            uint etherAmount,
            string JobDescription,
            bytes transactionBytecode
        )
            onlyShareholders
            returns (uint proposalID)
        {
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
            
            return proposalID;
        }

        /* function to check if a proposal code matches */
        function checkProposalCode(
            uint proposalNumber,
            address beneficiary,
            uint etherAmount,
            bytes transactionBytecode
        )
            constant
            returns (bool codeChecksOut)
        {
            Proposal p = proposals[proposalNumber];
            return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
        }

        /* */
        function vote(uint proposalNumber, bool supportsProposal)
            onlyShareholders
            returns (uint voteID)
        {
            Proposal p = proposals[proposalNumber];
            if (p.voted[msg.sender] == true) throw;

            voteID = p.votes.length++;
            p.votes[voteID] = Vote({inSupport: supportsProposal, voter: msg.sender});
            p.voted[msg.sender] = true;
            p.numberOfVotes = voteID +1;
            Voted(proposalNumber,  supportsProposal, msg.sender);
            return voteID;
        }

        function executeProposal(uint proposalNumber, bytes transactionBytecode) {
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
                p.executed = true;
                if (!p.recipient.call.value(p.amount * 1 ether)(transactionBytecode)) {
                    throw;
                }
                p.proposalPassed = true;
            } else {
                p.proposalPassed = false;
            }
            // Fire Events
            ProposalTallied(proposalNumber, 0, quorum, p.proposalPassed);
        }
    }


#### Deploy and usage

The code is deployed almost exactly like the previous code, but you need to also put a **shares token address** which is the address of the token that will work as a share with voting rights.

Notice these lines of codes: first we describe the token contract to our new contract. Since it only uses the **balanceOf** function, we only need to add that single line.

    contract token { mapping (address => uint256) public balanceOf; }

Then we define a variable of the *type* token, meaning that it will inherit all the functions we described earlier. Finally we point the token variable to an address on the blockchain, so it can use that and request live information. This is the simplest way to make one contract understand the other in ethereum.

    contract Association {
        token public sharesTokenAddress;
    ...
    function Association(token sharesAddress, uint minimumSharesForVoting, uint minutesForDebate) {
            sharesTokenAddress = token(sharesAddress);

This association presents a challenge that the previous congress didn't have: since anyone with tokens can vote and the balances can change very quickly, the actual score of the proposal can't be counted when the shareholder votes, otherwise someone would be able to vote multiple times by simply sending his share to different addresses. So in this contract only the vote position is recorded and then the real score is tallied up on the **execute proposal** phase.

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

Another way to achieve the same goal would be to create a single signed integer to keep score of the votes and check if it was positive or negative on the end, but you'd have to convert the *unsigned integer* balanceOf into a *signed integer* using **int score = int(voteWeight);**

Using this DAO is exactly like the previous: members create new proposals, vote on them, wait until the deadline passes and then anyone can count the votes and execute it.

![Association example](/images/tutorial/association-dao.png)



#### But how can I limit the owner's power?

On this contract the address set as **owner** has some special powers: they can add or ban members at will, change the margin needed for a win, alter the time required for debate and the quorum necessary for the vote to pass. But this can be solved by using yet another power the owner has: to change ownership.

The owner could change the ownership to no one by pointing the new owner as *0x00000...*. This would guarantee that the rules will never change, but it's an irreversible action. The owner can also change the ownership to the contract itself: just click on "copy address" and add it on the "new owner" field. This would make that all the powers of the owner could be executed by creating proposals.

If you want, you can also set one contract as the owner of the other: suppose you wanted a corporate structure where you wanted a President for life that had the power to appoint board members, which could then issue more shares and finally these shares voted on how to spend a budget. You could create an **Association** contract, that used a **[mintable token](./token)** owned by a **congress** finally owned by a single account.

But what if you wanted different rules for voting? Maybe to change voting rules you'd need a 80% consensus, or maybe the members are different. In that case, you can create another identical DAO or use some other source code and plug that one as the owner of the first.





### Liquid democracy

Voting on all expenses and actions of a contract takes time and requires users to be constantly active, informed and attentive. Another interesting approach is to elect an appointed account that will have control over a contract and then be able to take swift decisions over it.

We are going to implement a version of what's usually called **Liquid Democracy**, which is a more flexible delegative democracy. In this kind of democracy, any voter can be a potential delegate: instead of voting the candidate you want, you just say which voter you trust to handle this decision for you. Your voting weight is delegated to them and they can in turn delegate it to another voter they trust and so on. The end result should be that the most voted account is one that has trust connections to the largest amount of voters.


#### The code

    pragma solidity ^0.4.2;
    contract token {
        mapping (address => uint256) public balanceOf;
    }

    contract LiquidDemocracy {
        token public votingToken;
        bool  underExecution;
        address public appointee;
        mapping (address => uint) public voterId;
        mapping (address => uint256) public voteWeight;

        uint public delegatedPercent;
        uint public lastWeightCalculation;
        uint public numberOfDelegationRounds;

        uint public numberOfVotes;
        DelegatedVote[] public delegatedVotes;
        string public forbiddenFunction;

        event NewAppointee(address newAppointee, bool changed);

        struct DelegatedVote {
            address nominee;
            address voter;
        }

        function LiquidDemocracy(
            address votingWeightToken,
            string forbiddenFunctionCall,
            uint percentLossInEachRound
        ) {
            votingToken = token(votingWeightToken);
            delegatedVotes.length++;
            delegatedVotes[0] = DelegatedVote({nominee: 0, voter: 0});
            forbiddenFunction = forbiddenFunctionCall;
            delegatedPercent = 100 - percentLossInEachRound;
            if (delegatedPercent > 100) delegatedPercent = 100;
        }

        function vote(address nominatedAddress) returns (uint voteIndex) {
            if (voterId[msg.sender]== 0) {
                voterId[msg.sender] = delegatedVotes.length;
                numberOfVotes++;
                voteIndex = delegatedVotes.length++;
                numberOfVotes = voteIndex;
            }
            else {
                voteIndex = voterId[msg.sender];
            }

            delegatedVotes[voteIndex] = DelegatedVote({nominee: nominatedAddress, voter: msg.sender});
            
            return voteIndex;
        }

        function execute(address target, uint valueInEther, bytes32 bytecode) {
            if (msg.sender != appointee                                 // If caller is the current appointee,
                || underExecution //                                    // if the call is being executed,
                || bytes4(bytecode) == bytes4(sha3(forbiddenFunction))  // and it's not trying to do the forbidden function
                || numberOfDelegationRounds < 4 )                       // and delegation has been calculated enough
                throw;

            underExecution = true;

            if (!target.call.value(valueInEther * 1 ether)(bytecode)) { // Then execute the command.
                throw;
            }
            else {
              underExecution = false;
            }
        }

        function calculateVotes() returns (address winner) {
            address currentWinner = appointee;
            uint currentMax = 0;
            uint weight = 0;
            DelegatedVote v = delegatedVotes[0];

            if (now > lastWeightCalculation + 90 minutes) {
                numberOfDelegationRounds = 0;
                lastWeightCalculation = now;

                // Distribute the initial weight
                for (uint i=1; i< delegatedVotes.length; i++) {
                    voteWeight[delegatedVotes[i].nominee] = 0;
                }
                for (i=1; i< delegatedVotes.length; i++) {
                    voteWeight[delegatedVotes[i].voter] = votingToken.balanceOf(delegatedVotes[i].voter);
                }
            }
            else {
                numberOfDelegationRounds++;
                uint lossRatio = 100 * delegatedPercent ** numberOfDelegationRounds / 100 ** numberOfDelegationRounds;
                if (lossRatio > 0) {
                    for (i=1; i< delegatedVotes.length; i++){
                        v = delegatedVotes[i];

                        if (v.nominee != v.voter && voteWeight[v.voter] > 0) {
                            weight = voteWeight[v.voter] * lossRatio / 100;
                            voteWeight[v.voter] -= weight;
                            voteWeight[v.nominee] += weight;
                        }

                        if (numberOfDelegationRounds>3 && voteWeight[v.nominee] > currentMax) {
                            currentWinner = v.nominee;
                            currentMax = voteWeight[v.nominee];
                        }
                    }
                }
            }

            if (numberOfDelegationRounds > 3) {
                NewAppointee(currentWinner, appointee == currentWinner);
                appointee = currentWinner;
            }

            return currentWinner;
        }
    }




#### Deployment

First, you need a token. If you have followed the **Shareholder association** tutorial above, you can use the same token as you had previously, otherwise just [deploy a new token](./token/) and distribute it among some accounts. Copy the token address.

Deploy the democracy contract, and put the token address on the **Voting weight token**, put **75** as the **Percent loss in each round** and **transferOwnership(address)** (without any spaces or extra characters!) as the **forbidden function**.

#### Selecting a delegate

Now deploy the Liquid democracy and go to its page. First have any of the shareholders **vote** on who they would trust to make decisions on behalf of this contract. You can vote on yourself if you want to be the final decision maker, or on the zero address, if you'd rather have no one representing you on that role.

After enough people have cast their votes, you can execute the function **Calculate Votes** so it will calculate everyone's voting weight. This function needs to be run multiple times, so the first run it will just set everyone's weight as their balance in the selected token, in the next round that voting weight will go to the person you voted appointed, in the next it will go to the person voted by the person you chose and so on. To prevent infinite loops of vote delegations, each time a vote is forwarded it loses a bit of power, set by at contract launch at **percentLossInEachRound**. So if the loss is set at 75%, it means that the person you vote gets 100% of your weight, but if they delegate the vote to someone else only 75% of their weight is forwarded. That person can delegate to someone else but they'll get only 56% of your voting weight and so on. If the ratio is anything lower than 100% there will be a finite moment where recalculating voting delegation won't change the result anymore, but if it's a 100% it means that voting weights will simply circulate around any potential loops.

If there has been more than one hour and a half since this round of calling **Calculate votes** has started, all weights will reset and will be recalculated based on the original token balance, so if you have recently received more tokens you should execute this function again.

#### House of representatives

What is all that vote delegation good for? For one, you can use it instead of the token weight on an **Association**. First of all, get the code for a [shareholder association](#the-shareholder-association) but replace the first lines where it describes the token:

    contract token {
        mapping (address => uint256) public balanceOf;
    }

Into this:

    contract token {
        mapping (address => uint256) public voteWeight;
        uint public numberOfDelegationRounds;

        function balanceOf(address member) constant returns (uint256 balance) {
            if (numberOfDelegationRounds < 3)
                return 0;
            else
                return this.voteWeight(member);
        }
    }

When you are writing your contract you can describe multiple other contracts used by your main contract. Some might be functions and variables that are already defined on the target contract, like **voteWeight** and **numberOfDelegationRounds**. But notice that **balanceOf** is a new function, that doesn't exist neither on the Liquid Democracy or the Association contract, we are defining it now, as a function that will return the **voteWeight** if at least three rounds of delegations have been calculated.

Use the **Liquid democracy** as the **Token Address** instead of the original token and proceed to deploy the shareholder association as usual. Just like before, users can create new proposals on what to do or cast votes on these issues, but now, **instead of using the token balance as the voting power we are using a delegative process**. So if you are a token holder, instead of having to keep yourself constantly informed by all the issues, you can just select someone you trust and appoint them, and then they can choose someone they trust: the result is that your representative, instead of being limited to a given arbitrary **geographical proximity**, will be someone in your **social proximity**.

Also it means that you can switch your vote at any moment: if your representative has voted against your interests in some issue you can, before the proposal votes are tallied up, switch your appointee, or just choose to represent yourself on the issue and cast the vote yourself.


#### The Executive Branch

Delegative democracies are a great way to choose representatives, but voting on individual proposals might be too slow for some important or simpler decisions: that's why most democratic governments have an executive branch, where an appointed person has the right to represent the state.

After four rounds of delegations, the address with more weight will be set as the **Appointee**. If there are many delegated votes, then a few more rounds of **Calculate Votes** might be necessary to settle in the final appointed address.

The Appointee is the only address that can call the **Execute** function, which will be able to execute (almost) any function representing the democracy as a whole. If there is any ether or token stored in the Liquid democracy contract, the Appointee will be allowed to move it anywhere.

If you have followed our example and created a **Shareholder association** using this liquid democracy as a token, then you should be able to use the executive branch in an interesting manner: go to the main Association address and execute a **Transfer Ownership** function to the liquid democracy.

Once that transfer is complete, switch the function to **Change Voting Rules**. This allows you to change some essential voting rules, like the minimum quorum needed for a vote to pass or the time a new proposal needs to stay on the floor. Try changing these settings and click **execute**: when the confirmation window pops up it will tell you that the transaction *Can't be executed*. This happens, of course, because only the address set as **Owner** can change these settings and the contract will reject this transaction attempt. So **instead of typing your password** copy the code on the **data** field and save it to a text file. Click cancel, scroll to the top and click **copy address** and also save that to a text file.

Now go to the Liquid democracy page and choose **execute**. On **target** put the address of the association contract, leave **ether amount** at 0 and paste the code you copied previously into the **bytecode data** field. Make sure you are executing it from the account set as the **appointee** and click **execute**.

Once the transaction has been picked up, the Liquid democracy will pass the order to the association and the new voting rules might apply. The appointee has the absolute power to do anything that the **Liquid democracy** contract can execute. You can use the same technique to create a [Mintable Token](./token) owned by the delegative democracy, and then allow the appointee to mint tokens or freeze accounts.

To prevent abuses of powers, you can set one **Forbidden function** that the Appointee cannot ever do. If you followed our example the forbidden function is the **transferOwnership(address)**, to prevent the appointee from transferring the ownership of the association to themselves (in politics, when a president uses his executive power to transfer to themselves something that used to belongs to the presidency, it's a coup or embezzling).

### Time-Locked Multisig


Sometimes time can also be used as a great security mechanism. The following code is based on the congress DAO but with a different twist. Instead of every action requiring the approval of an X number of members, instead any transactions can be initiated by a single member, but they all will require a minimum amount of delay before they can be executed, which varies according to the support that transaction has. The more approvals a proposal has, the sooner it can be executed. A member can vote against a transaction, which will mean that it will cancel one of the other approved signatures. 

This means that if you don't have urgency, one or two signatures might be all you need to execute any transaction. But if a single key is compromised, other keys can delay that transaction for months or year or even stop it from being executed.


#### How it works

A transaction that has been approved by all keys can be executed after ten minutes (this amount is configurable), and the amount of time it requires doubles every time for every 5% of members who don't vote (and quadruples if they activelly vote against). If it's a simple ether transaction, the transaction is executed as soon as a vote of support puts it under the required time, but a more complex transaction will require it to be manually executed with the correct bytecode. These are the default values, but this can be set differently when creating the contract:

**Number of members approving transaction: Approximate time delay**

* 100% approval:                                10 minutes (minimum default) 
* 90% approval:                                 40 minutes                         
* 80%:                                          2h40                     
* 50%:                                          about a week                 
* 40%:                                          1 month                     
* 30%:                                          4 months                     
* 20%:                                          Over a year              
* 10% or less:                                  5 years or never                        


Once the minimum amount of time has passed, anyone can execute the transaction [(See "Congress" for a more complete walktrough)](dao#add-a-simple-proposal-send-ether). This is intentional, as it allows someone to [schedule a transaction](crowdsale#scheduling-a-call) or hire someone else to execute it.

#### The code

    pragma solidity ^0.4.2;
    contract owned {
        address public owner;

        function owned() {
            owner = msg.sender;
        }

        modifier onlyOwner {
            if (msg.sender != owner) throw;
            _;
        }

        function transferOwnership(address newOwner) onlyOwner {
            owner = newOwner;
        }
    }

    contract tokenRecipient { 
        event receivedEther(address sender, uint amount);
        event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);

        function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData){
            Token t = Token(_token);
            if (!t.transferFrom(_from, this, _value)) throw;
            receivedTokens(_from, _value, _token, _extraData);
        }

        function () payable {
            receivedEther(msg.sender, msg.value);
        }
    }

    contract Token {
        function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    }

    contract TimeLockMultisig is owned, tokenRecipient {

        /* Contract Variables and events */
        Proposal[] public proposals;
        uint public numProposals;
        mapping (address => uint) public memberId;
        Member[] public members;
        uint minimumTime = 10;

        event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
        event Voted(uint proposalID, bool position, address voter, string justification);
        event ProposalExecuted(uint proposalID, int result, uint deadline);
        event MembershipChanged(address member, bool isMember);

        struct Proposal {
            address recipient;
            uint amount;
            string description;
            bool executed;
            int currentResult;
            bytes32 proposalHash;
            uint creationDate;
            Vote[] votes;
            mapping (address => bool) voted;
        }

        struct Member {
            address member;
            string name;
            uint memberSince;
        }

        struct Vote {
            bool inSupport;
            address voter;
            string justification;
        }

        /* modifier that allows only shareholders to vote and create new proposals */
        modifier onlyMembers {
            if (memberId[msg.sender] == 0)
            throw;
            _;
        }

        /* First time setup */
        function TimeLockMultisig(address founder, address[] initialMembers, uint minimumAmountOfMinutes) payable {
            if (founder != 0) owner = founder;
            if (minimumAmountOfMinutes !=0) minimumTime = minimumAmountOfMinutes;
            // It’s necessary to add an empty first member
            addMember(0, ''); 
            // and let's add the founder, to save a step later       
            addMember(owner, 'founder');   
            changeMembers(initialMembers, true);     
        }

        /*make member*/
        function addMember(address targetMember, string memberName) onlyOwner {
            uint id;
            if (memberId[targetMember] == 0) {
               memberId[targetMember] = members.length;
               id = members.length++;
               members[id] = Member({member: targetMember, memberSince: now, name: memberName});
            } else {
                id = memberId[targetMember];
                Member m = members[id];
            }

            MembershipChanged(targetMember, true);
        }
        
        function removeMember(address targetMember) onlyOwner {
            if (memberId[targetMember] == 0) throw;

            for (uint i = memberId[targetMember]; i<members.length-1; i++){
                members[i] = members[i+1];
            }
            delete members[members.length-1];
            members.length--;
        }

        function changeMembers(address[] newMembers, bool canVote) {
            for (uint i = 0; i < newMembers.length; i++) {
                if (canVote)
                    addMember(newMembers[i], '');
                else 
                    removeMember(newMembers[i]);
            }
        }

        /* Function to create a new proposal */
        function newProposal(
            address beneficiary,
            uint weiAmount,
            string jobDescription,
            bytes transactionBytecode
        )
            onlyMembers
            returns (uint proposalID)
        {
            proposalID = proposals.length++;
            Proposal p = proposals[proposalID];
            p.recipient = beneficiary;
            p.amount = weiAmount;
            p.description = jobDescription;
            p.proposalHash = sha3(beneficiary, weiAmount, transactionBytecode);
            p.executed = false;
            p.creationDate = now;
            ProposalAdded(proposalID, beneficiary, weiAmount, jobDescription);
            numProposals = proposalID+1;
            vote(proposalID, true, '');

            return proposalID;
        }

        /* Function to create a new proposal */
        function newProposalInEther(
            address beneficiary,
            uint etherAmount,
            string jobDescription,
            bytes transactionBytecode
        )
            onlyMembers
            returns (uint proposalID)
        {
            return newProposal(beneficiary, etherAmount * 1 ether, jobDescription, transactionBytecode);
        }

        /* function to check if a proposal code matches */
        function checkProposalCode(
            uint proposalNumber,
            address beneficiary,
            uint etherAmount,
            bytes transactionBytecode
        )
            constant
            returns (bool codeChecksOut)
        {
            Proposal p = proposals[proposalNumber];
            return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
        }

        function vote(
            uint proposalNumber,
            bool supportsProposal,
            string justificationText
        )
            onlyMembers
            returns (uint voteID)
        {
            Proposal p = proposals[proposalNumber];         // Get the proposal
            if (p.voted[msg.sender] == true) throw;         // If has already voted, cancel
            p.voted[msg.sender] = true;                     // Set this voter as having voted
            if (supportsProposal) {                         // If they support the proposal
                p.currentResult++;                          // Increase score
            } else {                                        // If they don't
                p.currentResult--;                          // Decrease the score
            }
            
            // Create a log of this event
            Voted(proposalNumber,  supportsProposal, msg.sender, justificationText);
     
            // If you can execute it now, do it
            if ( now > proposalDeadline(proposalNumber)
                && p.currentResult > 0
                && p.proposalHash == sha3(p.recipient, p.amount, '')
                && supportsProposal) {
                executeProposal(proposalNumber, '');
            }
        }

        function proposalDeadline(uint proposalNumber) constant returns(uint deadline) {
            Proposal p = proposals[proposalNumber];
            uint factor = calculateFactor(uint(p.currentResult), (members.length - 1));
            return p.creationDate + uint(factor * minimumTime *  1 minutes);
        }
        
        function calculateFactor(uint a, uint b) constant returns (uint factor) {
            return 2**(20 - (20 * a)/b);
        }

        function executeProposal(uint proposalNumber, bytes transactionBytecode) returns (int result) {
            Proposal p = proposals[proposalNumber];
            /* Check if the proposal can be executed:
               - Has the voting deadline arrived?
               - Has it been already executed or is it being executed?
               - Does the transaction code match the proposal?
               - Has a minimum quorum?
            */

            if (now < proposalDeadline(proposalNumber)
                || p.currentResult <= 0
                || p.executed
                || !checkProposalCode(proposalNumber, p.recipient, p.amount, transactionBytecode))
                throw;


            p.executed = true;
            if (!p.recipient.call.value(p.amount)(transactionBytecode)) {
                throw;
            }

            // Fire Events
            ProposalExecuted(proposalNumber, p.currentResult, proposalDeadline(proposalNumber));
        }
    }


#### Deployment and usage

Deploy that code as you have done before on these tutorials. On the deployment parameters, leaving the minimum time blank will default to 30 minutes, if you want faster lock times, then put 1 minute. After uploading, execute the functions "Add Members" to add new members of your group, they can be either other people you know or accounts on different computers or stored offline. 

The account set as "owner" is very powerful as it can add or remove members at will. Therefore, after you added the main members, we recommend that you set the "owner" to another account, by executing the function **Transfer Membership**. Set that to the multisig itself if you want to have all additions or removals of members to be voted, just like any other transaction. Another alternative is to set that to another trusted multisig wallet, or maybe to *0x000* if you want the number of members to be fixed forever. Remember, the funds on this contract are only as safe as the the "owner" account.

As with any of the above DAO's, this contract can hold ether, any ethereum based tokens and execute any contract. To do that, check how to [execute complex proposals](dao#add-a-complex-proposal-own-another-token) on the congress DAO.

#### Caveats and improvements

For simplicity's sake, a vote against a proposal simply counts as one less vote of support. If you want, you can play around with the idea that negative votes have more weight, but this means that a minority of members could have an effective veto power on any proposed transaction!

How else could you improve this contract?


### Let's go exploring!

You have reached the end of this tutorial, but it's just the beginning of a great adventure. Look back and see how much you accomplished: you created a living, talking robot, your own cryptocurrency, raised funds through a trustless crowdfunding and used it to kickstart your own personal democratic organization.



#### What could happen next?

* The tokens you still control could be sold on a decentralized exchange or traded for goods and services to fund further develop the first contract and grow the organization.

* Your DAO could own its own name on the name registrar, and then change where it's redirecting in order to update itself if the token holders approved.

* The organization could hold not only ethers, but any other kind of coin created on ethereum, including assets whose values are tied to the bitcoin or dollar.

* The DAO could be programmed to allow a proposal with multiple transactions, some scheduled to the future.
It could also own shares of other DAOs, meaning it could vote on larger organization or be a part of a federation of DAOs.

* The Token Contract could be reprogrammed to hold ether or to hold other tokens and distribute it to the token holders. This would link the value of the token to the value of other assets, so paying dividends could be accomplished by simply moving funds to the token address.

This all means that this tiny society you created could grow, get funding from third parties, pay recurrent salaries, own any kind of crypto-assets and even use crowdsales to fund its activities. All with full transparency, complete accountability and complete immunity from any human interference. While the network lives the contracts will execute exactly the code they were created to execute, without any exception, forever.

So what will your contract be? Will it be a country, a company, a non-profit group? What will your code do?

That's up to you.
