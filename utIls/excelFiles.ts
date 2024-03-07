import * as XLSX from "excel"
import * as cptable from "cptable"
import { upperR } from "./prepareXLSX.ts"

XLSX.set_cptable(cptable)

export const readFileAndSplited = (filename:string) => {
    const workbook = XLSX.readFile(filename);
    const sheetname = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_csv(workbook.Sheets[sheetname]).split(",")
}

export const readFile = (filename:string) => {
  const workbook = XLSX.readFile(filename);
  const sheetname = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_csv(workbook.Sheets[sheetname]).split("\n")
}

export const writeFile = async (list:string[][],file:string) => {
  const abc = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'
  const maxCollum = abc.charAt(list[0].length - 1)
  const workbook = {
    SheetNames: ["Sheet1"],
    Sheets: {
      Sheet1: {
        "!ref": `A1:${maxCollum}50000`,
        ...list.reduce((acc, row, index) => {
          row.forEach((cell, cellIndex) => {
            const cellAddress:string = String.fromCharCode(65 + cellIndex) + (index + 1);
            if(cellIndex === 3) cell = upperR(cell)
            acc[cellAddress] = { t: "s", v: cell }
          });
          return acc;
        }, {}),
      },
    },
  };
    // // Guarda el libro de Excel en un archivo
    await XLSX.writeFile(workbook, `./entrada/${file}.xlsx`)
} 