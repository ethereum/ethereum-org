

# Democracy DAO



So far you created a tradeable token and you successfully distributed it among all those who were willing to help fundraise a 100 ethers. That's all very interesting but what exactly are those tokens for?  Why would anyone want to own or trade it for anything else valuable? If you can convince your new token is the next big money maybe others will want it, but so far your token offers no value per se. We are going to change that, by creating your first decentralized autonomous organization, or DAO.

Think of the DAO as the constitution of a country, the executive branch of a government or maybe like a  robotic manager for an organization. The DAO receives the money that your organization raises, keeps it safe and uses it to fund whatever its members want. The robot is incorruptible, will never defraud the bank, never create secret plans, never use the money for anything other than what it's constituents voted on. The DAO will never disappear, never run away and cannot be controlled by anyone other than it's own citizens.

The token we created using the crowdsale is the only citizen document needed. Anyone who holds any token is able to create and vote on proposals. Similar to being a shareholder in a company, the token can be traded on the open market and the vote is proportional to amounts of tokens the voter holds.  

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
            } else {
                return 0;
            }
        }
        
        function vote(uint _proposalID, int _position) returns (uint voteID){
            if (voterShare.coinBalanceOf(msg.sender)>0 && (_position >= -1 || _position <= 1 )) {
                Proposal p = proposals[_proposalID];
                if (p.voted[msg.sender] == true) return;
                voteID = p.votes.length++;
                Vote v = p.votes[voteID];
                v.position = _position;
                v.voter = msg.sender;   
                p.voted[msg.sender] = true;
                Voted(_proposalID,  _position, msg.sender);
            } else {
                return 0;
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





There's a lot of going on but it's simpler than it looks. The rules of your organization are very simple: anyone with at least one token can create proposals to send funds from the country's account. After a week of debate and votes, if it has received votes totally at least 100 tokens and has more approvals than rejections, the funds will be sent. If the quorum hasn't been met or it ends on a tie, then voting is kept until it's resolved. Otherwise, the proposal is locked and kept for historical purposes.

So let's recap what this means: in the last two sections you created 10,000 tokens, sent 1,000 of those to another account you control, 2,000 to a friend named Alice and distributed 5,000 of them via a crowdsale.  This means that you no longer control over 50% of the votes in the DAO, and if Alice and the community bands together, they can outvote any spending decision on the 100 ethers raised so far. This is exactly how a democracy should work. If you don't want to be a part of your country anymore the only thing you can do is sell your own tokens on a decentralized exchange and opt out, but you cannot prevent the others from doing so.

### Set Up your Organization

So open your console and let's get ready to finally put your country online:

    
    var daoCompiled = eth.compile.solidity('contract token { mapping (address => uint) public coinBalanceOf; function token() { } function sendCoin(address receiver, uint amount) returns(bool sufficient) { } } contract Democracy { uint public minimumQuorum; uint public debatingPeriod; token public voterShare; address public founder; Proposal[] public proposals; uint public numProposals; event ProposalAdded(uint proposalID, address recipient, uint amount, bytes32 data, string description); event Voted(uint proposalID, int position, address voter); event ProposalTallied(uint proposalID, int result, uint quorum, bool active); struct Proposal { address recipient; uint amount; bytes32 data; string description; uint creationDate; bool active; Vote[] votes; mapping (address => bool) voted; } struct Vote { int position; address voter; } function Democracy(token _voterShareAddress, uint _minimumQuorum, uint _debatingPeriod) { founder = msg.sender; voterShare = token(_voterShareAddress); minimumQuorum = _minimumQuorum || 10; debatingPeriod = _debatingPeriod * 1 minutes || 30 days; } function newProposal(address _recipient, uint _amount, bytes32 _data, string _description) returns (uint proposalID) { if (voterShare.coinBalanceOf(msg.sender)>0) { proposalID = proposals.length++; Proposal p = proposals[proposalID]; p.recipient = _recipient; p.amount = _amount; p.data = _data; p.description = _description; p.creationDate = now; p.active = true; ProposalAdded(proposalID, _recipient, _amount, _data, _description); numProposals = proposalID+1; } else { return 0; } } function vote(uint _proposalID, int _position) returns (uint voteID){ if (voterShare.coinBalanceOf(msg.sender)>0 && (_position >= -1 || _position <= 1 )) { Proposal p = proposals[_proposalID]; if (p.voted[msg.sender] == true) return; voteID = p.votes.length++; Vote v = p.votes[voteID]; v.position = _position; v.voter = msg.sender; p.voted[msg.sender] = true; Voted(_proposalID, _position, msg.sender); } else { return 0; } } function executeProposal(uint _proposalID) returns (int result) { Proposal p = proposals[_proposalID]; /* Check if debating period is over */ if (now > (p.creationDate + debatingPeriod) && p.active){ uint quorum = 0; /* tally the votes */ for (uint i = 0; i < p.votes.length; ++i) { Vote v = p.votes[i]; uint voteWeight = voterShare.coinBalanceOf(v.voter); quorum += voteWeight; result += int(voteWeight) * v.position; } /* execute result */ if (quorum > minimumQuorum && result > 0 ) { p.recipient.call.value(p.amount)(p.data); p.active = false; } else if (quorum > minimumQuorum && result < 0) { p.active = false; } } ProposalTallied(_proposalID, result, quorum, p.active); } }');

    var votingTokenAddress = tokenInstance.address;
    var minimunQuorum = 10; // Minimun amount of voter tokens the proposal needs to pass
    var debatingPeriod = 5; // debating period, in minutes;

Choose these parameters with care..

    var daoContract = web3.eth.contract(daoCompiled.Democracy.info.abiDefinition);
    
    var daoInstance = daoContract.new(
        votingTokenAddress, 
        minimunQuorum, 
        debatingPeriod, 
        {
          from:web3.eth.accounts[0], 
          data:daoCompiled.Democracy.code, 
          gas: 2000000
        }, function(e, contract){
         console.log(e, contract);
         console.log("Contract mined! \naddress: " + contract.address + "\ntransactionHash: " + contract.transactionHash);
      })


Wait a minute until the miners pick it up. It will cost you about 850k Gas. Once it's picked up it's time to instantiate it and set it up, by pointing it to the correct address of the token contract you created previously. 

If everything worked out, you can take a look at the whole organization by executing this string:

    "This organization has " +  daoInstance.numProposals() + " proposals and uses the token at the address " + daoInstance.voterShare() ;

If everything is setup then your DAO should return a proposal count of 0 and an address marked as the "founder". While there are still no proposals, the founder of the DAO can change the address of the token to anything it wants. 

### Register your organization name

Let's also register a name for your contract so it's easily accessible (don't forget to check your name availability with registrar.addr("nameYouWant") before reserving!)

    var name = "MyPersonalDemocracy"
    registrar.reserve.sendTransaction(name, {from: eth.accounts[0]})
    var daoInstance = eth.contract(daoCompiled.Democracy.info.abiDefinition).at(daoInstance.address);
    daoInstance.setup.sendTransaction(registrar.addr("MyFirstCoin"),{from:eth.accounts[0]})

Wait for the previous transactions to be picked up and then:

    registrar.setAddress.sendTransaction(name, daoInstance.address, true,{from: eth.accounts[0]});


### The Democracy Watchbots


    var event = daoInstance.ProposalAdded({}, '', function(error, result){
      if (!error)
        console.log("New Proposal #"+ result.args.proposalID +"!\n Send " + web3.fromWei(result.args.amount, "ether") + " ether to " + result.args.recipient.substring(2,8) + "... for " + result.args.description  )
    });
    var eventVote = daoInstance.Voted({}, '', function(error, result){
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
    var eventTally = daoInstance.ProposalTallied({}, '', function(error, result){
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

After you are satisfied with what you want, it's time to get all that ether you got from the crowdfunding and into your new organization:

    eth.sendTransaction({from: eth.accounts[1], to: daoInstance.address, value: web3.toWei(100, "ether")})

This should take only a minute and your country is ready for business! Now, as a first priority, your organization needs a nice logo, but unless you are a designer, you have no idea how to do that. For the sake of argument let's say you find that your friend Bob is a great designer who's willing to do it for only 10 ethers, so you want to propose to hire him. 

    recipient = registrar.addr("bob");
    amount =  web3.toWei(10, "ether");
    shortNote = "Logo Design";

    daoInstance.newProposal.sendTransaction( recipient, amount, '', shortNote,  {from: eth.accounts[0], gas:1000000})

After a minute, anyone can check the proposal recipient and amount by executing these commands:

    "This organization has " +  (Number(daoInstance.numProposals())+1) + " pending proposals";

### Keep an eye on the organization

Unlike most governments, your country's government is completely transparent and easily programmable. As a small demonstration here's a snippet of code that goes through all the current proposals and prints what they are and for whom:

       

    function checkAllProposals() {
        console.log("Country Balance: " + web3.fromWei( eth.getBalance(daoInstance.address), "ether") );
        for (i = 0; i< (Number(daoInstance.numProposals())); i++ ) { 
            var p = daoInstance.proposals(i); 
            var timeleft = Math.floor(((Math.floor(Date.now() / 1000)) - Number(p[4]) - Number(daoInstance.debatingPeriod()))/60);  
            console.log("Proposal #" + i + " Send " + web3.fromWei( p[1], "ether") + " ether to address " + p[0].substring(2,6) + " for "+ p[3] + ".\t Deadline:"+ Math.abs(Math.floor(timeleft)) + (timeleft>0?" minutes ago ":" minutes left ") + (p[5]? " Active":" Archived") ); 
        }
    }

    checkAllProposals();

A concerned citizen could easily write a bot that periodically pings the blockchain and then publicizes any new proposals that were put forth, guaranteeing total transparency.

Now of course you want other people to be able to vote on your proposals. You can check the crowdsale tutorial on the best way to register your contract app so that all the user needs is a name, but for now let's use the easier version. Anyone should be able to instantiate a local copy of your country in their computer by using this giant command: 


    daoInstance = eth.contract( [{ constant: true, inputs: [{ name: '', type: 'uint256' } ], name: 'proposals', outputs: [{ name: 'recipient', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'data', type: 'bytes32' }, { name: 'descriptionHash', type: 'bytes32' }, { name: 'creationDate', type: 'uint256' }, { name: 'numVotes', type: 'uint256' }, { name: 'quorum', type: 'uint256' }, { name: 'active', type: 'bool' } ], type: 'function' }, { constant: false, inputs: [{ name: '_proposalID', type: 'uint256' } ], name: 'executeProposal', outputs: [{ name: 'result', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'debatingPeriod', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'numProposals', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'founder', outputs: [{ name: '', type: 'address' } ], type: 'function' }, { constant: false, inputs: [{ name: '_proposalID', type: 'uint256' }, { name: '_position', type: 'int256' } ], name: 'vote', outputs: [{ name: 'voteID', type: 'uint256' } ], type: 'function' }, { constant: false, inputs: [{ name: '_voterShareAddress', type: 'address' } ], name: 'setup', outputs: [ ], type: 'function' }, { constant: false, inputs: [{ name: '_recipient', type: 'address' }, { name: '_amount', type: 'uint256' }, { name: '_data', type: 'bytes32' }, { name: '_descriptionHash', type: 'bytes32' } ], name: 'newProposal', outputs: [{ name: 'proposalID', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'minimumQuorum', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { inputs: [ ], type: 'constructor' } ] ).at(registrar.addr('MyPersonalCountry'))

Then anyone who owns any of your tokens can vote on the proposals by doing this:

    var proposalID = 0;
    var position = -1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
    daoInstance.vote.sendTransaction(proposalID, position, {from: eth.accounts[0], gas: 1000000});

    var proposalID = 1;
    var position = 1; // +1 for voting yea, -1 for voting nay, 0 abstains but counts as quorum
    daoInstance.vote.sendTransaction(proposalID, position, {from: eth.accounts[0], gas: 1000000});


Unless you changed the basic parameters in the code, any proposal will have to be debated for at least a week until it can be executed. After that anyone—even a non-citizen—can demand the votes to be counted and the proposal to be executed. The votes are tallied and weighted at that moment and if the proposal is accepted then the ether is sent immediately and the proposal. If the votes end in a tie or the minimum quorum hasn’t been reached, the voting is kept open until the stalemate is resolved. If it loses, then it's archived and cannot be voted again.

    var proposalID = 1;
    daoInstance.executeProposal.sendTransaction(proposalID, {from: eth.accounts[0], gas: 1000000});


If the proposal passed then you should be able to see Bob's ethers arriving on his address:

    web3.fromWei(eth.getBalance(daoInstance.address), "ether") + " ether";
    web3.fromWei(eth.getBalance(registrar.addr("bob")), "ether") + " ether";


Try for yourself:  This is a very simple democracy contract, which could be vastly improved: currently, all proposals have the same debating time and are won by direct vote and simple majority.  Can you change that so it will have some situations, depending on the amount proposed, that the debate might be longer or that it would require a larger majority? Also think about some way where citizens didn't need to vote on every issue and could temporarily delegate their votes to a special representative. You might have also noticed that we added a tiny description for each proposal. This could be used as a title for the proposal or could be a hash of a larger document describing it in detail.

### Let's go exploring!

You have reached the end of this tutorial, but it's just the beginning of a great adventure. Look back and see how much you accomplished: you created a living, talking robot, your own cryptocurrency, raised funds through a trustless crowdfunding and used it to kickstart your own personal democratic organization. 

For the sake of simplicity, we only used the democratic organization you created to send ether around, the native currency of ethereum. While that might be good enough for some, this is only scratching the surface of what can be done. In the ethereum network contracts have all the same rights as any normal user, meaning that your organization could do any of the transactions that you executed coming from your own accounts. 


### What could happen next?

* The greeter contract you created at the beginning could be improved to charge ether for its services and could funnel those funds into the DAO.

* The tokens you still control could be sold on a decentralized exchange or traded for goods and services to fund further develop the first contract and grow the organization.

* Your DAO could own it's own name on the name registrar, and then change where it's redirecting in order to update itself if the token holders approved.

* The organization could hold not only ethers, but any kind of other coin created on ethereum, including assets whose value are tied to the bitcoin or dollar. 

* The DAO could be programmed to allow a proposal with multiple transactions, some scheduled to the future. 
It could also own shares of other DAO's, meaning it could vote on larger organization or be a part of a federation of DAO's

* The Token Contract could be reprogrammed to hold ether or to hold other tokens and distribute it to the token holders, linking therefore the value of the token to the value of other assets, so paying dividends could be accomplished by simply moving funds to the token address

This all means that this tiny society you created could grow, get funding from third parties, pay recurrent salaries, own any kind of cryptoassets and even use crowdsales to fund its activities. All with full transparency, complete accountability and complete immunity from any human interference. While the network lives the contracts will execute exactly the code they were created to execute, without any exception, forever.

So what will your contract be? Will it be a country, a company, a non-profit group? What will your code do? 

That's up to you.