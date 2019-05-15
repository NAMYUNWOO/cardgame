const suitPositions = [
    [
        [0, 0]
    ],
    [
        [0, 0]
    ],
    [
        [0, -1],
        [0, 1, true]
    ],
    [
        [0, -1],
        [0, 0],
        [0, 1, true]
    ],
    [
        [-1, -1],
        [1, -1],
        [-1, 1, true],
        [1, 1, true]
    ],
    [
        [-1, -1],
        [1, -1],
        [0, 0],
        [-1, 1, true],
        [1, 1, true]
    ],
    [
        [-1, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1, true],
        [1, 1, true]
    ],
    [
        [-1, -1],
        [1, -1],
        [0, -0.5],
        [-1, 0],
        [1, 0],
        [-1, 1, true],
        [1, 1, true]
    ],
    [
        [-1, -1],
        [1, -1],
        [0, -0.5],
        [-1, 0],
        [1, 0],
        [0, 0.5, true],
        [-1, 1, true],
        [1, 1, true]
    ],
    [
        [-1, -1],
        [1, -1],
        [-1, -1 / 3],
        [1, -1 / 3],
        [0, 0],
        [-1, 1 / 3, true],
        [1, 1 / 3, true],
        [-1, 1, true],
        [1, 1, true]
    ],
    [
        [-1, -1],
        [1, -1],
        [0, -2 / 3],
        [-1, -1 / 3],
        [1, -1 / 3],
        [-1, 1 / 3, true],
        [1, 1 / 3, true],
        [0, 2 / 3, true],
        [-1, 1, true],
        [1, 1, true]
    ],
    [
        [0, 0]
    ],
    [
        [0, 0]
    ],
    [
        [0, 0]
    ]
];

const el = (tagName, attributes, children) => {
    const element = document.createElement(tagName);

    if (attributes) {
        for (const attrName in attributes) {
            element.setAttribute(attrName, attributes[attrName]);
        }
    }

    if (children) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        }
    }

    return element;
};

const deckCards = ["2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AC", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "AS", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AH", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AD"]
const createShoe = (numDecks) => {
    //Inefficient and insecure
    let shoe = [];
    for (let i = 0; i < numDecks; i++) {
        let tempDeck = deckCards.slice(0, 52);
        for (let j = tempDeck.length; j > 0; j--) {
            //Replace with difference random number generator
            let r = Math.floor(Math.random() * j)
            shoe.push(...tempDeck.splice(r, 1));
        }
    }
    return shoe;
}

const div = (a, c) => el('div', a, c);

// const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
// const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');

// const getRank = (i) => ranks[i % 13];
// const getSuit = (i) => suits[i / 13 | 0];
// const getColor = (i) => (i / 13 | 0) % 2 ? 'red' : 'black';

const getSuit = {
    'S': '♠︎',
    'H': '♥︎',
    'C': '♣︎',
    'D': '♦︎',
    '?': '?'
}
const getColor = {
    'S': 'black',
    'H': 'red',
    'C': 'black',
    'D': 'red',
    '?': 'navy'
}
const createSuit = (suit) => (pos) => {
    const [x, y, mirrored] = pos;
    const mirroredClass = mirrored ? ' mirrored' : '';
    return div({
        class: 'playCard-suit' + mirroredClass,
        style: `left: ${x * 100}%; top: ${y * 100}%;`
    }, [suit]);
};

const getCardIndex = (rank) => {
    if (rank == '?') {
        return 0
    }
    if (rank == 'A') {
        return 1
    }
    if (rank == 'J') {
        return 11
    }
    if (rank == 'Q') {
        return 12

    }
    if (rank == 'K') {
        return 13
    }
    return parseInt(rank);

}

const createplayCard = (card) => {
    const clen = card.length;
    const rank = card.slice(0, clen - 1);
    const _suit = card.slice(-1, clen);
    const i = getCardIndex(rank);
    const suit = getSuit[_suit];
    const cardColor = getColor[_suit]
    const colorClass = 'playCard ' + getColor[_suit];
    var cardDiv = div({ class: colorClass }, [
        div({ class: 'playCard-suits' },
            suitPositions[i % 13].map(createSuit(suit))
        ),
        div({ class: 'playCard-topleft' }, [
            div({ class: 'playCard-corner-rank' }, [
                rank
            ]),
            // div({ class: 'playCard-corner-suit' }, [
            //     suit
            // ])
        ]),
        div({ class: 'playCard-bottomright' }, [
            div({ class: 'playCard-corner-rank' }, [
                rank
            ]),
            // div({ class: 'playCard-corner-suit' }, [
            //     suit
            // ])
        ])
    ]);
    if (cardColor == 'red') {
        cardDiv.setAttribute('style', 'color:red');
    }
    return cardDiv;

};




const createCard = (cardNums, playSide) => {
    var deck = div({ class: 'deck float-right' });
    if (playSide == "player") {
        deck = div({ class: 'deck float-left' });
    }

    cardNums.forEach((i) => {
        const playCard = createplayCard(i);
        deck.appendChild(playCard);
    })
    const div12 = div({ class: 'col-md-12 col-sm-12' });
    div12.appendChild(deck);
    return div12
}


const createCardGame = (playerCard, bankerCard) => {
    var cardGame = div({ class: 'col-md-6 col-sm-12' });
    cardGame.setAttribute("style", "padding:0% !important;")
    var cardRow = div({ class: 'row' });;
    cardRow.appendChild(createCard(playerCard, "player"));
    cardRow.appendChild(createCard(bankerCard, "banker"));
    cardGame.appendChild(cardRow);
    return cardRow
}

const showWaitingCards = () => {
    try {
        document.getElementById("cardGame").remove();
    } catch {

    }
    var playerCard = ['??', '??', '??'] //shoe.slice(0, 3);
    var bankerCard = ['??', '??', '??'];
    var cardGameHome = document.querySelector("#cardGameHome")
    var cardGame = createCardGame(playerCard, bankerCard);
    cardGame.setAttribute('id', 'cardGame');
    cardGameHome.appendChild(cardGame);
}

const winnerMark = (outcome) => {
    console.log("winner ", outcome);
    if (outcome == 'P') {
        var winnerBoard = document.getElementById("playerBoard");
        winnerBoard.setAttribute("style", "background-color: green");
    } else if (outcome == 'B') {
        var winnerBoard = document.getElementById("bankerBoard");
        winnerBoard.setAttribute("style", "background-color: green");
    } else {
        var pBoard = document.getElementById("playerBoard");
        pBoard.setAttribute("style", "background-color: grey");
        var bBoard = document.getElementById("bankerBoard");
        bBoard.setAttribute("style", "background-color: grey");
    }
}

const showGame = (pHand, bHand, payout, newUserMoney, outcome) => {
    document.getElementById("timeOut").textContent = "게임 결과";
    document.getElementById("cardGame").remove();
    playerCard = pHand;
    bankerCard = bHand;
    cardGame = createCardGame(playerCard, bankerCard);
    cardGame.setAttribute('id', 'cardGame');
    cardGameHome.appendChild(cardGame);
    document.getElementById("money").textContent = newUserMoney;
    winnerMark(outcome);
    setTimeout(() => {
        showWaitingCards();
        socket.emit("getSyncTime", "");
        var pBoard = document.getElementById("playerBoard");
        pBoard.setAttribute("style", "border:1px solid grey;");
        var bBoard = document.getElementById("bankerBoard");
        bBoard.setAttribute("style", "border:1px solid grey;");
    }, 10000)
}