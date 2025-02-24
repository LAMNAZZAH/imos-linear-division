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

describe("processLindiv", () => {
    it("pass", () => {
        expect(true).toBe(true);
    })


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
    it('should parse 460:1:1:0 correctly', () => {
        expect(processLindiv("460:1:1:0", 500, 20)).toStrictEqual([438.1, 0.95, 0.95, 0]);
    })
    // create a test for more tricky cases didn't exist before
    it('should parse 460:1:1:0 correctly', () => {
        expect(processLindiv("460:1:1:0", 500, 20)).toStrictEqual([438.1, 0.95, 0.95, 0]);
    })
    it('should parse 480:1 correctly', () => {
        expect(processLindiv("480:1", 500, 20)).toStrictEqual([479, 1]);
    })
    it('should parse 0:480:0:1 correctly', () => {
        expect(processLindiv("0:480:0:1", 500, 20)).toStrictEqual([0, 439.09, 0, 0.91]);
    })
    
    // repated tests for values with variables
    it('should parse value with variables correctly', () => {
        expect(processLindiv('0:$myvariable:0:1', 500, 20, {'myvariable': 480})).toStrictEqual([0, 439.09, 0, 0.91]);
    })

    it('should parse $var:1:1:0 correctly', () => {
        expect(processLindiv("$var:1:1:0", 500, 20, {"var": 460})).toStrictEqual([438.1, 0.95, 0.95, 0]);
    })

    it('should parse {} with n* with variables correctly', () => {
        expect(processLindiv("$var mm+2:2:2{$var mm}:3", 500, 20, {"var": 50})).toStrictEqual([127.14, 77.14, 50, 50, 115.71]);
    })

    it('should parse {} with n* with ratio and absolute values with variables correctly', () => {
        expect(processLindiv("$var1 mm+$var2:n*$var3 mm:$var4{$var5 mm}:$var4:$var6", 500, 20, { var1: 10, var2: 5, var3: 102, var4: 3, var5: 70, var6: 1 })).toStrictEqual([42.22, 102, 70, 70, 70, 19.33, 6.44]);
    });
    
    it('should parse 2{$var mm}:n*100mm:3:2:1 with variables correctly', () => {
        expect(processLindiv("$var1{$var2 mm}:n*$var3 mm:$var4:$var5:$var6", 500, 20, { var1: 2, var2: 50, var3: 100, var4: 3, var5: 2, var6: 1 })).toStrictEqual([50, 50, 100, 100, 40, 26.67, 13.33]);
    });
    
    it('should parse $var+2:2:2{$var}:3 with variables correctly', () => {
        expect(processLindiv("$var1 mm+$var2:$var3:$var3{$var1 mm}:$var4", 500, 20, { var1: 50, var2: 2, var3: 2, var4: 3 })).toStrictEqual([127.14, 77.14, 50, 50, 115.71]);
    });

    //! with dimRef 100mm:n*100mm:100mm:1
    it("should parse value with dimension reference correctly", () => {
        expect(processLindiv("100mm:n*100mm:100mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([90, 100, 100, 100, 30]);
    })

    it("should parse value with dimension reference correctly", () => {
        expect(processLindiv("100mm:n*100mm:100mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([80, 100, 100, 100, 40]);
    })

    // //!
    it("should parse value with dimension reference correctly", () => {
        expect(processLindiv("100mm:n*100mm:100mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.M, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([80, 80, 80, 80, 80, 0]);
    })

    it("should parse value with dimension reference correctly", () => {
        expect(processLindiv("100mm:n*100mm:100mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.O, sizerefmid: DimRef.O, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([80, 60, 60, 60, 60, 60, 0]);
    })

    it("should parse sheet tested value correctly", () => {
        expect(processLindiv("2:60mm:n*55mm:30mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.M, sizerefmid: DimRef.I, sizerefedg2: DimRef.O, sizerefout2: DimRef.I})).toStrictEqual([43.33, 60, 55, 55, 55, 55, 30, 6.67]);
    })

    it("should parse imos db lindiv value correctly", () => {
        expect(processLindiv("150mm:n*88mm:1+150mm:1", 500, 20, {}, {sizerefout1: DimRef.I, sizerefedg1: DimRef.I, sizerefmid: DimRef.I, sizerefedg2: DimRef.I, sizerefout2: DimRef.I})).toStrictEqual([150, 88, 176, 26]);
    })

    

    //!
    // // TODO: in n*LINK 
    it('should have 4 80mm for n* section', () => {
        expect(processLindiv("2:50mm:n*80mm:1+10mm", 500, 20)).toStrictEqual([0, 50, 80, 80, 80, 80, 10])
    });

    // //9{1}
    it('should parse 9{1} correctly', () => {
        expect(processLindiv("9{1}", 500, 20)).toStrictEqual([37.78, 37.78, 37.78, 37.78, 37.78, 37.78, 37.78, 37.78, 37.78]);  
    });
});
