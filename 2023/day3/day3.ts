import fs from 'node:fs';
import path from 'node:path';

function isSymbol(char: string): boolean {
    return !char.match(/\d|\./);
}

function hasSymbolNear(lineNumber: number, index: number, lines: string[]): boolean {
    if (index > 0) {
        if (lineNumber > 0 && isSymbol(lines[lineNumber - 1][index - 1])) {
            return true;
        }

        if (isSymbol(lines[lineNumber][index -1])) {
            return true;
        }

        if (lineNumber < lines.length - 1 && isSymbol(lines[lineNumber + 1][index -1])) {
            return true;
        }
    }

    if (lineNumber > 0 && isSymbol(lines[lineNumber - 1][index])) {
        return true;
    }

    if (lineNumber < lines.length -1 && isSymbol(lines[lineNumber + 1][index])) {
        return true;
    }

    if (index < lines[0].length - 1) {
        if (lineNumber > 0 && isSymbol(lines[lineNumber - 1][index + 1])) {
            return true;
        }

        if (isSymbol(lines[lineNumber][index + 1])) {
            return true;
        }

        if (lineNumber < lines.length - 1 && isSymbol(lines[lineNumber + 1][index + 1])) {
            return true;
        }
    }
    return false;
}

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim();
const lines = inputData.split('\n').map(l => l.trim());

function partOne() {
    let sum: number = 0;
    for (const [lineNumber, line] of lines.entries()) {
        let foundSymbol = false;
        let curNumber: number | null = null;
        for (let i = 0; i < line.length; i++) {
        if (line[i].match(/\d/)) {
            if (curNumber === null) {
            curNumber = 0;
            }
            curNumber *= 10;
            curNumber += parseInt(line[i]);

            if (!foundSymbol && hasSymbolNear(lineNumber, i, lines)) {
            foundSymbol = true;
            }
        } else if(curNumber !== null) {
            // Found end of number
            if (foundSymbol) {
            sum += curNumber;
            }
            curNumber = null;
            foundSymbol = false;
        }
        }

        // Check if number ended at end of line
        if (curNumber !== null) {
        if (foundSymbol) {
            sum += curNumber;
        }
        curNumber = null;
        foundSymbol = false;
        }
    }

    console.log('Total: ', sum);
}

function isGear(char: string): boolean {
    return char === '*';
}

function gearId(lineNumber: number, index: number): string {
    return `${lineNumber}-${index}`;
}

function findGearNear(lineNumber: number, index: number, lines: string[], {isStart, isEnd}: {isStart?: boolean, isEnd?: boolean} = {}) {
    let foundGears: string[] = [];
    if (isStart && index > 0) {
        if (lineNumber > 0 && isGear(lines[lineNumber - 1][index - 1])) {
        foundGears.push(gearId(lineNumber - 1, index -1));
        }

        if (isGear(lines[lineNumber][index - 1])) {
        foundGears.push(gearId(lineNumber, index - 1));
        }

        if (lineNumber < lines.length - 1 && isGear(lines[lineNumber + 1][index -1])) {
        foundGears.push(gearId(lineNumber + 1, index - 1));
        }
    }

    if (lineNumber > 0 && isGear(lines[lineNumber - 1][index])) {
        foundGears.push(gearId(lineNumber - 1, index));
    }

    if (lineNumber < lines.length -1 && isGear(lines[lineNumber + 1][index])) {
        foundGears.push(gearId(lineNumber + 1, index));
    }

    if (isEnd && index < lines[0].length - 1) {
        if (lineNumber > 0 && isGear(lines[lineNumber - 1][index + 1])) {
        foundGears.push(gearId(lineNumber - 1, index + 1));
        }

        if (isGear(lines[lineNumber][index + 1])) {
        foundGears.push(gearId(lineNumber, index + 1));
        }

        if (lineNumber < lines.length - 1 && isGear(lines[lineNumber + 1][index + 1])) {
        foundGears.push(gearId(lineNumber + 1, index + 1));
        }
    }
    return foundGears;
}

const gearMap = new Map<string, Array<number>>();
for (const [lineNumber, line] of lines.entries()) {
    const foundGears = new Set<string>();
    let curNumber: number | null = null;
    for (let i = 0; i < line.length; i++) {
        if (line[i].match(/\d/)) {
            const isStart = curNumber === null;
            if (isStart) {
                curNumber = 0;
            }
            curNumber! *= 10;
            curNumber! += parseInt(line[i]);

            findGearNear(lineNumber, i, lines, {isStart}).forEach(gId => foundGears.add(gId));
        } else if(curNumber !== null) {
            findGearNear(lineNumber, i - 1, lines, {isEnd: true}).forEach(gId => foundGears.add(gId));
            // Found end of number
            foundGears.forEach(gId => {
                if (!gearMap.has(gId)) {
                    gearMap.set(gId, []);
                }
                const numList = gearMap.get(gId) as Array<number>;
                // I'm not sure why ts isn't inferring this as not null given teh check above
                numList.push(curNumber!);
            })
            curNumber = null;
            foundGears.clear();
        }
    }

    // Check if number ended at end of line
    if (curNumber !== null) {
        foundGears.forEach(gId => {
            if (!gearMap.has(gId)) {
                gearMap.set(gId, []);
            }
            const numList = gearMap.get(gId) as Array<number>;
            numList.push(curNumber!);
        })
        curNumber = null;
        foundGears.clear();
    }
}

let sum = 0;
for (const [gId, numList] of gearMap.entries()) {
console.log('gId', gId, numList);
if (numList.length !== 2) {
    continue;
}

const gearRatio = numList[0] * numList[1];
console.log(gId, gearRatio);
sum += gearRatio;
}
console.log('Total:', sum);
