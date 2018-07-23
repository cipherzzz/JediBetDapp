import React, { Component } from "react";
import {Digital} from 'react-activity';

import "../App.css";
import "../css/pure-min.css";

import fail from "../../public/images/fail.gif";
import place from "../../public/images/startBet.gif";
import take from "../../public/images/takeBet.gif";
import payout from "../../public/images/payout.gif";
import waiting from "../../public/images/waiting.gif";

//jedi bet status
const STATUS_WINNER = 1;
const STATUS_LOSE = 2;
const STATUS_TIE = 3;
const STATUS_PENDING = 4;

//game status
const STATUS_NOT_STARTED = 0;
const STATUS_STARTED = 1;
const STATUS_COMPLETE = 2;

//general status for game or player
const STATUS_ERROR = 3;

export default class Bet extends Component {

    constructor(props) {
        super(props);
        this.state = this.generateStateFromProps(props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps !== this.props) {
            this.setState(this.generateStateFromProps(newProps));
        }
    }

    generateStateFromProps(props) {
        return {
            taker: { guess: Number(props.bet.takerGuess), addr: this.getCurrentAccountForStatus(props.bet.gameStatus, props.bet.taker, false), status: props.bet.takerStatus },
            originator: { guess: Number(props.bet.originatorGuess), addr: this.getCurrentAccountForStatus(props.bet.gameStatus, props.bet.originator, true), status: props.bet.originatorStatus },
            amount: Number(props.bet.betAmount),
            gameStatus: Number(props.bet.gameStatus),
            actualNumber: Number(props.bet.actualNumber),
            pot: Number(props.bet.pot),
            loading: props.loading,
            error: props.error
        };
    }

    //if the bet has not started, the account will be the originator
    //if the bet has started the account will be the taker
    getCurrentAccountForStatus(gameStatus, acct, isOriginator) {
        let account = null;
        switch (gameStatus) {
            case STATUS_NOT_STARTED:
                account = isOriginator ? this.props.account : acct; //acct is not stored in contract yet
                break;

            case STATUS_STARTED:
                account = isOriginator ? acct : this.props.account; //acct is not stored in contract yet
                break;

            case STATUS_COMPLETE: //accts are stored in contract
                account = acct;
                break;

            default:
                account = acct;
                break;
        }

        return account;
    }

    getEmptyForZero(value) {
        if (value === 0) {
            return '';
        } else { return value; }
    }

    generateOutcomeDescription() {
        return "The bet originator " + this.generateDescriptionForStatus(this.state.originator) + " the bet" +
            " while the bet taker " + this.generateDescriptionForStatus(this.state.taker) +
            ". Please click the 'Payout Winnings' button to settle accounts.";
    }

    generateDescriptionForStatus(gambler) {
        let description = "Error";
        switch (gambler.status) {
            case STATUS_WINNER:
                description = "Won";
                break;

            case STATUS_LOSE:
                description = "Lost";
                break;

            case STATUS_TIE:
                description = "Tied";
                break;

            case STATUS_PENDING:
                description = "Pending";
                break;

            default:
                description = "Error";
                break;
        }

        return description;
    }

    generateTakerStatusDescription() {
        return "Nobody wins";
    }

    onChangeOriginatorGuess(e) {
        this.setState({ originator: { guess: e.target.value } });
    }

    onChangeTakerGuess(e) {
        this.setState({ taker: { guess: e.target.value } });
    }

    onChangeBetAmount(e) {
        this.setState({ amount: e.target.value });
    }


    renderError() {
        return (
            <div>
                <img src={fail} alt="error..." />
                <div><h2>Our apologies, Jedi Bet is not available at this time</h2><Digital size={20} /></div>
            </div>); 
    }

    renderLoading(message, gif) {
    return (
        <div>
            <img src={gif} alt="loading..." />
            <div><h2>{message}</h2><Digital size={20} /></div>
        </div>); 
    }

    placeBet() {
        this.props.placeBet(this.state.originator.guess, this.state.amount);
    }

    takeBet() {
        this.props.takeBet(this.state.taker.guess);
    }

    payoutBet() {
        this.props.payoutBet();
    }

    isValid() {
        let valid
        switch (this.state.gameStatus) {
            case STATUS_NOT_STARTED:
                valid = 
                    this.getEmptyForZero(this.state.originator.addr) !== ''  && 
                    this.getEmptyForZero(this.state.amount) !== '' &&
                    this.getEmptyForZero(this.state.originator.guess)
                break;

            case STATUS_STARTED:
                valid = 
                    this.getEmptyForZero(this.state.originator.addr) !== '' && 
                    this.getEmptyForZero(this.state.taker.addr) !== ''  && 
                    this.getEmptyForZero(this.state.amount) !== '' &&
                    this.getEmptyForZero(this.state.taker.guess)
                break;

            default:
                valid = true
                break;
        }
        return valid
    }

