import fs from 'node:fs';
import path from 'node:path';

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim();
// Windows \r\n madness why am I doing this on Windows
const lines = inputData.split('\n');
const [timeLine, distanceLine] = lines;
const [timeStr, timeParts] = timeLine.trim().split(':');
const [distStr, distParts] = distanceLine.trim().split(':');

/*const numberRE = /\d+/g;
const times = Array.from(timeParts.matchAll(numberRE)).map(m => parseInt(m[0]));
const distances = Array.from(distParts.matchAll(numberRE)).map(m => parseInt(m[0]));

console.log('Times', times);
console.log('Distances', distances);
let product = 1;
for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const bestDistance = distances[i];

    let numWaysToWin = 0;
    for (let s = 1; s < time; s++) {
        const expectedDistance = s * (time - s);
        if (expectedDistance > bestDistance) {
            numWaysToWin += 1;
        }
    }
    product *= numWaysToWin;
}*/

const digitRE = /\d/g;
const timeDigits = Array.from(timeParts.matchAll(digitRE)).map(m => parseInt(m[0]));
const distnaceDigits =  Array.from(distParts.matchAll(digitRE)).map(m => parseInt(m[0]));

let time = 0;
for (const td of timeDigits) {
    time *= 10;
    time += td;
}

let distance = 0;
for (const dd of distnaceDigits) {
    distance *= 10;
    distance += dd;
}
console.log('Race of', time, distance);

let numWaysToWin = 0;
for (let s = 1; s < time; s++) {
    const expectedDistance = s * (time - s);
    if (expectedDistance > distance) {
        numWaysToWin += 1;
    }
}
console.log('Total: ', numWaysToWin);