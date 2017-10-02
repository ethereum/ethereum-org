pragma solidity ^0.4.16;

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

    /**
     * Constructor function
     */
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

    /**
     * Vote for an address
     *
     * Send your vote weight to another address
     *
     * @param nominatedAddress the destination address receiving the sender's vote
     */
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

    /**
     * Perform Executive Action
     *
     * @param target the destination address to interact with
     * @param valueInWei the amount of ether to send along with the transaction
     * @param bytecode the data bytecode for the transaction
     */
    function execute(address target, uint valueInWei, bytes32 bytecode) {
        require(msg.sender == appointee                             // If caller is the current appointee,
            && !underExecution //                                   // if the call is being executed,
            && bytes4(bytecode) != bytes4(sha3(forbiddenFunction))  // and it's not trying to do the forbidden function
            && numberOfDelegationRounds >= 4);                     // and delegation has been calculated enough

        underExecution = true;
        assert(target.call.value(valueInWei)(bytecode)); // Then execute the command.
        underExecution = false;
    }

    /**
     * Calculate Votes
     *
     * Go thruogh all the delegated vote logs and tally up each address's total rank
     */
    function calculateVotes() returns (address winner) {
        address currentWinner = appointee;
        uint currentMax = 0;
        uint weight = 0;
        DelegatedVote storage v = delegatedVotes[0];

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
