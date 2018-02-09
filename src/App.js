import React, { Component } from "react";
import Bet from "../build/contracts/Bet.json";
import getWeb3 from "./utils/getWeb3";

import BetComponent from './component/Bet';

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

const contract = require("truffle-contract");
const jediBet = contract(Bet);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bet: {},
      web3: null,
    };
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
        });

        // Instantiate contract once web3 provided.
        this.getBet();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  setupListener() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      jediBet
        .deployed()
        .then(instance => {
          var betStatus = instance.BetStatus();
          betStatus.watch(function (error, result) {
            if (!error) {
              console.log(JSON.stringify(error));
            } else {
              console.log(JSON.stringify(result));
            }
          });
        })
        .catch((error => console.log("Error:" + JSON.stringify(error))));
    });
  }

  getAccount() {
    if (this.state.web3) {
      return this.state.web3.eth.accounts[0];
    } else { return ""; }
  }

  getBet() {
    //get web3 provider session
    jediBet.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var jediBetInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      jediBet
        .deployed()
        .then(instance => {
          jediBetInstance = instance;
          return jediBetInstance.getBetOutcome({ from: accounts[0] });
        })
        .then(result => {
          return this.setState({
            bet: {
              gameStatus: Number(result[0]),
              originator: result[2],
              originatorGuess: Number(result[3]),
              originatorStatus: Number(result[1]),
              taker: result[4],
              takerGuess: Number(result[6]),
              takerStatus: Number(result[5]),
              betAmount: this.state.web3.fromWei(Number(result[7])),
              actualNumber: Number(result[8]),
              pot: this.state.web3.fromWei(Number(result[9]))
            }
          });
        })
        .catch((error => console.log("Error:" + JSON.stringify(error))));
    });
  }

  placeBet(guess, amount) {
    //get web3 provider session
    jediBet.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var jediBetInstance;

    // this.setState({
    //   bet: {
    //     gameStatus: 2,
    //     originator: "0x1111111",
    //     originatorGuess: guess,
    //     originatorStatus: 0,
    //     taker: "",
    //     takerGuess: 0,
    //     takerStatus: 0,
    //     betAmount: amount,
    //     actualNumber: 5,
    //     pot: amount
    //   }
    // });

    this.state.web3.eth.getAccounts((error, accounts) => {
      jediBet
        .deployed()
        .then(instance => {
          jediBetInstance = instance;
          return jediBetInstance.createBet(guess, { from: accounts[0], value: this.state.web3.toWei(amount, "ether") });
        })
        .then(result => {
          this.getBet();
        })
        .catch((error => console.log("Error:" + JSON.stringify(error))));
    });
  }

  takeBet(guess) {
    //get web3 provider session
    jediBet.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var jediBetInstance;

    // this.setState({
    //   bet: {
    //     gameStatus: 3,
    //     taker: "0x22222",
    //     takerGuess: guess,
    //     takerStatus: 0,
    //   }
    // });

    this.state.web3.eth.getAccounts((error, accounts) => {
      jediBet
        .deployed()
        .then(instance => {
          jediBetInstance = instance;
          return jediBetInstance.takeBet(guess, { from: accounts[0], value: this.state.web3.toWei(this.state.bet.betAmount, "ether") });
        })
        .then(result => {
          this.getBet();
        })
        .catch((error => console.log("Error:" + JSON.stringify(error))));
    });
  }

  payoutBet() {
    //get web3 provider session
    jediBet.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var jediBetInstance;

    // this.setState({
    //   bet: {
    //     gameStatus: 3,
    //     taker: "0x22222",
    //     takerGuess: guess,
    //     takerStatus: 0,
    //   }
    // });

    this.state.web3.eth.getAccounts((error, accounts) => {
      jediBet
        .deployed()
        .then(instance => {
          jediBetInstance = instance;
          return jediBetInstance.payout({ from: accounts[0] });
        })
        .then(result => {
          this.getBet();
        })
        .catch((error => console.log("Error:" + JSON.stringify(error))));
    });
  }

  render() {

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Jedi Bet
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Feeling Lucky?</h1>
              <p>
                The Jedi Bet smart contract will generate a secret number between 1 and 10.
                <br />The gamblers then attempt to guess the number without going over it and place bets accordingly.
                <h3>Rules</h3>
                <ul>
                  <li>The originator of the bet decides the bet size for both parties. <br />ie. when a gambler originates the bet, he/she sets the bet amount that the gambler that takes the bet will have to match in order to participate.</li>
                  <li>A bet cannot be greater than the generated number. <br />If a gambler's guess is greater than the generated number, they will lose the bet. Unless the other gambler also overshot the number, in which case the pot would be split evenly.</li>
                  <li>If both gamblers guess the same number, the pot is split.</li>
                  <li>The winner will receive the amount they bet and the other gambler's bet(minus gas fees).</li>
                </ul>
              </p>
              <BetComponent
                account={this.getAccount()}
                bet={this.state.bet}
                placeBet={(guess, amount) => { this.placeBet(guess, amount) }}
                takeBet={(guess) => { this.takeBet(guess) }}
                payoutBet={() => { this.payoutBet() }}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
