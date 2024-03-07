import { removeBano } from "./remove.ts";
import { isValid } from "./validated.ts"

export function filterRoutes( route:string[] ):string[] {
  const repeated = route.reduce( (acc:string[], el:string):string[] => {
    const removeSpace = el.trim()
    return acc.includes(removeSpace) ? acc : acc = [...acc, removeSpace]
  }, Array(0)) 
  
  const filter =  repeated.reduce( (acc:string[], el:string):string[] => {
    let newEl = removeBano(el)
    
    if(newEl === 'hogar\\\\ropadecama\\\\') newEl = 'hogar\\\\ropa de cama\\\\' 
    const valid = isValid(newEl)
    if(!valid) return acc
    return [...acc, newEl]
  }, Array(0))
  return filter
}