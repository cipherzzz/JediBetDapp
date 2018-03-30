pragma solidity ^0.4.8;
  contract Bet {

    //jedi bet status
    uint8 constant STATUS_UNKNOWN = 0;
    uint8 constant STATUS_WINNER = 1;
    uint8 constant STATUS_LOSE = 2;
    uint8 constant STATUS_TIE = 3;
    uint8 constant STATUS_PENDING = 4;

    //game status
    uint8 constant STATUS_NOT_STARTED = 0;
    uint8 constant STATUS_STARTED = 2;
    uint8 constant STATUS_COMPLETE = 3;

    //general status
    uint8 constant STATUS_ERROR = 4;

    //the 'better' structure
    struct JediBet {
      uint8 guess;
      address addr;
      uint8 status;
      uint betAmount;
    }

    //the 'game' structure
    struct Game {
      uint betAmount;
      uint8 outcome;
      uint8 status;
      JediBet originator;
      JediBet taker;
    }

    //bet status event
    event BetStatus (
      uint8 gameStatus, 
      uint8 originatorStatus, 
      address originatorAddress, 
      uint8 originatorGuess,
      address takerAddress, 
      uint8 takerStatus, 
      uint8 takerGuess, 
      uint betAmount, 
      uint8 actualNumber, 
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
      game.originator.status = STATUS_NOT_STARTED;

      game.taker.guess = 0;
      game.taker.addr = 0;
      game.taker.status = STATUS_NOT_STARTED;
    }

    function createBet(uint8 _guess) public payable {
      require(game.status == STATUS_NOT_STARTED 
                && game.originator.status == 0 
                && game.taker.status == 0);    
      game = Game(msg.value, 0, STATUS_STARTED, JediBet(_guess, msg.sender, STATUS_PENDING, 0), JediBet(0, 0, STATUS_NOT_STARTED, 0));
      game.originator = JediBet(_guess, msg.sender, STATUS_PENDING, msg.value);
      getBetOutcome();
    }

    function takeBet(uint8 _guess) public payable { 
      require(game.status == STATUS_STARTED 
                && game.originator.status == STATUS_PENDING 
                && game.taker.status == STATUS_NOT_STARTED);
      game.taker = JediBet(_guess, msg.sender, STATUS_PENDING, msg.value);
      generateBetOutcome();
      getBetOutcome();
    }

    function payout() public payable {

     checkPermissions(msg.sender);
     require(game.status == STATUS_COMPLETE 
                && game.originator.status > 0 
                && game.originator.status < 4
                && game.taker.status > 0 
                && game.taker.status < 4);
     
     uint256 origAmt = game.originator.betAmount;
     uint256 takerAmt = game.taker.betAmount;
     game.originator.betAmount = 0;
     game.taker.betAmount = 0;
     
     resetGame();
     getBetOutcome();
     
     if (game.originator.status == STATUS_TIE && game.taker.status == STATUS_TIE) {
       game.originator.addr.transfer(origAmt);
       game.taker.addr.transfer(takerAmt);
     } else {
        if (game.originator.status == STATUS_WINNER) {
          game.originator.addr.transfer(origAmt*2);
        } else if (game.taker.status == STATUS_WINNER) {
          game.taker.addr.transfer(takerAmt*2);
        } else {
          game.originator.addr.transfer(origAmt);
          game.taker.addr.transfer(takerAmt);
        }
     }
   }

   function getBetOutcome() private {

        //hide the bets and outcome
        uint8 actualNumber = 0;
        uint8 takerGuess = 0;
        uint8 originatorGuess = 0;

        if (game.status == STATUS_COMPLETE) {
            //allow the bets and outcome to be visible
            actualNumber = game.outcome;
            takerGuess = game.taker.guess;
            originatorGuess = game.originator.guess;
        }

        emit BetStatus (
          game.status, 
          game.originator.status, 
          game.originator.addr, 
          originatorGuess,
          game.taker.addr, 
          game.taker.status, 
          takerGuess, 
          game.betAmount, 
          actualNumber, 
          game.betAmount*2);
     }

    function checkPermissions(address sender) view private {
     //only the originator or taker can call this function
     require(sender == game.originator.addr || sender == game.taker.addr);  
    }

    function getBetAmount() private view returns (uint) {
      checkPermissions(msg.sender);
      return game.betAmount;
    }

     function getOriginatorGuess() private view returns (uint) {
       checkPermissions(msg.sender);
       return game.originator.guess;
     }

     function getTakerGuess() private view returns (uint) {
       checkPermissions(msg.sender);
       return game.taker.guess;
     }

     function getPot() private view returns (uint256) {
        checkPermissions(msg.sender);
        return game.betAmount*2;
     }

    function generateBetOutcome() private {
        //todo - not a great way to generate a random number but ok for now
        game.outcome = uint8(block.blockhash(block.number-1))%10 + 1;
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
  }