"use strict";


let canPlay = true;
const numDecks = 6;
let shoe = [];
const cutCard = 16;
const pHand = [], bHand = [];
let pValue, bValue;

//Game Mechanics

function getGameOutcome(shoe_get) {
    shoe = shoe_get;
    drawInitialCards();
    return determineWinner();
    
}


function calcHandValue(hand) {
    let value = 0;
    hand.forEach((card) => { value += calcValue(card); })
    return value % 10;
}

function calcValue(card) {
    let v = card[0];
    if (v == 'A') { return 1; }
    else if (['K', 'Q', 'J', '1'].includes(v)) { return 10; }
    else { return parseInt(v); }
}

function draw(shoe) {
    //Replace create deck with procedurally generated card drawing
    return shoe.pop();
}

function drawCard(hand) {
    let card = draw(shoe);
    hand.push(card);
}


//Game logic
//Draws first 2 cards for player and banker
function drawInitialCards() {
    if (shoe.length < cutCard) { startGame(); }
    if (canPlay == true) {
        canPlay = false;
        pHand.length = bHand.length = 0;
        pValue = bValue = 0;

        drawCard(pHand);
        drawCard(pHand);
        drawCard(bHand);
        drawCard(bHand);
        pValue = calcHandValue(pHand);
        bValue = calcHandValue(bHand);
        playGame();

    }
}

function playGame() {
    //Natural win conditions
    if (pValue == 9 || bValue == 9 || pValue == 8 || bValue == 8) {
        //Need to find alternative for setTimeout
        
    } else {//Conditions for player drawing third card
        if (pValue < 6) {
            drawCard(pHand);
            pValue = calcHandValue(pHand);
            thirdBankerCard();
            bValue = calcHandValue(bHand);
        
        } else if (bValue < 6) {//Conditions for Banker third card if player stands
            drawCard(bHand);
            bValue = calcHandValue(bHand);
        }
    }
}

//Checks conditions for drawing banker's third based on player's third card
function thirdBankerCard() {
    let p3 = calcValue(pHand[2]);
    if ((bValue < 3) || (bValue == 3 && p3 != 8) || (bValue == 4 && p3 > 1 && p3 < 8) || (bValue == 5 && p3 > 3 && p3 < 8) || (bValue == 6 && p3 > 5 && p3 < 8)) {
        drawCard(bHand);
    } else { return; }
}

function calcPayout(outcome,betOutcome,bet){
    let payout;
    if(betOutcome!=outcome){
        payout=-bet;
    }else{
      if(betOutcome=='P'){
          payout=bet;
      }else if(betOutcome=='T'){
          payout=bet*8;
      }else{
          payout=bet*0.95;
        }
    }
    return payout
  }

function determineWinner() {
    var outcome = "";
    if (pValue == bValue) {
        outcome = 'T';
    } else { 
        if (pValue < bValue) {
            outcome = 'B'
        }else{
            outcome = 'P'; 
        }
    }

    
    canPlay = true;
    return {
        outcome:outcome,
        pHand:pHand,
        bHand:bHand
    }
}

module.exports = {
    getGameOutcome:getGameOutcome,
    calcPayout:calcPayout
}
