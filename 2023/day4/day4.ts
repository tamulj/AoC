import fs from 'node:fs';
import path from 'node:path';

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim();
// Windows \r\n madness why am I doing this on Windows
const lines = inputData.split('\n');

const numberRE = /\d+/g;
let sum = 0;
const copyMap = new Map<number, number>();
for (const [lineNumber, rawline] of lines.entries()) {
    const line = rawline.trim();
    const [title, data] = line.split(':');
    const [winningStr, numberStr] = data.split('|');
    const winningSet = new Set<string>();
    for (const winMatch of winningStr.matchAll(numberRE)) {
        winningSet.add(winMatch[0]);
    }
    let matches = 0;
    for (const numMatch of numberStr.matchAll(numberRE)) {
        if (winningSet.has(numMatch[0])) {
            matches += 1;
        }
    }
    const copiesOfCard = 1 + (copyMap.get(lineNumber) || 0);
    sum += copiesOfCard
    for (let i = 0; i < matches; i++) {
        const lineToUpdate = lineNumber + i + 1;
        copyMap.set(lineToUpdate, (copyMap.get(lineToUpdate) || 0) + copiesOfCard);
    }
    console.log(`line: ${lineNumber} matches: ${matches}, newSum: ${sum}`);
    console.log(copyMap);
}
console.log('Total: ', sum);
