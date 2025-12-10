let deck = [];
let player = [];
let dealer = [];
let money = 500;
let bet = 0;
let gameActive = false;

function createDeck() {
    const suits = ["S", "H", "D", "C"];
    const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
    const values = {
        "2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,
        "J":10,"Q":10,"K":10,"A":11
    };

    deck = [];
    for (let s of suits) {
        for (let r of ranks) {
            deck.push({
                suit: s,
                rank: r,
                value: values[r],
                img: `cards/${s}${r}.jpg`

        });
        }
    }

    deck.sort(() => Math.random() - 0.5);
}

function drawCard() {
    return deck.pop();
}

function getHandValue(hand) {
    let sum = 0;
    let aces = 0;

    hand.forEach(card => {
        sum += card.value;
        if (card.rank === "A") aces++;
    });

    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }

    return sum;
}

function updateUI() {
    const pDiv = document.getElementById("player-cards");
    const dDiv = document.getElementById("dealer-cards");
    const moneyDiv = document.querySelector(".money");

    pDiv.innerHTML = "";
    dDiv.innerHTML = "";

    player.forEach(c => {
        pDiv.innerHTML += `<img class="card-img" src="${c.img}">`;
    });

    dealer.forEach(c => {
        dDiv.innerHTML += `<img class="card-img" src="${c.img}">`;
    });

    moneyDiv.textContent = `Geld: ${money}€`;
}

function startGame() {
    bet = parseInt(prompt("Wie viel möchtest du setzen?", 50));

    if (isNaN(bet) || bet <= 0 || bet > money) {
        alert("Ungültiger Einsatz!");
        return;
    }

    money -= bet;
    gameActive = true;

    createDeck();
    player = [drawCard(), drawCard()];
    dealer = [drawCard(), drawCard()];
    updateUI();

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
}

function finishGame() {
    const playerValue = getHandValue(player);
    const dealerValue = getHandValue(dealer);

    if (playerValue > 21) {
        alert("Du hast verloren!");
    }
    else if (dealerValue > 21) {
        money += bet * 2;
        alert("Dealer bust! Du gewinnst!");
    }
    else if (playerValue > dealerValue) {
        money += bet * 2;
        alert("Du gewinnst!");
    }
    else if (playerValue === dealerValue) {
        money += bet;
        alert("Unentschieden!");
    }
    else {
        alert("Du hast verloren!");
    }

    gameActive = false;
    updateUI();
}

document.getElementById("hit").onclick = () => {
    if (!gameActive) return;

    player.push(drawCard());
    updateUI();

    if (getHandValue(player) > 21) {
        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;
        finishGame();
    }
};

document.getElementById("stand").onclick = () => {
    if (!gameActive) return;

    while (getHandValue(dealer) < 17) {
        dealer.push(drawCard());
    }

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;

    updateUI();
    finishGame();
};

document.getElementById("restart").onclick = startGame;
