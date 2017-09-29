pragma solidity ^0.4.16;

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

contract tokenRecipient {
    event receivedEther(address sender, uint amount);
    event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);

    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData){
        Token t = Token(_token);
        require(t.transferFrom(_from, this, _value));
        receivedTokens(_from, _value, _token, _extraData);
    }

    function () payable {
        receivedEther(msg.sender, msg.value);
    }
}

interface Token {
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
}

contract TimeLockMultisig is owned, tokenRecipient {

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

    // Modifier that allows only shareholders to vote and create new proposals
    modifier onlyMembers {
        require(memberId[msg.sender] != 0);
        _;
    }

    /**
     * Constructor function
     *
     * First time setup
     */
    function TimeLockMultisig(address founder, address[] initialMembers, uint minimumAmountOfMinutes) payable {
        if (founder != 0) owner = founder;
        if (minimumAmountOfMinutes !=0) minimumTime = minimumAmountOfMinutes;
        // It’s necessary to add an empty first member
        addMember(0, '');
        // and let's add the founder, to save a step later
        addMember(owner, 'founder');
        changeMembers(initialMembers, true);
    }

    /**
     * Add member
     *
     * @param targetMember address to add as a member
     * @param memberName label to give this member address
     */
    function addMember(address targetMember, string memberName) onlyOwner {
        uint id;
        if (memberId[targetMember] == 0) {
            memberId[targetMember] = members.length;
            id = members.length++;
        } else {
            id = memberId[targetMember];
        }

        members[id] = Member({member: targetMember, memberSince: now, name: memberName});
        MembershipChanged(targetMember, true);
    }

    /**
     * Remove member
     *
     * @param targetMember the member to remove
     */
    function removeMember(address targetMember) onlyOwner {
        require(memberId[targetMember] != 0);

        for (uint i = memberId[targetMember]; i<members.length-1; i++){
            members[i] = members[i+1];
        }
        delete members[members.length-1];
        members.length--;
    }

    /**
     * Edit existing members
     *
     * @param newMembers array of addresses to update
     * @param canVote new voting value that all the values should be set to
     */
    function changeMembers(address[] newMembers, bool canVote) {
        for (uint i = 0; i < newMembers.length; i++) {
            if (canVote)
                addMember(newMembers[i], '');
            else
                removeMember(newMembers[i]);
        }
    }

    /**
     * Add Proposal
     *
     * Propose to send `weiAmount / 1e18` ether to `beneficiary` for `jobDescription`. `transactionBytecode ? Contains : Does not contain` code.
     *
     * @param beneficiary who to send the ether to
     * @param weiAmount amount of ether to send, in wei
     * @param jobDescription Description of job
     * @param transactionBytecode bytecode of transaction
     */
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
        Proposal storage p = proposals[proposalID];
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

    /**
     * Add proposal in Ether
     *
     * Propose to send `etherAmount` ether to `beneficiary` for `jobDescription`. `transactionBytecode ? Contains : Does not contain` code.
     * This is a convenience function to use if the amount to be given is in round number of ether units.
     *
     * @param beneficiary who to send the ether to
     * @param etherAmount amount of ether to send
     * @param jobDescription Description of job
     * @param transactionBytecode bytecode of transaction
     */
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

    /**
     * Check if a proposal code matches
     *
     * @param proposalNumber ID number of the proposal to query
     * @param beneficiary who to send the ether to
     * @param weiAmount amount of ether to send
     * @param transactionBytecode bytecode of transaction
     */
    function checkProposalCode(
        uint proposalNumber,
        address beneficiary,
        uint weiAmount,
        bytes transactionBytecode
    )
        constant
        returns (bool codeChecksOut)
    {
        Proposal storage p = proposals[proposalNumber];
        return p.proposalHash == sha3(beneficiary, weiAmount, transactionBytecode);
    }

    /**
     * Log a vote for a proposal
     *
     * Vote `supportsProposal? in support of : against` proposal #`proposalNumber`
     *
     * @param proposalNumber number of proposal
     * @param supportsProposal either in favor or against it
     * @param justificationText optional justification text
     */
    function vote(
        uint proposalNumber,
        bool supportsProposal,
        string justificationText
    )
        onlyMembers
    {
        Proposal storage p = proposals[proposalNumber]; // Get the proposal
        require(p.voted[msg.sender] != true);           // If has already voted, cancel
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
        Proposal storage p = proposals[proposalNumber];
        uint factor = calculateFactor(uint(p.currentResult), (members.length - 1));
        return p.creationDate + uint(factor * minimumTime *  1 minutes);
    }

    function calculateFactor(uint a, uint b) constant returns (uint factor) {
        return 2**(20 - (20 * a)/b);
    }

    /**
     * Finish vote
     *
     * Count the votes proposal #`proposalNumber` and execute it if approved
     *
     * @param proposalNumber proposal number
     * @param transactionBytecode optional: if the transaction contained a bytecode, you need to send it
     */
    function executeProposal(uint proposalNumber, bytes transactionBytecode) {
        Proposal storage p = proposals[proposalNumber];

        require(now >= proposalDeadline(proposalNumber)                                         // If it is past the voting deadline
            && p.currentResult > 0                                                              // and a minimum quorum has been reached
            && !p.executed                                                                      // and it is not currently being executed
            && checkProposalCode(proposalNumber, p.recipient, p.amount, transactionBytecode));  // and the supplied code matches the proposal...


        p.executed = true;
        assert(p.recipient.call.value(p.amount)(transactionBytecode));

        // Fire Events
        ProposalExecuted(proposalNumber, p.currentResult, proposalDeadline(proposalNumber));
    }
}
