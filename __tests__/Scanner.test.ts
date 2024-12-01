import { Scanner } from '../src/Scanner';
import { Token } from '../src/types';
import { output01 } from './data/scannerTestOutputArrays/output01';
import { output02 } from './data/scannerTestOutputArrays/output02';
import { output03 } from './data/scannerTestOutputArrays/output03';
import { output04 } from './data/scannerTestOutputArrays/output04';

const scanner = new Scanner();


describe('Scanner', () => {
  it('tokenizes input correctly', () => {
    const input = '1: 2+3 mm';
    

    const tokens: Token[] = scanner.scan(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual(output01);
  });

  it('tokenizes input with function correctly', () => {
    const input = 'round(20) + 2{3}: round(10)mm + 1: 1';

    const tokens: Token[] = scanner.scan(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual(output02);
  });

  it('tokenizes repeated with grouped input correctly', () => {
    const input = '(2*3){2:3}:1:2.2{1:2}';

    const tokens: Token[] = scanner.scan(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual(output03);
  });

  // add tests for (round(5)) + 2mm{1}: 2{100mm}:1
  it('tokenizes input with nested function correctly', () => {
    const input = '(round(5)) + 2mm{1}: 2{100mm}:1';

    const tokens: Token[] = scanner.scan(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual(output04);
  });

  it('returns error for input: $mm', () => {
    expect(() => scanner.scan('$mm')).toThrow();
  });

  it('returns error for input: <', () => {
    expect(() => scanner.scan('<')).toThrow();
  });

  it('returns error for input: 2.f', () => {
    expect(() => scanner.scan('2.f')).toThrow();
  });

  it('returns error for input: mmf', () => {
    expect(() => scanner.scan('mmf')).toThrow();
  });

  it('returns error for input: 5mma', () => {
    expect(() => scanner.scan('5mma')).toThrow();
  });

  it('returns error for input: 1:.', () => {
    expect(() => scanner.scan('1:.')).toThrow();
  });

  it('returns error for input: XYZ.', () => {
    expect(() => scanner.scan('XYZ')).toThrow();
  });

  it('returns error for empty input', () => {
    expect(() => scanner.scan('')).toThrow();
  });
});
