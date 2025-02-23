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

    // Tylko jedna karta dla dealera na początku
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./karty_OG_Projcet/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);

    // Rozdaj karty graczowi
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./karty_OG_Projcet/" + card + ".png";
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }

    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("dealer-sum").innerText = "?";
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("reset").addEventListener("click", reset);
}

function hit() {
    if (!canHit) {
        return; // Jeśli gracz nie może dobierać kart, zakończ funkcję
    }

    // Stwórz nowy element obrazu karty
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./karty_OG_Projcet/Tyl.png"; // Początkowo pokaż odwróconą kartę
    cardImg.classList.add("card-back", "card-slide"); // Dodaj klasy dla odwróconej karty i animacji przesuwania
    document.getElementById("player-cards").append(cardImg);

    // Obróć kartę po 250ms
    setTimeout(() => {
        cardImg.src = "./karty_OG_Projcet/" + card + ".png"; // Pokaż wartość karty
        cardImg.classList.remove("card-back"); // Usuń klasę odwróconej karty
        cardImg.classList.add("card-flip"); // Dodaj animację obrotu
    }, 250);

    // Zaktualizuj sumę kart gracza
    playerSum += getValue(card);
    playerAceCount += checkAce(card);

    // Jeśli suma przekracza 21, a gracz ma asa, zamień asa z 11 na 1
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }

    // Zaktualizuj wyświetlaną sumę kart gracza
    document.getElementById("player-sum").innerText = playerSum;

    // Sprawdź, czy gracz przekroczył 21
    if (playerSum > 21) {
        canHit = false; // Zablokuj możliwość dobierania kart
        let message = "Przegrałeś!";
        document.getElementById("result").innerText = message;
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("hidden").src = "./karty_OG_Projcet/" + hidden + ".png";
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
    canHit = false; // Blokujemy możliwość dobierania kart przez gracza

    // Animacja ukrytej karty dealera
    let hiddenCardImg = document.getElementById("hidden");
    hiddenCardImg.src = "./karty_OG_Projcet/Tyl.png"; // Początkowo pokaż odwróconą kartę
    hiddenCardImg.classList.add("card-back"); // Dodaj klasę dla odwróconej karty

    // Obróć ukrytą kartę dealera po 250ms
    setTimeout(() => {
        hiddenCardImg.src = "./karty_OG_Projcet/" + hidden + ".png"; // Pokaż wartość karty
        hiddenCardImg.classList.remove("card-back"); // Usuń klasę odwróconej karty
        hiddenCardImg.classList.add("card-flip"); // Dodaj animację obrotu
    }, 250);

    // Funkcja do dobierania kart przez dealera
    const dealerDrawCard = () => {
        if (dealerSum >= 17) {
            // Jeśli suma kart dealera wynosi 17 lub więcej, zakończ dobieranie
            endGame(); // Wywołaj funkcję kończącą grę
            return;
        }

        // Dobierz nową kartę dla dealera
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./karty_OG_Projcet/Tyl.png"; // Początkowo pokaż odwróconą kartę
        cardImg.classList.add("card-back", "card-slide"); // Dodaj klasy dla odwróconej karty i animacji przesuwania
        document.getElementById("dealer-cards").append(cardImg);

        // Obróć kartę po 250ms
        setTimeout(() => {
            cardImg.src = "./karty_OG_Projcet/" + card + ".png"; // Pokaż wartość karty
            cardImg.classList.remove("card-back"); // Usuń klasę odwróconej karty
            cardImg.classList.add("card-flip"); // Dodaj animację obrotu
        }, 250);

        // Zaktualizuj sumę kart dealera
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);

        // Jeśli suma przekracza 21, a dealer ma asa, zamień asa z 11 na 1
        while (dealerSum > 21 && dealerAceCount > 0) {
            dealerSum -= 10;
            dealerAceCount -= 1;
        }

        // Kontynuuj dobieranie kart co 500ms
        setTimeout(dealerDrawCard, 500);
    };

    // Rozpocznij dobieranie kart przez dealera
    setTimeout(dealerDrawCard, 500);
}

function endGame() {
    // Logika kończąca grę
    let message = "";

    // Sprawdź warunki zakończenia gry
    if (playerSum > 21) {
        message = "Przegrałeś!";
    } else if (dealerSum > 21) {
        message = "Wygrałeś!";
    } else if (playerSum === dealerSum) {
        message = "Remis!";
    } else if (playerSum > dealerSum) {
        message = "Wygrałeś!";
    } else {
        message = "Przegrałeś!";
    }

    // Zaktualizuj widok
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("result").innerText = message;
}


function endGame() {
    // Logika kończąca grę (np. porównanie sumy kart gracza i dealera)
    let message = "";
    if (playerSum > 21) {
        message = "Przegrałeś!";
    } else if (dealerSum > 21) {
        message = "Wygrałeś!";
    } else if (playerSum === dealerSum) {
        message = "Remis!";
    } else if (playerSum > dealerSum) {
        message = "Wygrałeś!";
    } else {
        message = "Przegrałeś!";
    }

    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("result").innerText = message;
}

function reset() {
    dealerSum = 0;
    playerSum = 0;
    dealerAceCount = 0;
    playerAceCount = 0;
    canHit = true;

    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./karty_OG_Projcet/Tyl.png">';
    document.getElementById("player-cards").innerHTML = '';
    document.getElementById("player-sum").innerText = '0';
    document.getElementById("dealer-sum").innerText = '?';
    document.getElementById("result").innerText = '';

    startGame();
}