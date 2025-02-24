import { Sections } from "../types";

enum DimRef {
    I = "I",
    O = "O",
    M = "M",
};

type DimRefProps = {
    sizerefout1: DimRef;
    sizerefedg1: DimRef;
    sizerefmid: DimRef;
    sizerefedg2: DimRef;
    sizerefout2: DimRef;
};

export const handleNumberLiteralWithDimRef = (
    value: number,
    index: number,
    dividerThickness: number,
    dimRefProps: DimRefProps | undefined,
    sections: Sections
  ) => {
    if (index === 0 && dimRefProps?.sizerefedg1 === DimRef.M) {
      //accumulatedDRFromMmValues += dividerThickness / 2;
      return value - dividerThickness/2;
    } else if (index === 0 && dimRefProps?.sizerefedg1 === DimRef.O) {
      //accumulatedDRFromMmValues += dividerThickness;
      return value - dividerThickness;
    } else if (
      index > 0 &&
      index < sections.sections.length - 1 &&
      dimRefProps?.sizerefmid === DimRef.M
    ) {
      //accumulatedDRFromMmValues += dividerThickness;
      return value - dividerThickness;
    } else if (
      index > 0 &&
      index < sections.sections.length - 1 &&
      dimRefProps?.sizerefmid === DimRef.O
    ) {
      //accumulatedDRFromMmValues += dividerThickness * 2;
      return value - dividerThickness * 2;
    } else if (
      index === sections.sections.length - 1 &&
      dimRefProps?.sizerefedg2 === DimRef.M
    ) {
      //accumulatedDRFromMmValues += dividerThickness / 2;
      return value - dividerThickness / 2;
    } else if (
      index === sections.sections.length - 1 &&
      dimRefProps?.sizerefedg2 === DimRef.O
    ) {
      //accumulatedDRFromMmValues += dividerThickness;
      return value - dividerThickness;
    }
    return value;
  };