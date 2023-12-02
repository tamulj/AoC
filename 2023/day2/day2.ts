import fs from 'node:fs';
import path from 'node:path';


const cubeRE = /(\d+) (\w+)/g;
function addRoundData(roundData: string, gameMap: Map<string, number>): void{
    const allCubeData = roundData.split(',');
    for (const singleCubeData of allCubeData) {
        cubeRE.lastIndex = 0;
        const match = cubeRE.exec(singleCubeData.trim());
        if (!match) {
            throw new Error(`Invalid cube data "${singleCubeData}" in ${roundData}`);
        }
        const count = parseInt(match[1]);
        const color = match[2];
        const currentMaxCount = gameMap.get(color) || 0;
        if (count > currentMaxCount) {
            gameMap.set(color, count);
        }
        
    }
}

const compareMap = new Map<string, number>([['red', 12], ['green', 13], ['blue', 14]]);

function parseGame(line: string): number {
    const [gameName, gameData] = line.split(':');
    const gameNumber = parseInt(gameName.slice('Game '.length));
    const roundData = gameData.split(';');
    const gameMap = new Map<string, number>();
    for (const singleRound of roundData) {
        addRoundData(singleRound, gameMap);
    }

    console.log('gameMap:', gameMap);
    for (const [color, count] of compareMap.entries()) {
        if ((gameMap.get(color) || 0) > count) {
            return 0;
        }
    }
    return gameNumber;
}

function parsePart2Game(line: string): number {
    const [gameName, gameData] = line.split(':');
    const gameNumber = parseInt(gameName.slice('Game '.length));
    const roundData = gameData.split(';');
    const gameMap = new Map<string, number>();
    for (const singleRound of roundData) {
        addRoundData(singleRound, gameMap);
    }

    let power = 1;
    for (const colorCount of gameMap.values()) {
        power *= colorCount;
    }
    return power;
}

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim();
// Windows \r\n madness why am I doing this on Windows
const lines = inputData.split('\n');
let sum = 0;
for (const rawline of lines) {
    const line = rawline.trim();
    const value = parsePart2Game(line);
    console.log(line, value)
    sum += value;
}
console.log('Total: ', sum);
