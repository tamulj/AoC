import fs from 'node:fs';
import path from 'node:path';

function convertToNumber(matchStr: string): number {
    const maybeInt = parseInt(matchStr);
    if (!Number.isNaN(maybeInt)) {
        return maybeInt;
    }

    switch (matchStr.toLowerCase()) {
        case "one":
            return 1;
        case "two":
            return 2;
        case "three":
            return 3;
        case "four":
            return 4;
        case "five":
            return 5;
        case "six":
            return 6;
        case "seven":
            return 7;
        case "eight":
            return 8;
        case "nine":
            return 9;
    }
    throw new Error(`Could not convert ${matchStr}`);
}

function findAllMatches(text: string, matchingRegex: RegExp): RegExpExecArray[] {
    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    while (match = matchingRegex.exec(text)) {
        matches.push(match);
        matchingRegex.lastIndex = match.index + 1;
    }
    return matches;
}

const digitRE = /one|two|three|four|five|six|seven|eight|nine|\d/gi;
function findFancyCode(line: string): number {
    const matches = findAllMatches(line, digitRE);
    const firstDigit = convertToNumber(matches[0][0]);
    const lastDigit = convertToNumber(matches[matches.length - 1][0]);
    return (firstDigit * 10) + lastDigit;
}

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim();
// Windows \r\n madness why am I doing this on Windows
const lines = inputData.split('\n');
let sum = 0;
for (const rawline of lines) {
    const line = rawline.trim();
    
    const value = findFancyCode(line);
    sum += value;
    console.log(line, value, sum);
}
console.log('Total: ', sum);