    renderPlaceBet() {
        return (
            <div>
                <h2>Place Bet</h2>
                <p>Enter an amount and a guess to place a new bet...</p>
                <div className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Your Address</label>
                            <input id="name" type="text"
                                value={this.state.originator.addr}
                                disabled="true" />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Bet Amount</label>
                            <input id="name" type="text" placeholder="Bet amount in Eth"
                                onChange={this.onChangeBetAmount.bind(this)}
                                value={this.getEmptyForZero(this.state.amount)} />
                            <span className="pure-form-message-inline">This is a required field.</span>
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Guess</label>
                            <input id="name" type="text" placeholder="Guess (1 to 10)"
                                onChange={this.onChangeOriginatorGuess.bind(this)}
                                value={this.getEmptyForZero(this.state.originator.guess)} />
                            <span className="pure-form-message-inline">This is a required field.</span>
                        </div>

                        <div className="pure-controls">
                            <button
                                className="pure-button pure-button-primary"
                                disabled={!this.isValid()}
                                onClick={this.placeBet.bind(this)}>Place Bet</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }

    renderBetOutcome() {
        return (
            <div>
                <h2>Bet Outcome</h2>
                <p>{this.generateOutcomeDescription()}</p>
                <div className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Bet Amount</label>
                            <input id="name" type="text" disabled="true"
                                value={this.getEmptyForZero(this.state.amount)} />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Winnings</label>
                            <input id="name" type="text" disabled="true"
                                value={this.getEmptyForZero(this.state.pot)} />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Actual Number</label>
                            <input id="name" type="text" disabled="true"
                                value={this.getEmptyForZero(this.state.actualNumber)} />
                        </div>
                    </fieldset>
                </div>
                <div className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Originator</label>
                            <input id="name" type="text"
                                value={this.state.originator.addr}
                                disabled="true" />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Originator Guess</label>
                            <input id="name" type="text" disabled="true"
                                value={this.getEmptyForZero(this.state.originator.guess)} />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Originator Status</label>
                            <input id="name" type="text" disabled="true"
                                value={this.generateDescriptionForStatus(this.state.originator)} />
                        </div>
                    </fieldset>
                </div>
                <div className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Taker</label>
                            <input id="name" type="text"
                                value={this.state.taker.addr}
                                disabled="true" />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Taker Guess</label>
                            <input id="name" type="text" disabled="true"
                                value={this.getEmptyForZero(this.state.taker.guess)} />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Taker Status</label>
                            <input id="name" type="text" disabled="true"
                                value={this.generateDescriptionForStatus(this.state.taker)} />
                        </div>

                        <div className="pure-controls">
                            <button className="pure-button pure-button-primary" onClick={this.payoutBet.bind(this)}>Payout Winnings</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }

    renderTakeBet() {
        return (
            <div>
                <h2>Take Bet</h2>
                <p>Enter a guess and verify amount to take existing bet...</p>
                <div className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Placed By</label>
                            <input id="name" type="text"
                                value={this.state.originator.addr}
                                disabled="true" />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Bet Amount</label>
                            <input id="name" type="text" placeholder="Bet amount in Eth"
                                value={this.getEmptyForZero(this.state.amount)}
                                disabled="true" />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Your Address</label>
                            <input id="name" type="text"
                                value={this.state.taker.addr}
                                disabled="true" />
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Guess</label>
                            <input id="name" type="text" placeholder="Guess (1 to 10)"
                                onChange={this.onChangeTakerGuess.bind(this)}
                                value={this.getEmptyForZero(this.state.taker.guess)} />
                            <span className="pure-form-message-inline">This is a required field.</span>
                        </div>

                        <div className="pure-controls">
                            <button className="pure-button pure-button-primary"
                            disabled={!this.isValid()} 
                            onClick={this.takeBet.bind(this)}>Take Bet</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }



    render() {

        let errorView = this.renderLoading("Jedi Bet is having problems...", fail);;
        if(this.state.error) {
            return errorView; 
        }

        let placeLoading = this.renderLoading("Placing bet you are, wait you must...", place);
        let takeLoading = this.renderLoading("I'll take that bet...", take);
        let payoutLoading = this.renderLoading("Sending credits post haste...", payout);
        let waitLoading = this.renderLoading("Waiting for a valid MetaMask account...", waiting);

        let view = null;

        switch (this.state.gameStatus) {
            case STATUS_NOT_STARTED:
                view = this.state.loading?placeLoading:this.renderPlaceBet();
                break;

            case STATUS_STARTED:
                view = this.state.loading?takeLoading:this.renderTakeBet();
                break;

            case STATUS_COMPLETE:
                view = this.state.loading?payoutLoading:this.renderBetOutcome();
                break;

            case STATUS_ERROR:
                view = errorView;
                break;

            default:
                view = waitLoading
                break;
        }

        return view;
    }
}