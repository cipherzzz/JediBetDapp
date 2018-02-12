pragma solidity ^0.4.8;
  contract Bet {

    //jedi bet status
    uint constant STATUS_UNKNOWN = 0;
    uint constant STATUS_WINNER = 1;
    uint constant STATUS_LOSE = 2;
    uint constant STATUS_TIE = 3;
    uint constant STATUS_PENDING = 4;

    //game status
    uint constant STATUS_NOT_STARTED = 0;
    uint constant STATUS_STARTED = 2;
    uint constant STATUS_COMPLETE = 3;

    //general status
    uint constant STATUS_ERROR = 4;

    //the 'better' structure
    struct JediBet {
      uint guess;
      address addr;
      uint status;
    }

    //the 'game' structure
    struct Game {
      uint256 betAmount;
      uint outcome;
      uint status;
      JediBet originator;
      JediBet taker;
    }

    //bet status event
    event BetStatus (
      uint gameStatus, 
      uint originatorStatus, 
      address originatorAddress, 
      uint originatorGuess,
      address takerAddress, 
      uint takerStatus, 
      uint takerGuess, 
      uint betAmount, 
      uint actualNumber, 
      uint pot);

    //the game
    Game game;

    //fallback function
    function() public payable {}

    function resetGame() private {
      //reset game
      game.status = STATUS_NOT_STARTED;
      game.outcome = 0;
      game.betAmount = 0;

      game.originator.guess = 0;
      game.originator.addr = 0;
      game.originator.status = 0;

      game.taker.guess = 0;
      game.taker.addr = 0;
      game.taker.status = 0;
    }

    function createBet(uint _guess) public payable {
      game = Game(msg.value, 0, STATUS_STARTED, JediBet(_guess, msg.sender, STATUS_PENDING), JediBet(0, 0, STATUS_NOT_STARTED));
      game.originator = JediBet(_guess, msg.sender, STATUS_PENDING);
      getBetOutcome();
    }

    function takeBet(uint _guess) public payable { 
      //requires the taker to make the same bet amount     
      require(msg.value == game.betAmount);
      game.taker = JediBet(_guess, msg.sender, STATUS_PENDING);
      generateBetOutcome();
      getBetOutcome();
    }

    function payout() public payable {

      checkPermissions(msg.sender);
     
     if (game.originator.status == STATUS_TIE && game.taker.status == STATUS_TIE) {
       game.originator.addr.transfer(game.betAmount);
       game.taker.addr.transfer(game.betAmount);
     } else {
        if (game.originator.status == STATUS_WINNER) {
          game.originator.addr.transfer(game.betAmount*2);
        } else if (game.taker.status == STATUS_WINNER) {
          game.taker.addr.transfer(game.betAmount*2);
        } else {
          game.originator.addr.transfer(game.betAmount);
          game.taker.addr.transfer(game.betAmount);
        }
     }

     resetGame();
     getBetOutcome();
   }

   function getBetOutcome() public {

        //hide the bets and outcome
        uint actualNumber = 0;
        uint takerGuess = 0;
        uint originatorGuess = 0;

        if (game.status == STATUS_COMPLETE) {
            //allow the bets and outcome to be visible
            actualNumber = game.outcome;
            takerGuess = game.taker.guess;
            originatorGuess = game.originator.guess;
        }

        BetStatus (
          game.status, 
          game.originator.status, 
          game.originator.addr, 
          originatorGuess,
          game.taker.addr, 
          game.taker.status, 
          takerGuess, 
          game.betAmount, 
          actualNumber, 
          this.balance);
     }

    function checkPermissions(address sender) view private {
     //only the originator or taker can call this function
     require(sender == game.originator.addr || sender == game.taker.addr);  
    }

    function getBetAmount() public view returns (uint) {
      checkPermissions(msg.sender);
      return game.betAmount;
    }

     function getOriginatorGuess() public view returns (uint) {
       checkPermissions(msg.sender);
       return game.originator.guess;
     }

     function getTakerGuess() public view returns (uint) {
       checkPermissions(msg.sender);
       return game.taker.guess;
     }

     function getPot() public view returns (uint256) {
        checkPermissions(msg.sender);
        return this.balance;
     }

    function generateBetOutcome() private {
        //todo - not a great way to generate a random number but ok for now
        game.outcome = uint(block.blockhash(block.number-1))%10 + 1;
        game.status = STATUS_COMPLETE;

        if (game.originator.guess == game.taker.guess) {
          game.originator.status = STATUS_TIE;
          game.taker.status = STATUS_TIE;
        } else if (game.originator.guess > game.outcome && game.taker.guess > game.outcome) {
          game.originator.status = STATUS_TIE;
          game.taker.status = STATUS_TIE;
        } else {
           if ((game.outcome - game.originator.guess) < (game.outcome - game.taker.guess)) {
             game.originator.status = STATUS_WINNER;
             game.taker.status = STATUS_LOSE;
           } else if ((game.outcome - game.taker.guess) < (game.outcome - game.originator.guess)) {
             game.originator.status = STATUS_LOSE;
             game.taker.status = STATUS_WINNER;
           } else {
             game.originator.status = STATUS_ERROR;
             game.taker.status = STATUS_ERROR;
             game.status = STATUS_ERROR;
           }
        }
    }

    //  function getBetOutcome() public view returns
    //  (uint gameStatus, uint originatorStatus, address originatorAddress, uint originatorGuess,
    //  address takerAddress, uint takerStatus, uint takerGuess, uint betAmount, uint actualNumber, uint pot) 
    //  {
        
    //     //hide the bets and outcome
    //     actualNumber = 0;
    //     takerGuess = 0;
    //     originatorGuess = 0;

    //     if (game.status == STATUS_COMPLETE) {
    //         //allow the bets and outcome to be visible
    //         actualNumber = game.outcome;
    //         takerGuess = game.taker.guess;
    //         originatorGuess = game.originator.guess;
    //     }

    //     gameStatus = game.status;
    //     originatorStatus = game.originator.status;
    //     originatorAddress = game.originator.addr;
    //     takerStatus = game.taker.status;
    //     takerAddress = game.taker.addr;
    //     betAmount = game.betAmount;
    //     pot = this.balance;
    //  }
  }