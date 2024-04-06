import { notacionCientifica } from "./cleanList.ts";

export const exitList = (elemsList:string[][]) =>{
  let list: (string|null)[][] = []
  elemsList.pop()
  for( const value of elemsList) {
    const code = !value[0] ? "NC" : notacionCientifica(value[0]) 
    console.log(code);
    
    const amount = !value[1] ? "1" : value[1]
    const price = !value[2] ? "0" : value[2]    
    const a = !value[3] ? -1 : value[3].indexOf("[")
    const wihtoutCode = a !== -1 ? value[3]?.slice(0, a - 1).toLocaleLowerCase() : value[3]?.trim().toLocaleLowerCase()
    if(wihtoutCode?.includes("hogar") || wihtoutCode?.includes("accesorios")){
      const route = wihtoutCode + "\\".toLowerCase()
      const size = null
      list = [...list, [code, amount, price, route, size]]
    }else{
      const splited = wihtoutCode?.split("\\")
      const size = wihtoutCode?.includes('zapatos') ?
      splited[3]?.replace("t","") :
      wihtoutCode?.includes('nin') ?  splited[2] :
      splited[2]?.replace("talla ","")
      
      splited.pop()
      const joined = splited.join("\\")
      const route = joined+"\\".toLowerCase()
      list = [...list, [code, amount, price, route, size]]
    }
}

return list
}