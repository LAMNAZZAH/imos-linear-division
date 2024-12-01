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
});
