import { getRouteAndSizes } from "./getRouteAndSizes.ts"

interface listArt{
    localCode:string, 
    code:string, 
    prc:number,
    route:string, 
    type:string, 
    size:string, 
    name:string
  }
  
export const cleanList = (list:string[][]) => {
    const reducedList = list.reduce( (acc:listArt[], elem:string[]) => {
      if(!elem[0]) return acc
      const code = elem[1] ? elem[1] : 'NC' 
      const types = {
        "1": "Producto",
        "2": "Caja",
        "N": "NC"
      }
      const splited = elem[0].split('\n')      
      const localCode = String(splited[1]).includes("Nc") ? splited[1] : String(splited[1]).toUpperCase()
      let route, size
      if(elem[2].includes('hogar') || elem[2].includes('accesorio')){
        const addSlash = elem[2]+'\\'
        route = addSlash.replace(/\\/ig,"\\\\")
        size = null
      }else{
        const rs = getRouteAndSizes(elem[2])
        route = rs.route
        size = rs.size 
      }
      
      const name = !size ? route.replace(/\\\\/ig, " ").trim() : `${route.split("\\\\")[0]} ${size}`
      const index = localCode.slice(0,1)
      const type:string = types[index] || "NC"
      const prc = Number(elem[3])
      const newElem = {localCode, code, prc, route, type, size, name}
      return acc = [...acc, newElem]; 
    }, Array(0))
   
    return reducedList
  }