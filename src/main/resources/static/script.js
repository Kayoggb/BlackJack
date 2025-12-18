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
    const moneyDiv = document.getElementById("money-amount");

    pDiv.innerHTML = "";
    dDiv.innerHTML = "";

    player.forEach(c => {
        pDiv.innerHTML += `<img class="card-img" src="${c.img}">`;
    });

    dealer.forEach(c => {
        dDiv.innerHTML += `<img class="card-img" src="${c.img}">`;
    });

    document.getElementById("player-value").textContent = getHandValue(player);
    document.getElementById("dealer-value").textContent = getHandValue(dealer);

    moneyDiv.textContent = money;
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
    player = [];
    dealer = [];

    let delay = 0;
    for (let i = 0; i < 2; i++) {
        setTimeout(() => {
            player.push(drawCard());
            updateUI();
        }, delay);
        delay += 400;
    }

    for (let i = 0; i < 2; i++) {
        setTimeout(() => {
            dealer.push(drawCard());
            updateUI();
        }, delay);
        delay += 400;
    }

    setTimeout(() => {
        document.getElementById("hit").disabled = false;
        document.getElementById("stand").disabled = false;
        document.getElementById("double").disabled = false;
    }, delay + 100);
}

function finishGame() {
    const playerValue = getHandValue(player);

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;

    let dealerTurn = () => {
        const dealerValue = getHandValue(dealer);
        if (dealerValue < 17) {
            dealer.push(drawCard());
            updateUI();
            setTimeout(dealerTurn, 400);
        } else {
            setTimeout(() => {
                const dealerFinal = getHandValue(dealer);

                if (playerValue > 21) {
                    alert("Du hast verloren!");
                } else if (dealerFinal > 21 || playerValue > dealerFinal) {
                    money += bet * 2;
                    alert("Du gewinnst!");
                } else if (playerValue === dealerFinal) {
                    money += bet;
                    alert("Unentschieden!");
                } else {
                    alert("Du hast verloren!");
                }

                gameActive = false;
                updateUI();
            }, 400);
        }
    };

    dealerTurn();
}

document.getElementById("hit").onclick = () => {
    if (!gameActive) return;

    player.push(drawCard());
    updateUI();

    setTimeout(() => {
        if (getHandValue(player) > 21) {
            document.getElementById("hit").disabled = true;
            document.getElementById("stand").disabled = true;
            document.getElementById("double").disabled = true;
            finishGame();
        }
    }, 400);
};

document.getElementById("stand").onclick = () => {
    if (!gameActive) return;

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("double").disabled = true;

    setTimeout(finishGame, 400);
};

document.getElementById("double").onclick = () => {
    if (!gameActive) return;

    if (player.length !== 2) {
        alert("Du kannst nur mit 2 Startkarten verdoppeln!");
        return;
    }

    if (money < bet) {
        alert("Nicht genug Geld zum Verdoppeln!");
        return;
    }

    money -= bet;
    bet *= 2;

    player.push(drawCard());
    updateUI();

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("double").disabled = true;

    setTimeout(finishGame, 500);
};

document.getElementById("restart").onclick = startGame;
