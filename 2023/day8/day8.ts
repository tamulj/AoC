import fs from 'node:fs';
import path from 'node:path';

const inputDataFilePath = path.join(__dirname, './part2.txt');
const inputData = fs.readFileSync(inputDataFilePath, 'utf8').trim() as string;
// Windows \r\n madness why am I doing this on Windows
const lines = inputData.split('\n');

const pattern = lines[0].trim();

interface Node {
    left: string;
    right: string;
}

const nodeMap = new Map<string, Node>();
let startNodes: string[] = [];
for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    const [header, data] = line.split('=');
    const nodeId = header.trim();
    const [rawLeft, rawRight] = data.trim().split(',');

    const left = rawLeft.trim().slice(1);
    const right = rawRight.trim().slice(0, -1);
    nodeMap.set(nodeId, {left, right});

    if (nodeId[nodeId.length - 1] === 'A') {
        startNodes.push(nodeId);
    }
}

function getSteps(nodeId: string): number {
    let steps = 0;
    while (nodeId[nodeId.length - 1] !== 'Z') {
        const node = nodeMap.get(nodeId)!;
        const nextNodeId = pattern[steps % pattern.length] === 'R' ? node.right : node.left;
        steps++;
        nodeId = nextNodeId;
    }
    return steps;
}

function gcd(a: number, b: number): number {
    return b == 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return  a / gcd(a, b) * b;
}

console.log(startNodes.map(getSteps).reduce(lcm, 1));