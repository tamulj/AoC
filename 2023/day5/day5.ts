import fs from 'node:fs';
import path from 'node:path';

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim();
// Windows \r\n madness why am I doing this on Windows
const lines = inputData.split('\n');

interface SeedRange {
    dstRangeStart: number;
    srcRangeStart: number;
    length: number;
}

interface SeedMapping {
    next: string;
    ranges: Array<SeedRange>;
}

const numberRE = /\d+/g;
const mapRE = /([\w-]+) map:/;
let sum = 0;
const seeds = Array.from(lines[0].trim().split(':')[1].matchAll(numberRE)).map(m => parseInt(m[0]));
console.log('seeds', seeds);
const map = new Map<string, SeedMapping>();
let activeMap: SeedMapping | null = null;
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') {
        continue;
    }

    const newMapMatch = line.match(mapRE);
    if (newMapMatch) {
        const mapParts = newMapMatch[1].split('-');
        activeMap = {next: mapParts[2], ranges: []};
        map.set(mapParts[0], activeMap);
    } else {
        const [dstRangeStart, srcRangeStart, length] = Array.from(line.matchAll(numberRE)).map(m => parseInt(m[0]));
        activeMap!.ranges.push({dstRangeStart, srcRangeStart, length});
    }
}

for (const stageData of map.values()) {
    stageData.ranges.sort((a, b) => a.srcRangeStart - b.srcRangeStart);
}

function findLowest(stage: string, valueStart: number, length: number): number {
    let originalStart = valueStart;
    let originalLenght = length;
    console.log('Starting', stage, `start: ${originalStart} len: ${originalLenght}`);
    if (stage === 'location') {
        return valueStart;
    }
    
    const stageData = map.get(stage)!;
    const nextStage = stageData.next;
    const results: number[] = [];
    //console.log('Stage', stage, stageData.ranges.map(r => r.srcRangeStart));
    while (length !== 0) {
        let match = false;
        for (const [rIdx, range] of stageData.ranges.entries()) {
            console.log('Testing', stage, valueStart, ' against', range.srcRangeStart);
            if (rIdx === 0 && valueStart < range.srcRangeStart) {
                const gap = range.srcRangeStart - valueStart;
                const rangeConsumed = Math.min(length, gap);
                console.log('BelowRange', nextStage, `start: ${valueStart} rangeConsumed: ${rangeConsumed}`);
                results.push(findLowest(nextStage, valueStart, rangeConsumed));
                length -= rangeConsumed;
                valueStart += rangeConsumed;
                match = true;
                break;
            }
            if (valueStart >= range.srcRangeStart && valueStart < range.srcRangeStart + range.length) {
                const offset = valueStart - range.srcRangeStart;
                const lengthLeft = range.length - offset;
                const rangeConsumed = Math.min(length, lengthLeft);
                console.log('Found in range', nextStage, valueStart, ' >= ', range.srcRangeStart, `offset: ${offset} rangeConsumed ${rangeConsumed}`);
                results.push(findLowest(nextStage, range.dstRangeStart + offset, rangeConsumed));
                length -= rangeConsumed;
                valueStart += rangeConsumed;
                match = true;
                break;
            }

            if (valueStart < range.srcRangeStart && (valueStart + length) > range.srcRangeStart) {
                const lengthBefore = range.srcRangeStart - valueStart;
                console.log('Found in gap', nextStage, valueStart, ' < ', range.srcRangeStart, ' lenBeforeGap', lengthBefore);
                results.push(findLowest(nextStage, valueStart, lengthBefore));
                length -= lengthBefore;
                valueStart = range.srcRangeStart;
                match = true;
                break;
            }
        }

        if (!match) {
            console.log('==Found after all ranges', nextStage, valueStart, ' len: ', length);
            results.push(findLowest(nextStage, valueStart, length));
            length = 0;
        }
    }
    
    let lowest: number | null = null;
    for (const r of results) {
        if (lowest === null || r < lowest) {
            lowest = r;
        }
    }
    console.log('Done', stage, originalStart, originalLenght, lowest, results);
    return lowest!;
}

let lowestLocation: number | null = null;
for (let seedIdx = 0; seedIdx < seeds.length; seedIdx += 2) {
    const startValue = seeds[seedIdx];
    const length = seeds[seedIdx + 1];
    console.log('***** SEARCHING ', startValue, length);
    const value = findLowest('seed', startValue, length);
    if (lowestLocation === null || value < lowestLocation) {
        lowestLocation = value;
    }
}
console.log('Total: ', lowestLocation);