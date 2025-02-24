import { processLindiv } from "../src/processLinDiv";

enum DimRef {
    I = "I",
    O = "O",
    M = "M",
  }
  
type DimRefProps = {
    sizerefout1: DimRef;
    sizerefedg1: DimRef;
    sizerefmid: DimRef;
    sizerefedg2: DimRef;
    sizerefout2: DimRef;
};

describe("processLindiv 2:60mm:n*55mm:30mm:1", () => {
    it("pass", () => {
        expect(true).toBe(true);
    })

    // 1:15:1

    // I-I
    it("should parse 1:15:1 correctly", () => {
        expect(processLindiv("1:15:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([27.06, 405.88, 27.06]);
    });

    // O-I
    it("should parse 1:15:1 correctly", () => {
        expect(processLindiv("1:15:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([8.24, 423.53, 28.24]);
    });

    // O-M-M
    it("should parse 20mm:1:15mm correctly", () => {
        expect(processLindiv("20mm:1:15mm", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.M, sizerefedg2: DimRef.M, sizerefout2: DimRef.I})).toStrictEqual([0, 455, 5]);
    });

    // I-I 1:3:1
    it("should parse 1:3:1 correctly", () => {
        expect(processLindiv("1:3:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([92, 276, 92]);
    });

    // I-O 1:3:1
    it("should parse 1:3:1 correctly", () => {
        expect(processLindiv("1:3:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([96, 288, 76]);
    });

    // O-O 1:3:1
    it("should parse 1:3:1 correctly", () => {
        expect(processLindiv("1:3:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([80, 300, 80]);
    });

    // O-M-O 1:3:1
    it("should parse 1:3:1 correctly", () => {
        expect(processLindiv("1:3:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.M, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([84, 292, 84]);
    });

    // O-O-O
    it("should parse 1:3:1 correctly", () => {
        expect(processLindiv("1:3:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.O, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([88, 284, 88]);
    });
});