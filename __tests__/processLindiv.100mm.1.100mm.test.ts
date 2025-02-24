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

describe("processLindiv 100mm:1:100mm", () => {
    it("pass", () => {
        expect(true).toBe(true);
    })

    // I-I
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("100mm:1:100mm", 333, 33, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([100, 67, 100]);
    });

    //I-O
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("100mm:1:100mm", 333, 33, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([100, 100, 67]);
    });

    // O-I
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("100mm:1:100mm", 333, 33, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([67, 100, 100]);
    });

    // M-M
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("100mm:1:100mm", 333, 33, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.I, sizerefedg2: DimRef.M, sizerefout2: DimRef.I})).toStrictEqual([83.5, 100, 83.5]);
    });

    // I-M
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("100mm:1:100mm", 333, 33, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.M, sizerefout2: DimRef.I})).toStrictEqual([100, 83.5, 83.5]);
    });

    // M-I
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("100mm:1:100mm", 333, 33, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([83.5, 83.5, 100]);
    });

    // O-O
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("100mm:1:100mm", 333, 33, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([67, 133, 67]);
    });


    it("otman test", () => {
        expect(processLindiv("1:n*100mm:1:200mm:2", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.M, sizerefedg2: DimRef.M, sizerefout2: DimRef.I})).toStrictEqual([15, 80,80,5,180, 40]);
    })

    it("otman test", () => {
        expect(processLindiv("1:n*100mm:1:200mm:2", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.M, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([10, 80,80,10,180, 40]);
    })
});