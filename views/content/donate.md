
## Money donations

If you want to contribute with traditional currency, please contact us at [donate@ethereum.org](mailto:donate@ethereum.org)

#### Watch the contract and unicorns


You can use the **Ethereum Wallet** to keep an eye on the foundation donation tip box and to keep your unicorns safe. [Download the latest Wallet release](https://github.com/ethereum/mist/releases) and set up a wallet.


First you might need to add the Unicorn Token to your watch list, as Unicorns are sometimes invisible. Scroll to the bottom and click **Watch Token**. Add the address **0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7** and the remaining information will be loaded automatically. Click *Ok* and your token will be added. Now you need to get one!

![Invisible Unicorns](/images/tutorial/unicorn-token.png)


On the same page, scroll a bit up and click on *Watch contract*. Put **Ethereum Foundation Tip Box** (or anything else) as a name, **0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359** as address and then add this code as the **Interface**:

        [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"},{"name":"description","type":"string"},{"name":"votingDeadline","type":"uint256"},{"name":"executed","type":"bool"},{"name":"proposalPassed","type":"bool"},{"name":"numberOfVotes","type":"uint256"},{"name":"currentResult","type":"int256"},{"name":"proposalHash","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"proposalNumber","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"executeProposal","outputs":[{"name":"result","type":"int256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"memberId","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"numProposals","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"priceOfAUnicornInFinney","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newUnicornPriceInFinney","type":"uint256"},{"name":"newUnicornAddress","type":"address"}],"name":"changeUnicorn","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"members","outputs":[{"name":"member","type":"address"},{"name":"voteWeight","type":"uint256"},{"name":"canAddProposals","type":"bool"},{"name":"name","type":"string"},{"name":"memberSince","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"debatingPeriodInMinutes","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"minimumQuorum","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"targetMember","type":"address"},{"name":"voteWeight","type":"uint256"},{"name":"canAddProposals","type":"bool"},{"name":"memberName","type":"string"}],"name":"changeMembership","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"weiAmount","type":"uint256"},{"name":"JobDescription","type":"string"},{"name":"transactionBytecode","type":"bytes"}],"name":"newProposalInWei","outputs":[{"name":"proposalID","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"majorityMargin","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":true,"inputs":[],"name":"unicornAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"etherAmount","type":"uint256"},{"name":"JobDescription","type":"string"},{"name":"transactionBytecode","type":"bytes"}],"name":"newProposalInEther","outputs":[{"name":"proposalID","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"minimumQuorumForProposals","type":"uint256"},{"name":"minutesForDebate","type":"uint256"},{"name":"marginOfVotesForMajority","type":"int256"}],"name":"changeVotingRules","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"proposalNumber","type":"uint256"},{"name":"supportsProposal","type":"bool"},{"name":"justificationText","type":"string"}],"name":"vote","outputs":[{"name":"voteID","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"proposalNumber","type":"uint256"},{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"checkProposalCode","outputs":[{"name":"codeChecksOut","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"inputs":[{"name":"minimumQuorumForProposals","type":"uint256"},{"name":"minutesForDebate","type":"uint256"},{"name":"marginOfVotesForMajority","type":"int256"},{"name":"congressLeader","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"description","type":"string"}],"name":"ProposalAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"position","type":"bool"},{"indexed":false,"name":"voter","type":"address"},{"indexed":false,"name":"justification","type":"string"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"result","type":"int256"},{"indexed":false,"name":"quorum","type":"uint256"},{"indexed":false,"name":"active","type":"bool"}],"name":"ProposalTallied","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"member","type":"address"}],"name":"MembershipChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"minimumQuorum","type":"uint256"},{"indexed":false,"name":"debatingPeriodInMinutes","type":"uint256"},{"indexed":false,"name":"majorityMargin","type":"int256"}],"name":"ChangeOfRules","type":"event"}]

![Watch the foundation](/images/tutorial/watch-foundation.png)


This will add it to your watch list. Clicking on it will take you to the contract page where you can keep an eye on how the foundation is dealing with these donations. There on the left column you can see all the public information on the contract, like the price of a unicorn token in thousandths of an ether (Also called the "finney"), or the minimum amount of minutes a proposal must stay visible before it can be executed (currently 24 hours).

![Keep an eye on the foundation tip jar](/images/tutorial/foundation-tip-box.png)

The list of members and proposals can be accessed by typing a number on the input below their section titles. For example, type "1" on the input under the **Members** and you'll see that the first member is *Vitalik Buterin* and it's capabilities on this DAO. Some members have voting rights while others are added with only administrative privileges like adding new proposals. You won't find many proposals at first.

*This contract **does not represent all the Ethereum Foundation holdings**, it's a newly created contract to experiment with charity [DAOs](./dao)*.

If you feel like contributing, click on the **Deposit Ether** button on the top and donate any amount you want. If you send over the limit of a unicorn price (currently at 2.014 ether), then you'll get one or more unicorns!

![First ever Unicorn Token Transaction](/images/tutorial/unicorn-is-born.png)

If you want to send your unicorn to someone else, or maybe even to a wallet for safekeeping, it's very easy: just go to the **Send** tab, select the account you own a unicorn from and your unicorn token will appear under your "ether" and any other currency you own.

### Other cryptocurrencies

The [Ethereum Wallet](https://github.com/ethereum/mist/releases) app uses *shapeshift* to convert between any cryptocurrency and ether to any contract. If you are on the Foundation Tip Jar page, just click the button **deposit using bitcoin**. Unicorns will not be sent back to you, though.  


## Other ways to help

There are many other ways to help the Ethereum network. If you like meeting people and organizing events, you can set up a [Meetup near you](http://www.meetup.com/topics/ethereum/). If you prefer staying at home, you can volunteer at answering technical questions at our [Stack Exchange](http://ethereum.stackexchange.com) or helping newcomers at [Reddit forum](https://www.reddit.com/r/ethereum). And you can always help the network by [running a full node client](http://github.com/ethereum/mist/releases/latest) or a [Miner](https://github.com/ethereum/webthree-umbrella/releases/latest) and sharing your statistics at [the network stats dashboard](https://ethstats.net).

But the best way to truly help ethereum adoption is to **go out there and build something awesome!**
