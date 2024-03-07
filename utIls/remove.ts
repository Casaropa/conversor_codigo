import { KID_SIZE, NUMBERS, SIZE } from "./CONSTANTS.ts"

export function removeSize(world:string){
  const splited = world.split("\\\\")
  const thereSize = SIZE.filter( s => s === splited.at(-1))
  if(thereSize[0]) splited.pop()
  const thereNumber = NUMBERS.filter( s => s === splited.at(-1))
  if(thereNumber[0]) splited.pop()

  return splited.join("\\\\")
}
  
export function removeSizeChild(world:string){
  const splited = world.split("\\\\")
  const thereSize = KID_SIZE.filter( s => s === splited.at(-1))
  if(thereSize[0]) splited.pop()
  return splited.join("\\\\")
}

export function removeSizeShoes(world:string){
  const splited = world.split("\\\\")
  const thereSize = KID_SIZE.filter( s => s === splited.at(-1))
  if(thereSize[0]) splited.pop()
  return splited.join("\\\\")
}

export const removeBano = (world:string) => {
  if(world.includes("traje")){
    const splited = world.split('\\\\')
    splited[0] = 'traje_bano'
    const joined = splited.join('\\\\')
    world = joined 
  }
  return world
}

export const addSlash = (world:string) => {
  const withOutSpace = world.replace(/ /g, '')
  return withOutSpace.padEnd(withOutSpace.length + 1, "\\\\")
} 