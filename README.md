# IMOS IX Linear Division Typscript Parser

this is a parser that mimics the behavior of IMOS IX 2023 linear division parser behavior 
it takes input linear division as a string "1:2" the total length
and an optional divider thickness parameter the division is none-virtual and it returns 
an array of numbers representing lengths in mellimeter for each zone

## IMOS IX Linear Division Analysis

there are two main types of input values: ratios and absolute
- ratios: 1:2 => ratio:ratio (the second division is double the first section)
- absolute 1mm:1 => absolute:ratio  (the first section is 1mm of length and the rest is taken by the second)

### Normal Ratio Values
- for x:y:z 1:2:1 && total length == 600mm
	for normal ratio values substract absolute values from total length, then divide the rest by the total parts => each part gets an absolute value
	1) figuring out the value of 1 => 600mm / total parts => 600mm / 4 = 150mm == Ref
	2) Ref x X : Ref x Y : Ref x Z
	3) 150mm : 300mm : 150mm

### Reduction of line EX: 1[100mm] : 1 (not supported for now)
- for A [ Y ] : 1 == 1 [ 100mm ] : 1 && total length == 480mm
	should be treated like a normal ratio => getting an absolute value X = 480mm / 2 == 240mm
	adding 2 constraints 
	1) Result / [ Y : 100mm ] == Natural Number
	2) Result <= 240mm
	3) method: while (Result < 240mm) => { Result += 100mm} => Result == 200mm
	4) absolute value 200mm : 280mm

### Repetition EX: 3{1:2}:1
":" is implicit in the linear division definition 
- for X{LinDiv}:Y == 3{1:2}:1
	should first parse the Repetition to show explicit divisions
	1) multiply the division inside {} by X 
	2) 1:2:1:2:1:2:1
	3) treat it like a normal ratio division

### Negative Values EX: -200mm:1:-200mm (not supported for now)
- this one is tricky as its position isn't within the zone size as for a -X mm:1:-Y mm for a total length of 1000mm the first negative value is positioned in -200mm and second is in 1200mm 

### Values Containing round EX: n* ((X-60)/round((X-60)/100)) mm
 for 30mm+1:n* ((X-60)/round((X-60)/100)) mm:30mm
   `X` is the total length and X-60 is the Rest from the substruction of 60mm == `30mm + 30mm`
   `round(rest/100)` to get the step 
   1) adding 0.5 to it => maximum is 100mm

### 1+Xmm Ratios
- for these kind of values the absolute value is taken from the total length before proceeding calculations 
  for 1+30mm:1:1 for a total length of 462mm
  1) 462mm-30mm == 432mm
  2) 432mm/3 = 144mm
  3) for the first part we add 30mm which results in 144mm+30mm = 174mm
  4) absolute values: 174mm:144mm:144mm

### Behavior analysis (version IMOS IX 2023)

1) ratio + absolue mm 
    the mm showing outside in a born makes the value absolute and the other operands without mm ratios
    could use (expression) mm as well
2) x*y:1 is invalid as it doesn't allow * / operators outside parentheses
3) x: (a * b)+c+(d * f mm) 
    the intuitive behavior for this is to have (d * f mm) absolute (in mm) and other operands ratio
    BUT IT DOESN'T: if we have a mm inside () the entire section (a * b)+c+(d * f mm) becomes absolute
4) function(x) + a : y => absolute : absolute
    you may consider function(x) like previous, a value that makes the entire section absolute if not in parentheses
5) (function(x)) + a : y => ratio : ratio
    even if you do function(x)mm + y still => absolute + absolute
    you need to do (function(x))mm + y to have => absolute + ratio
6) 1{x:y}:z => x:y:z the number occurences of x:y is defined by the left hand operand value
7) x + 2{x:y}:1 => x+x:y:x:y:1 
    when we have an addition to a repetition on the left side it is added only to the first occurence of 
    the inside division
8) 2{x:y} + x:1 => x:y:x:y+x:1
9) (expression){x:y} 
    the result of expression left hand to repetition is rounded if inside ()
    (2.7){1mm}:1 => 3{1mm}:1
    if not inside () and the value is not integer it results in a weird behavior
    2.4{1mm}:2 => 2.1:1:1:1:2 => the number of repetitions is 4 and it makes the first division 
    a fractional part of 2
10) n * y cannot be multiplied to a grouping that contains mm n*(100mm) is wrong even if mm outside (100mm+1)mm
11) n* y cannot belong to a binary expression like n* y + 1 (multiple divisions with n* is not supported yet you could use only one)

### USAGE

```$ npm install imos-linear-division```

Once the package is installed, you can import the library using import or require approach:

```
import { processLindiv } from 'imos-linear-division';

```

the processLinDiv function returns an array of numbers (in mm)
takes a string linear division
the total length 
and an optional dividerthickness

```
const result = processLindiv("50mm+2:2:2{50mm}:3", 500, 20)

```
Example of usage with variables

```
processLindiv("$var1 mm+$var2:$var3:$var3{$var1 mm}:$var4", 500, 20, { var1: 50, var2: 2, var3: 2, var4: 3 })
// result == [127.14, 77.14, 50, 50, 115.71]

```


