import {
    MissionControl
} from './problem-three';
import { promises as fs } from 'fs';
import path from 'path';

test('Input 1', async () => {
    const input = (await fs.readFile(path.join('.', 'res', 'p3.input.txt'), 'utf-8')).trimRight();
    const expectedOutput = (await fs.readFile(path.join('.', 'res', 'p3.output.txt'), 'utf-8')).trimRight();
    const output = MissionControl.parse(input);
    expect(output).toBe(expectedOutput);
});
