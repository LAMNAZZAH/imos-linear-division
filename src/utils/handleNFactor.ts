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


export const handleNFactor = (
    value: number,
    index: number,
    dividerThickness: number,
    dimRefProps: DimRefProps | undefined,
    sections: Sections
  ) => {
    let nStartFactor = value;
    let nMiddleFactor = value;
    let nEndFactor = value;
    if (index === 0) {
      if (dimRefProps?.sizerefedg1 === DimRef.M)
        nStartFactor -= dividerThickness / 2;
      if (dimRefProps?.sizerefedg1 === DimRef.O)
        nStartFactor -= dividerThickness;
      if (dimRefProps?.sizerefmid === DimRef.M)
        nMiddleFactor -= dividerThickness;
      if (dimRefProps?.sizerefmid === DimRef.O)
        nMiddleFactor -= dividerThickness * 2;
      if (sections.sections.length === 1) {
        if (dimRefProps?.sizerefedg2 === DimRef.M)
          nEndFactor -= dividerThickness / 2;
        if (dimRefProps?.sizerefedg2 === DimRef.O)
          nEndFactor -= dividerThickness;
      } else {
        if (dimRefProps?.sizerefmid === DimRef.M)
          nEndFactor -= dividerThickness;
        if (dimRefProps?.sizerefmid === DimRef.O)
          nEndFactor -= dividerThickness * 2;
      }
    } else if (index > 0 && index < sections.sections.length - 1) {
      if (dimRefProps?.sizerefmid === DimRef.M) {
        nStartFactor -= dividerThickness;
        nMiddleFactor -= dividerThickness;
        nEndFactor -= dividerThickness;
      } else if (dimRefProps?.sizerefmid === DimRef.O) {
        nStartFactor -= dividerThickness * 2;
        nMiddleFactor -= dividerThickness * 2;
        nEndFactor -= dividerThickness * 2;
      }
    } else if (index === sections.sections.length - 1) {
      if (dimRefProps?.sizerefmid === DimRef.M) {
        nStartFactor -= dividerThickness;
        nMiddleFactor -= dividerThickness;
      }
      if (dimRefProps?.sizerefmid === DimRef.O) {
        nStartFactor -= dividerThickness * 2;
        nMiddleFactor -= dividerThickness * 2;
      }
      if (dimRefProps?.sizerefedg2 === DimRef.M)
        nEndFactor -= dividerThickness / 2;
      if (dimRefProps?.sizerefedg2 === DimRef.O)
        nEndFactor -= dividerThickness;
    }

    return {
      nStartFactor,
      nMiddleFactor,
      nEndFactor,
    };
  };