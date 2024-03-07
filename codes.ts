import { searchArtById } from "./db/querys.ts";
import { searchDepByRoute, insertArtRow, searchMAX } from "./db/querys.ts"

const Beginer = (art) =>{
  let beginer
    if(art.includes('accesorios')) beginer = "N1"
    if(art.includes('dama')) beginer = "N2"
    if(art.includes('bebe')) beginer = "N3"
    if(art.includes('hogar')) beginer = "N4"
    if(art.includes('hombre')) beginer = "N5"
    if(art.includes('maquillaje')) beginer = "N6"
    if(art.includes('nina')) beginer = "N7"
    if(art.includes('nino')) beginer = "N8"
    return beginer  
  }
  
  const HogAcc = (gen:string, gr:string) => {
    if(!gen) return "00"
    const splited = gen.split(" ")
    const g = splited[0]
    if(gr === "accesorios"){
      if(g === "bolso") return "01" 
      if(g === "cartera") return "02" 
      if(g === "gorra") return "03" 
      if(g === "lentes") return "04" 
      if(g === "sombrero" || g === "gorro") return "05" 
      if(g === "reloj") return "06" 
      if(g === "joyeria") return "07" 
      if(g === "celular") return "08" 
      if(g === "animal") return "09" 
      if(g === "bufanda") return "10" 
      if(g === "correa") return "11" 
      if(g === "salud") return "12"
      if(g === "maquillaje") return "13"
    }
    if(gr === "hogar"){
      if(g === "bano") return "01" 
      if(g === "cocina") return "02" 
      if(g === "decoracion") return "03" 
      if(g === "deporte") return "04" 
      if(g === "electrodomestico") return "05" 
      if(g === "ferreteria") return "06" 
      if(g === "jardineria") return "07" 
      if(g === "juguetes") return "08" 
      if(g === "utiles" || g === "libreria") return "09" 
      if(g === "ropa") return "10" 
      if(g === "navidad") return "11" 
    }
    return "00"
  }
  
  const clothes = (gender="",group="") =>{
    const gen = gender.toLowerCase()
    const gr = group.toLowerCase()
    const Genders = {
    "dama": 0, 
    "hombre": 1,
    "nina": 2,
    "nino": 3
    }
    const Groups = {
      "pantalon": ["10", "09", "07", "07"], 
      "pantaleta": ["09","00","06", "00"], 
      "mono": ["08", "08", "05", "06"], 
      "media": ["07", "07", "04", "05"], 
      "correa": ["06", "06", "06", "06"], 
      "conjuntos": ["05", "05", "03", "04"], 
      "chaqueta": ["04", "04", "02", "03"], 
      "camisa": ["03", "03", "01", "02"], 
      "brasier": ["02", "00", "00", "00"], 
      "short": ["11", "10", "08", "08"], 
      "sueter": ["12", "11", "09", "09"], 
      "vestidos": ["14", "00", "12", "07"], 
      "zapatos": ["15", "12", "12", "12"], 
      "boxer": ["00", "02", "00", "01"], 
    }
    if(gr === "traje de bano"){
      if(gen === "dama") return "13"
      if(gen === "hombre") return "12"
      if(gen === "nina") return "10"
      if(gen === "nino") return "10"
    }
    if(!Groups[gr]) return HogAcc(gen,gr)
    return Groups[gr]?.at(Genders[gen]) || "00"
  }
  
  const Second = (art) =>{
    const ruta = art.ruta
    const splited = ruta.split("\\")
    const group = splited[0]
    const gender = ruta === "Accesorios  [168]" || ruta === "Hogar  [100]" ?
          "" :
          splited[1]
    return clothes(gender,group)
  }
  
  const letterSizes = (art) =>{
    const splited = art.split(" ")
    const size = splited.at(-1)
    const SIZES = {
      "u": "00",
      "xs": "01",
      "s": "02",
      "m": "03",
      "l": "04",
      "xl": "05",
      "xxl": "06",
      "xxxl": "07",
      "xxxxl": "08",
    }
    return SIZES[size] || "00"
  }
  
  const numberSizes = (art) =>{
    const splited = art.split("\\")
    const size = splited.at(-1).replace("T","")
    const sizeNumber = Number(size)
    let codeSize = "0"
    if(sizeNumber > 17 && sizeNumber <= 21) codeSize = String(sizeNumber - 5) 
    if(sizeNumber > 21 && sizeNumber <= 47) codeSize = String(sizeNumber - 4)
    if(sizeNumber >= 48) codeSize = "45" 
  
    const type = splited[2]
    const TYPES = {
      "botas": "1",
      "cholas": "2",
      "deportivos": "3",
      "deportivo": "3",
      "casuales": "4",
      "tacones": "6",
    }
    const newCode = TYPES[type] ?
      codeSize !== 0 ?
        TYPES[type] + codeSize :
        TYPES[type] + "00" :
      "000"
    return newCode || "000"
  }
  
  const Third = (art:string) =>{
    if(art.includes("Hogar") || art.includes("Accesorios")) return "000"
    const s = art.indexOf("[")
    const wihtoutCode = art.slice(0,s - 1)
    const size = wihtoutCode.includes('Zapato') ?
          numberSizes(wihtoutCode) : 
          letterSizes(wihtoutCode)
    return size
  }
  
export const createNC = (art) =>{
    const ruta = art.ruta
    const begin = Beginer(ruta)
    const prc = String(art.prc).replace(".","")
    const second = Second(art)
    const third = Third(ruta)
    const last = prc.padStart(3,"0")
    return begin+second+third+last
  }
  
  
export async function Createcode(art){
    const route = art.ruta.replace(/\\/ig,"\\\\").toLowerCase()
    const code = art.code
    const price = art.precio

    let type = 'Producto' 
    if( route.includes('hogar') ) type = 'Caja'
    if( route.includes('accesorios') ) type = 'Caja'
    if( code === 'NC') type = 'NC'

    if(type !== 'NC'){
      const max = await searchMAX(type)
      const newLocalCode = String(Number(max[0].max) + 1)
      const size = art.talla
      const dep = await searchDepByRoute(route)
      const idDepart = dep[0]?.id_departamento
      const name = route.includes('hogar') || route.includes('accesorios') ?
       route.replace(/\\\\/ig," ") :
       route.replace(/\\\\/ig," ")  + size
      const res = await insertArtRow( code, newLocalCode, name, price, size, type, idDepart )
      const lastIndex = res.lastInsertId
      return searchArtById(lastIndex)
    }else{
      const newCode = createNC(art)
      return newCode
    }
  }