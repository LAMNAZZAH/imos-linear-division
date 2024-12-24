import { Sections } from "./types";

enum DimRef {
  I = "I",
  O = "O",
  M = "M",
}

export class DimensionReference {
  public accumulateIncorporatedThicknesses(
    sections: Sections,
    startPanelThk: number,
    endPanelThk: number,
    dividerThk: number,
    sizerefout1: DimRef,
    sizerefedg1: DimRef,
    sizerefmid: DimRef,
    sizerefedg2: DimRef,
    sizerefout2: DimRef
  ): number {
    let accumulatedThicknesses = 0;

    // middle sections
    if (sizerefmid === DimRef.M) {
      for (let i = 1; i < sections.sections.length - 1; i++) {
        accumulatedThicknesses += dividerThk;
      }
    }

    if (sizerefmid === DimRef.O) {
      for (let i = 1; i < sections.sections.length - 1; i++) {
        accumulatedThicknesses += dividerThk * 2;
      }
    }

    //first section
    if (sizerefout1 === DimRef.M) {
      accumulatedThicknesses += startPanelThk / 2;
    }

    if (sizerefout1 === DimRef.O) {
      accumulatedThicknesses += startPanelThk;
    }

    if (sizerefedg1 === DimRef.M) {
      accumulatedThicknesses += startPanelThk / 2;
    }

    if (sizerefedg1 === DimRef.O) {
      accumulatedThicknesses += startPanelThk;
    }

    //end section
    if (sizerefout2 === DimRef.M) {
      accumulatedThicknesses += endPanelThk / 2;
    }

    if (sizerefout2 === DimRef.O) {
      accumulatedThicknesses += endPanelThk;
    }

    if (sizerefedg2 === DimRef.M) {
      accumulatedThicknesses += endPanelThk / 2;
    }

    if (sizerefedg2 === DimRef.O) {
      accumulatedThicknesses += endPanelThk;
    }

    return accumulatedThicknesses;
  }
}
