import { processLindiv } from "../src/processLinDiv";

describe("processLindiv", () => {
    it('should return "1" when input is "1"', () => {
        expect(processLindiv("1", 500, 20)).toStrictEqual([500]);
    });
    it('should parse round right with n*', () => {
        expect(processLindiv("round(20)+2:n*100mm:1", 500, 20)).toStrictEqual([22, 100, 100, 100, 98]);
    })
    it('should parse {} with n* correctly', () => {
        expect(processLindiv("2{50mm}:n*100mm:3:2:1", 500, 20)).toStrictEqual([50, 50, 100, 100, 40, 26.67, 13.33]);
    } )
    //50mm+2:2:2{50mm}:3
    it('should parse {} with n* correctly', () => {
        expect(processLindiv("50mm+2:2:2{50mm}:3", 500, 20)).toStrictEqual([127.14, 77.14, 50, 50, 115.71]);
    })
    it('should parse {} with n* with ratio and absolute values correctly', () => {
        expect(processLindiv("10mm+5:n*102mm:3{70mm}:3:1", 500, 20)).toStrictEqual([42.22, 102, 70, 70, 70, 19.33, 6.44]);
    })
    it('should parse {} with n* without divider correctly', () => {
        expect(processLindiv("10mm+5:n*102mm:3{70mm}:3:1", 500)).toStrictEqual([52.22, 102, 102, 70, 70, 70, 25.33, 8.44]);
    })
});
