import { searchArtByCode, searchDepByRoute } from "../db/querys.ts";
import { ALLOW_NAMES, KID_SIZE, NUMBERS } from "./CONSTANTS.ts";

export const isReal = async (route: string) => {
  const Route = await searchDepByRoute(route);
  return Boolean(Route);
};

export const isRepeatCode = async (code: string) => {
  const Code = await searchArtByCode(code)[0];
  return Boolean(Code);
};

export const isValidCode = async ({ nomDep = "" }) => {
  const allowNames = ALLOW_NAMES.findIndex((elem) => elem === nomDep);
  const real: boolean = await isReal(nomDep);
  if (!real && allowNames >= 0) return nomDep;
  else return "";
};

export const isValidSize = (size: string) => {
  const searchNum = NUMBERS.findIndex((num) => num === size);
  const searchKidSize = KID_SIZE.findIndex((num) => num === size);
  return searchNum >= 0 || searchKidSize >= 0;
};

export const isValid = (nomDep:string) => ALLOW_NAMES.findIndex((elem) => elem === nomDep);

export const isValidRows = async ({ code = "", route = "", size = "" }) => {
  const real = await isReal(route);
  const repeat = await isRepeatCode(code);

  // Code
  if (code.includes("\\\\n")) return false;
  if (repeat) return false;
  // Route
  if (!real) return false;
  // Size
  if (size.includes("undefined")) return false;
  if (size !== "") if (!isValidSize(size)) return false;
  return true;
};