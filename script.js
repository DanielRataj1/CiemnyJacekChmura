let dealerSum = 0;
let playerSum = 0;

let dealerAceCount = 0;
let playerAceCount = 0;

let hidden;
let deck;

let canHit = true; // pozwala graczowi dobrać kartę jeśli yourSum <= 21

window.onload = function(){
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let number = ["A","2","3","4","5","6","7","8","9","10","J","D","K"]; /// wszystkie karty 
    let colour = ["K","P","C","T"]; /// K - karo, P - pik, C - czerwo, T - trefl
    deck = [];
 //   let karty = ["AK", "2K"...];  
   
 for (let i = 0; i < colour.length; i++) {
        for (let j = 0; j < number.length; j++) {
            deck.push(number[j] + "-" + colour[i]);
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;

    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./karty_OG_Projcet/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);
    
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./karty_OG_Projcet/" + card + ".png";
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }

    console.log(playerSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("reset").addEventListener("click", reset);
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("dealer-sum").innerText = "?";
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./karty_OG_Projcet/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }

    while (dealerSum > 21 && dealerAceCount > 0) {
        dealerSum -= 10;
        dealerAceCount -= 1;
    }

    // Update the player's total display
    document.getElementById("player-sum").innerText = playerSum;

    if (playerSum > 21) {
        canHit = false;
        let message = "Przegrałeś!";
        document.getElementById("result").innerText = message;
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("hidden").src = "./karty_OG_Projcet/" + hidden + ".png";
        document.getElementById("result").innerText = message;
    }
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];
    
    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
        }
        return parseInt(value);
    }

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    playerSum = reduceAce(playerSum, playerAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./karty_OG_Projcet/" + hidden + ".png";

    let message = "";
    if (playerSum > 21) { 
        message = "Przegrałeś!"
    }
    else if (dealerSum > 21){
        message = "Wygrałeś!";
    }
    // gracz i dealer mają sume kart mniejsza na 21 
    else if (playerSum == dealerSum) {
        message = "Remis!";
    }
    else if (playerSum > dealerSum){
        message = "Wygrałeś!";
    }
    else if (playerSum < dealerSum){
        message = "Przegrałeś!";
    }
    
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("result").innerText = message;
}

function reset() {
    location.reload();
}