const suitPositions = [
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

const div = (a, c) => el('div', a, c);

const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');

const getRank = (i) => ranks[i % 13];
const getSuit = (i) => suits[i / 13 | 0];
const getColor = (i) => (i / 13 | 0) % 2 ? 'red' : 'black';

const createSuit = (suit) => (pos) => {
    const [x, y, mirrored] = pos;
    const mirroredClass = mirrored ? ' mirrored' : '';
    return div({
        class: 'playCard-suit' + mirroredClass,
        style: `left: ${x * 100}%; top: ${y * 100}%;`
    }, [suit]);
};

const createplayCard = (i) => {
    const rank = getRank(i);
    const suit = getSuit(i);
    const colorClass = 'playCard ' + getColor(i);

    return div({ class: colorClass }, [
        div({ class: 'playCard-suits' },
            suitPositions[i % 13].map(createSuit(suit))
        ),
        div({ class: 'playCard-topleft' }, [
            div({ class: 'playCard-corner-rank' }, [
                rank
            ]),
            div({ class: 'playCard-corner-suit' }, [
                suit
            ])
        ]),
        div({ class: 'playCard-bottomright' }, [
            div({ class: 'playCard-corner-rank' }, [
                rank
            ]),
            div({ class: 'playCard-corner-suit' }, [
                suit
            ])
        ])
    ]);
};

const createplayCardSm = (i) => {
    const rank = getRank(i);
    const suit = getSuit(i);
    const colorClass = 'playCardSm ' + getColor(i);

    return div({ class: colorClass }, [
        div({ class: 'playCardSm-suits' },
            suitPositions[i % 13].map(createSuit(suit))
        ),
        div({ class: 'playCardSm-topleft' }, [
            div({ class: 'playCardSm-corner-rank' }, [
                rank
            ]),
            div({ class: 'playCardSm-corner-suit' }, [
                suit
            ])
        ]),
        div({ class: 'playCardSm-bottomright' }, [
            div({ class: 'playCardSm-corner-rank' }, [
                rank
            ]),
            div({ class: 'playCardSm-corner-suit' }, [
                suit
            ])
        ])
    ]);
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