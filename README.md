# A Jedi’s guide to Ethereum — Part 4(web3)

In our [last
article](https://medium.com/@cipherz/a-jedis-guide-to-ethereum-part-3b-remix-1b8d98d909d4),
we took a little detour and explored the Remix IDE as a way to interact and test
our betting smart contract. In this article, we will add a simple web ui to our
smart contract and create a *dApp *or *decentralized application*. If you
recall, in a [previous
article](https://medium.com/@cipherz/a-jedis-guide-to-ethereum-part-3-67007e1876f3),
we used a tool named *truffle *to create our smart contract and associated unit
tests. We will go back to truffle and use another tool of theirs named, *boxes*.
Boxes are essentially boilerplate apps that you may use to bootstrap your own
application using a common toolset for Ethereum-based apps. We will be building
our app using React and the web3 javascript client for the Ethereum blockchain.
Truffle has a box for this named, *React *so let’s get started.

#### Truffle Box

Run the following in a directory of your choice. *If you have not installed
truffle yet, refer to *[this
article](https://medium.com/@cipherz/a-jedis-guide-to-ethereum-part-3-67007e1876f3)*
for help.*

    mkdir JediBet
    cd JediBet
    truffle unbox React

The *unbox *command will take a while… When it is done, you should see a the
following:

    Downloading...

    Unpacking...
    Setting up...
    Unbox successful. Sweet!

    Commands:
    Compile:              truffle compile
    Migrate:              truffle migrate
    Test contracts:       truffle test
    Test dapp:            npm test
    Run dev server:       npm run start
    Build for production: npm run build

We have used the *compile*, *migrate*, and *test* commands before when we
originally wrote our [first smart
contract](https://medium.com/@cipherz/a-jedis-guide-to-ethereum-part-3-67007e1876f3).
We see some new commands now related to the dApp we are building. We are going
to take a look at this boilerplate dApp in our browser, but first let’s compile
and deploy the smart contract that was just *unboxed. *If you recall, *truffle
*has its own non-mined blockchain that we can use to speed up development. Let’s
start that up and compile and migrate the contract.

    truffle develop

Once it starts up, go ahead and compile the contract

    truffle(develop)> compile

And now deploy to the blockchain

    truffle(develop)> migrate

We now have our contract deployed to our test blockchain. Now, go ahead and open
up a new terminal and navigate to the project root again. Run the following
command to startup the dApp in dev mode to view in your browser.

    npm run dev

This command should start up the dApp and eventually open a browser window
pointed at [http://localhost:3000/](http://localhost:3000/). You will notice
that the webpage says:

*If your contracts compiled and migrated successfully, below will show a stored
value of 5 (by default).*

But, the value actually showing on the page is **0**

*The stored value is: 0*

Obviously, there is something wrong, but the answer is not totally obvious. The
contract is not actually being accessed because there is not an account sending
a transaction with gas to power it. If you recall, smart contracts must be given
gas in order to run as a part of the Ethereum ecosystem. So, how do we power the
contract to get the desired value of **5**?

#### MetaMask

We need some way to inject an Ethereum account into the browser session — we
will use the Chrome extension of MetaMask to do just that. Add the MetaMask
extension or open it if you already have it. It should show up in your upper
right hand corner of Chrome. Once it’s open, click the dropdown in the upper
right left hand corner to change the network it is connected to and select
*Custom RPC.* We are going to connect our metamask plugin to the truffle
*testnet* blockchain we started when we ran the command *truffle develop. *In
the dialog, enter [http://localhost:9545](http://localhost:9545/)* *for the
custom RPC url and click *Save.* Select your new network as shown below:

We are now going to import a test account into MetaMask to power our contract.
Go back to the terminal window that is running our test blockchain, you should
see some public and private keys at the very top.

Let’s copy the first private key into the clipboard and go back to MetaMask.
Enter your password if you need to and click on the person icon in the upper
right hand corner and select *Import Account. *Select, *Private Key *as the type
and paste the private key in the textfield and click *Import. *Go back to our
dApp at [http://localhost:3000](http://localhost:3000/) and refresh the page.
You should now see MetaMask prompt you to confirm sending a transaction to the
contract — something similar to below.

Click *Submit *and you will notice the value on our sample contract is now
coming through correctly.

*The stored value is: 5*

MetaMask is an indispensable tool that allows us to cryptographically sign
transactions with our account from within our browser. This is fundamental for
interacting with Ethereum dApps and we will use these same concepts when
interacting with our betting dApp as well.

*****

#### Project Setup

We ultimately want our existing smart contract, *Bet.sol* and its test,
*testBet.js *to be housed in this new truffle dApp, so let’s copy the *Bet.sol
*file into our new *contracts *directory and the *testBet.js* into its *test
*directory. Go ahead and remove the *tests* from the previous contract and the
*SimpleStorage.sol *from *contracts*.Your dApp directory should look like this:

Modify the *migrations/2_deploy_contracts.js* to refer to *Bet.sol* instead of
*SimpleStorage.sol.*

Delete the */build* directory and go through the migration process again…

    truffle develop

Once it starts up, go ahead and compile the contract

    truffle(develop)> compile

And now deploy to the blockchain

    truffle(develop)> migrate

We now have our betting smart contract deployed and are ready to start on our
web3 interface — woo-hoo!

*****

#### Building the UI

Our *truffle box *framework gave us the beginnings of a React project with CSS
and a component in the *App.js *file. We will be building on this by adding a
*Bet.js* component to handle the various states of our Bet. In addition to this,
we will be handling a more complicated flow than the boilerplate box template
gave us.

**App.js**

Notice how we wait until web3 has initialized before we begin interacting with
it and configuring our contract provider. Also note that *jeditBet *can be used
by all of our other contract action calls for simplicity. We pass our contract
actions into the *BetComponent *in order for it to be stateless and to let our
parent component handle the blockchain interaction. Our syntax and usage with
the contract is similar and compact for our *placeBet*, *takeBet*, and
*payoutBet* actions.

**Bet.js**

Notice how the *Bet *component is completely driven by the props passed in and
generates an internal state for its own renders based on the *gameState*.

*****

#### Running the dApp

The full source code is available
[here](https://github.com/cipherzzz/JediBetDapp) and it is recommended that you
clone this repo to get started before migrating the
[JediBet](https://github.com/cipherzzz/JediBet) contract into a *truffle* *box*
dApp yourself. Simply clone the
[JediBetDapp](https://github.com/cipherzzz/JediBetDapp) to a directory and go
through the setup described in this article for:

* Starting truffle develop CLI
* Setting up MetaMask test accounts
* Compiling and migrating the contract
* Starting the web server

#### What should happen if you did everything right

When you startup the web server, it should open a browser window with the
initial state of the dApp in the *Place Bet *mode as shown below.

#### Place Bet

Enter a bet *amount* and a *guess *and click *Place Bet. *A MetaMask window will
show up for you to confirm the transaction. Check that the value in the MetaMask
window is equal to the value that you entered into the bet *amount* field.

#### Take Bet

You can switch accounts in MetaMask to simulate an actual bet since the bet
taker will have a different account than the bet originator. Once you do this,
you can refresh the dApp page and you should see something similar:

Enter a *guess* and click *Take Bet. *Verify that the bet *amount *in the form
is the same as the MetaMask dialog.

#### Payout Bet

After you have taken the bet, the smart contract will determine the winner and
show you the results. Either the bet originator or the bet taker can *payout*
the winnings. Click the *Payout Bet *button and confirm the MetaMask
transaction.

*Note: If you get an Out of Gas error, up the gas to something like 100000 and
try again. This contract is not optimized for gas yet.*

Once the bet has been paid out, the contract will reset itself to a default
state of accepting another bet.

#### **Troubleshooting**

**MetaMask** — I have found it helpful to reset my test account in MetaMask if I
am getting weird issues related to *nonces *and such. While in your test
account, click the hamburger button to the right and click *Settings. *Scroll
down and click* Reset Account*.

**Truffle** — If you change your contract and are not seeing them reflected in
the truffle test blockchain, I have found the following command helpful for
development.

    truffle(develop)> migrate --reset

Worst case, is you can delete the build directory of your truffle dApp and

    truffle(develop)> compile

    truffle(develop)> migrate

#### Summary

Ethereum has a massive head start in the *smart contract *space. The
availability of tools such as *geth*, *truffle, web3, Remix, MetaMask *are huge
advantages to bringing Ethereum-based products to the market. If the Ethereum
team are able to deliver on their promises to scale the platform, I believe 2018
will be a great year for Ethereum. I hope you enjoyed this journey and learned a
ton — I know that I did!

* [Ethereum](https://medium.com/tag/ethereum?source=post)
* [Truffle](https://medium.com/tag/truffle?source=post)
* [Metamask](https://medium.com/tag/metamask?source=post)
* [Web3](https://medium.com/tag/web3?source=post)
* [Dapps](https://medium.com/tag/dapps?source=post)

### [CipherZ](https://medium.com/@cipherz)

