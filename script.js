let dealerSum = 0;
let playerSum = 0;
let dealerAceCount = 0;
let playerAceCount = 0;
let hidden;
let deck;
let canHit = true;
let balance = 1000; // Początkowy balans
let currentBet = 0; // Aktualna stawka

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startPage = document.getElementById("start-page");
    const gameSection = document.getElementById("game");

    startButton.addEventListener("click", () => {
        currentBet = parseInt(document.getElementById("bet").value);
        if (currentBet > balance || currentBet <= 0) {
            alert("Nieprawidłowa stawka! Wybierz wartość od 1 do " + balance);
            return;
        }
        balance -= currentBet;
        updateBalance();
        startPage.style.display = "none";
        gameSection.style.display = "block";
        document.getElementById("current-bet").innerText = currentBet;
        buildDeck();
        shuffleDeck();
        startGame();
    });

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("reset").addEventListener("click", reset);
});

function buildDeck() {
    let number = ["A","2","3","4","5","6","7","8","9","10","J","D","K"];
    let colour = ["K","P","C","T"];
    deck = [];
    for (let i = 0; i < colour.length; i++) {
        for (let j = 0; j < number.length; j++) {
            deck.push(number[j] + "-" + colour[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./karty_OG_Projcet/" + card + ".png";
        cardImg.classList.add("card");
        cardImg.style.animation = "deal 0.5s ease-in-out"; // Animacja rozdawania
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./karty_OG_Projcet/" + card + ".png";
        cardImg.classList.add("card");
        cardImg.style.animation = "deal 0.5s ease-in-out"; // Animacja rozdawania
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }

    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("dealer-sum").innerText = "?";
}

function hit() {
    if (!canHit) return;

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./karty_OG_Projcet/" + card + ".png";
    cardImg.classList.add("card");
    cardImg.style.animation = "hit 0.5s ease-in-out"; // Animacja dobierania
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    playerSum = reduceAce(playerSum, playerAceCount);
    document.getElementById("player-sum").innerText = playerSum;

    if (playerSum > 21) {
        canHit = false;
        endGame("Przegrałeś!");
    }
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    playerSum = reduceAce(playerSum, playerAceCount);
    canHit = false;

    let hiddenCard = document.getElementById("hidden");
    hiddenCard.style.animation = "flip 0.5s ease-in-out"; // Animacja odkrywania karty
    hiddenCard.src = "./karty_OG_Projcet/" + hidden + ".png";
    document.getElementById("dealer-sum").innerText = dealerSum;

    let message = "";
    let multiplier = 1;

    if (playerSum > 21) {
        message = "Przegrałeś!";
    } else if (dealerSum > 21 || playerSum > dealerSum) {
        if (playerSum === 21 && document.getElementById("player-cards").children.length === 2) {
            multiplier = 1.5;
            message = "Blackjack! Wygrałeś!";
        } else {
            multiplier = 1;
            message = "Wygrałeś!";
        }
        balance += currentBet * (multiplier + 1);
    } else if (playerSum === dealerSum) {
        message = "Remis!";
        balance += currentBet;
    } else {
        message = "Przegrałeś!";
    }

    updateBalance();
    let resultElement = document.getElementById("result");
    resultElement.innerText = message;
    resultElement.style.animation = "result 0.5s ease-in-out"; // Animacja wyniku
}

function reset() {
    dealerSum = 0;
    playerSum = 0;
    dealerAceCount = 0;
    playerAceCount = 0;
    canHit = true;

    let hiddenCard = document.getElementById("hidden");
    hiddenCard.src = "./karty_OG_Projcet/Tyl.png";
    hiddenCard.style.animation = "none"; // Reset animacji ukrytej karty
    let dealerCards = document.getElementById("dealer-cards");
    while (dealerCards.children.length > 1) {
        dealerCards.removeChild(dealerCards.lastChild);
    }
    document.getElementById("player-cards").innerHTML = "";
    document.getElementById("dealer-sum").innerText = "?";
    document.getElementById("player-sum").innerText = "";
    let resultElement = document.getElementById("result");
    resultElement.innerText = "";
    resultElement.style.animation = "none"; // Reset animacji wyniku

    if (balance <= 0) {
        alert("Brak środków! Resetuję balans do $1000.");
        balance = 1000;
        updateBalance();
    }

    document.getElementById("start-page").style.display = "block";
    document.getElementById("game").style.display = "none";
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];
    if (isNaN(value)) {
        if (value === "A") return 11;
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    return card[0] === "A" ? 1 : 0;
}

function reduceAce(sum, aceCount) {
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}

function updateBalance() {
    document.getElementById("balance").innerText = balance;
    document.getElementById("game-balance").innerText = balance;
    document.getElementById("bet").max = balance;
}

function endGame(message) {
    document.getElementById("dealer-sum").innerText = dealerSum;
    let hiddenCard = document.getElementById("hidden");
    hiddenCard.style.animation = "flip 0.5s ease-in-out"; // Animacja odkrywania
    hiddenCard.src = "./karty_OG_Projcet/" + hidden + ".png";
    let resultElement = document.getElementById("result");
    resultElement.innerText = message;
    resultElement.style.animation = "result 0.5s ease-in-out"; // Animacja wyniku
}