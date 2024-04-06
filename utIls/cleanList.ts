import { getRouteAndSizes } from "./getRouteAndSizes.ts"

interface listArt{
    localCode:string, 
    code:string, 
    prc:number,
    route:string, 
    type:string, 
    size:string|null, 
    name:string,
    lote:number|null
  }
  
export function notacionCientifica(elem:string){
  const notacion = /^\d+(\.\d+)?[eE][+-]?\d+$/.test(elem)
  if(!notacion) return elem
  const numeroNotacionCientifica = Number(elem)
  const natureNumber = parseFloat(numeroNotacionCientifica.toExponential())
  return String(natureNumber)
}

export const cleanList = (list:string[][]) => {
  let reducedList:listArt[] = []
  for(const elem of list ) {
    if(!elem[0]) continue
    const code = elem[1] ? notacionCientifica(elem[1]) : 'NC' 
    const types = {
      "1": "Producto",
      "2": "Caja",
      "N": "NC"
    }      
    const localCode = elem[0]?.includes("N") ? elem[0] : elem[0]?.toUpperCase()
    let route, size
    if(elem[2]?.includes('hogar') || elem[2]?.includes('accesorio')){
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
    const prc = elem[3] ? Number(elem[3]) : 0
    const lote = !elem[4] ? null : Number(elem[4])
    const newElem:listArt = {localCode, code, prc, route, type, size, name, lote}
    reducedList = [...reducedList, newElem]; 
  }
  
  return reducedList
}