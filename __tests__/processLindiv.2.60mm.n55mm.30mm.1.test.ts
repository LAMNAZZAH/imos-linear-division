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


    // O-O 
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([40, 60, 55, 55, 55, 55, 30, 10]);
    })

    // I-I
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([33.33, 60, 55, 55, 55, 55, 30, 16.67]);
    })

    // I-O
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([46.67, 60, 55, 55, 55, 55, 30, 3.33]);
    })

    // O-I
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([26.67, 60, 55, 55, 55, 55, 30, 23.33]);
    })

    // I-M
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.M, sizerefout2: DimRef.I})).toStrictEqual([40, 60, 55, 55, 55, 55, 30, 10]);
    })

    // M-I
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([30, 60, 55, 55, 55, 55, 30, 20]);
    })

    // M-M
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.I, sizerefedg2: DimRef.M, sizerefout2: DimRef.I})).toStrictEqual([36.67, 60, 55, 55, 55, 55, 30, 13.33]);
    })

    // M-O
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([43.33, 60, 55, 55, 55, 55, 30, 6.67]);
    })

    // O-M
    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.M, sizerefout2: DimRef.I})).toStrictEqual([33.33, 60, 55, 55, 55, 55, 30, 16.67]);
    })
});