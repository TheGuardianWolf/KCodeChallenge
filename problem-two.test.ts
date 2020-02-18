import {
    SalesManager
} from './problem-two';
import { promises as fs } from 'fs';
import path from 'path';

let salesManager: SalesManager;

beforeEach((() => {
    salesManager = new SalesManager(0.1, 0.05, [
        'book',
        'books',
        'chocolate',
        'chocolates',
        'pill',
        'pills'
    ]);
}));

test('Input 1', async () => {
    const input = (await fs.readFile(path.join('.', 'res', 'p2-1.input.txt'), 'utf-8')).trimRight();
    const expectedOutput = (await fs.readFile(path.join('.', 'res', 'p2-1.output.txt'), 'utf-8')).trimRight();
    const output = salesManager.generateReceipt(input);
    expect(output).toBe(expectedOutput);
});

test('Input 2', async () => {
    const input = (await fs.readFile(path.join('.', 'res', 'p2-2.input.txt'), 'utf-8')).trimRight();
    const expectedOutput = (await fs.readFile(path.join('.', 'res', 'p2-2.output.txt'), 'utf-8')).trimRight();
    const output = salesManager.generateReceipt(input);
    expect(output).toBe(expectedOutput);
});

test('Input 3', async () => {
    const input = (await fs.readFile(path.join('.', 'res', 'p2-3.input.txt'), 'utf-8')).trimRight();
    const expectedOutput = (await fs.readFile(path.join('.', 'res', 'p2-3.output.txt'), 'utf-8')).trimRight();
    const output = salesManager.generateReceipt(input);
    expect(output).toBe(expectedOutput);
});
