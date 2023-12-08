import fs from 'node:fs';
import path from 'node:path';

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim();
// Windows \r\n madness why am I doing this on Windows
const lines = inputData.split('\n');
let total = 0;

const rank = new Map<string, number>([
    ['A', 14],
    ['K', 13],
    ['Q', 12],
    ['J', 11],
    ['T', 10],
    ['9', 9],
    ['8', 8],
    ['7', 7],
    ['6', 6],
    ['5', 5],
    ['4', 4],
    ['3', 3],
    ['2', 2],
    ['J', 1],
]);

enum HandType {
    FIVE_OF_KIND = 0,
    FOUR_OF_KIND = 1,
    FULL_HOUSE = 2,
    THREE_OF_KIND = 3,
    TWO_PAIR = 4,
    ONE_PAIR = 5,
    HIGH_CARD = 6,
}

function getHandType(handMap: Map<string, number>): HandType {
    const numJokers = handMap.get('J') || 0;
    handMap.delete('J');

    if (numJokers === 5) {
        return HandType.FIVE_OF_KIND;
    } 
    const cardSets = Array.from(handMap.entries()).sort((a, b) => b[1] - a[1]);
    cardSets[0][1] += numJokers;

    if (cardSets.length === 1) {
        return HandType.FIVE_OF_KIND;
    }

    if (cardSets.length === 2) {
        if (cardSets[0][1] === 4) {
            return HandType.FOUR_OF_KIND;
        }

        return HandType.FULL_HOUSE;
    }

    if (cardSets[0][1] === 3) {
        return HandType.THREE_OF_KIND;
    }

    if (cardSets.length === 3) {
        return HandType.TWO_PAIR;
    }

    if (cardSets[0][1] === 2) {
        return HandType.ONE_PAIR;
    }

    return HandType.HIGH_CARD;
}

interface Hand {
    cards: string;
    handType: HandType;
    bid: number;
}

const handList: Hand[] = [];
for (const rawline of lines) {
    const line = rawline.trim();
    const [hand, bid] = line.split(' ');
    console.log(hand, bid);

    const handMap = new Map<string, number>();
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const curCount = handMap.get(card) || 0;
        handMap.set(card, curCount + 1);
    }
    const handType = getHandType(handMap);
    handList.push({
        cards: hand,
        handType,
        bid: parseInt(bid),
    });
}
handList.sort((a, b) => {
    if (a.handType !== b.handType) {
        return a.handType - b.handType;
    }
    for (let i=0; i < b.cards.length; i++) {
        if (b.cards[i] === a.cards[i]) {
            continue;
        }
        return rank.get(b.cards[i])! - rank.get(a.cards[i])!;
    }
    return 0;
})
handList.reverse();


for (const [idx, hand] of handList.entries()) {
    console.log(`Rank ${idx} hand: ${hand.cards} bid: ${hand.bid}`);
    total += ((idx + 1) * hand.bid)
}

console.log('Total', total);