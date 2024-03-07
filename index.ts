import { table } from "table"
import parseArgs from "std/args";
import { emptyDir } from "fs"
import { cleanList } from "./utIls/cleanList.ts";
import { filterRoutes } from "./utIls/filters.ts";
import { readFile, readFileAndSplited, writeFile } from "./utIls/excelFiles.ts";
import { ArrayList, /*ArrayList2*/ } from "./utIls/ArrayList.ts";
import { cleanXLSX } from "./utIls/prepareXLSX.ts"
import {
  AllDepart,
  insertArt,
  insertDepart,
  searchArtByCode,
  searchArtInfo,
  searchNC,
  searchDepByCode,
  searchSend,
  updatePrice
  } from "./db/querys.ts";
import { exitList } from "./utIls/exitList.ts";
import { cleanR } from "./utIls/prepareXLSX.ts";
import { Createcode } from "./codes.ts";
const createTable = ({list=[], columns=[""]}) => table(list, [...columns], {padding:4, upcaseHeader:true})

interface listArt{
  localCode:string,
  code:string,
  prc:number,
  route:string,
  type:string,
  size:string|null,
  name:string
}

async function main() {
  const arg = parseArgs(Deno.args)
  console.clear()
  if (arg.mostrar) {
    const departamento = await AllDepart();
    const departTab = createTable({list:departamento,columns:["id_departamento", "nombre_depart", "codigo"]})
    console.log(departTab)
  }

  if(arg.buscar){

    if(arg.codigo){
      const codigo:string = arg.codigo
      let res = ["Por favor defina que desea buscar"]
      if(arg.dep) res = await searchDepByCode(codigo)
      if(arg.art) res = await searchArtByCode(codigo)

      console.log(res[0])
    }else{
      console.error("Codigo no proporcionado")
      Deno.exit(1);
    }
  }

  if (arg.arguments) console.log(arg);

  if (arg.remove) await emptyDir(arg.ruta)

  if (arg.leer) {
    const filename =  `./test/${arg.ruta}.xlsx`;
    if (!arg.ruta) {
      console.error('usage: sheet2csv <filename> [sheetname]');
      Deno.exit(1);
    }
    const splited = readFileAndSplited(filename)
    const list = ArrayList(splited)
  //  const lista = ArrayList2(splited)
    
    if(arg.dep){
      const routeList = cleanList(list)
      const routes = routeList.map((dep:listArt):string => dep.route)
      
      const filteredRoute = filterRoutes(routes)
      for( const nomDep of filteredRoute){
        try{
          console.log(await insertDepart(nomDep))
        }catch(err){
          console.error(err.message)
          console.log(nomDep)
        }
      }
    }
    if(arg.art){
      const artList:listArt[] = cleanList(list);
      console.time()
      for(const Art of artList){
        try{
          console.log(await insertArt(Art))
        }catch(err){
          console.error(err.message)
          console.log(Art.route)
        }
      }
      console.timeEnd()
   }
  }
  if(arg.ingresar){
    const filename = `./test/${arg.ruta}.xlsx` ;
    if (!filename) {
      console.error('usage: sheet2csv <filename> [sheetname]');
      Deno.exit(1);
    }
    console.time()
    await emptyDir("./entrada")
    // const splited = readFileAndSplited(filename)
    // const list = exitList(splited)
    // const listProd = list.slice(1,list.length)
    const splited = readFile(filename)
    const inicial = arg.manual ? 1 : 2
    const final = arg.manual ? 1 : 2
    const sliced =  splited.slice(inicial, splited.length - final )
    let list:string[][] = []
    for(const art of sliced){
      const splited = art.split(",")
      if( !arg.manual ) splited.shift()
      list = [...list, splited]
    }
    const listProd = exitList(list)
    
    let a:string[][] = []
    let b
    let bardCode
    for( const row of listProd ){
      if(row[0] !== 'NC'){
        b = await searchArtInfo(row[0])
        bardCode = row[0]
      }else{
        b = await searchNC(row[3],row[2], row[4])
        bardCode = b[0]?.codigo_interno
      }
      const cant = row[1]
      if(!b[0]){
        const code = row[0]
        const ruta = row[3]
        const precio = row[2]
        const talla = row[4]
        const newArt = {code,ruta,precio,talla}
        
        const res = await Createcode(newArt)
        const route = cleanR(res[0]?.talla, res[0]?.ruta)
        const p = res[0]?.precio
        const splitedP = p.split(".")
        const price = splitedP[1] === "0" ?
          splitedP[0] :
          p.replace(".", ",")
        a = [...a, [res[0]?.codigo_interno, code, cant, route, price]]
      }else{
        const route = cleanR(b[0]?.talla, b[0]?.ruta)
        const p = b[0]?.precio
        const splitedP = p.split(".")
        const price = splitedP[1] === "0" ?
        splitedP[0] :
        p.replace(".", ",")
        a = [...a, [b[0]?.codigo_interno, bardCode, cant, route, price]]
      }
    }
   const header = ["articulo","codigo", "cant", "ruta", "precio"]
    a.unshift(header)
  //  console.log(listProd);
   await writeFile(a,'adsm')
    console.timeEnd()
  }
  if(arg.salida){
    const filename = `./test/${arg.ruta}.xlsx` ;
    if (!filename) {
      console.error('usage: sheet2csv <filename> [sheetname]');
      Deno.exit(1);
    }
    await emptyDir("./entrada")
    const splited = readFile(filename)
    const list = splited.slice(1, splited.length -1 )
    let xlsx:string[][] = []
    console.time()
    for(const elem of list){
      try{
        const res = await searchSend(elem)
        xlsx = [...xlsx,cleanXLSX(res[0], elem)]
      }catch(err){
        console.error(err.message);
      }
    }
    xlsx.unshift(["Articulo", "Codigo", "Ruta", "Precio"])
    writeFile(xlsx,"salida")
    console.timeEnd()
  }
  if(arg.cambiar){
    const filename = `./test/${arg.ruta}.xlsx` ;
    if (!filename) {
      console.error('usage: sheet2csv <filename> [sheetname]');
      Deno.exit(1);
    }
    const splited = readFile(filename)
    const list = splited.slice(1, splited.length -1 )
    let cleandList = Array(0)
    for(const art of list){
      const spl:(string|number)[] = art.split(',')
      spl[1] = Number(spl[1])
      cleandList = [...cleandList, {code:spl[0], prc:spl[1]}]
    }
    //let nonExistentList:string[] = []
    for(const art of cleandList){
      try {
        const res = await updatePrice(art)
        //if(res[0]) nonExistentList = [...nonExistentList, art.code]
        console.log(res)
      } catch (error) {
        console.error(error.message)
      }
    }
    //console.log(nonExistentList);
    
  }
  if(arg.test){
    const filename = `./test/Conversor.xlsx` ;
    const splited = readFile(filename)
    const sliced = splited.slice(2, splited.length - 2 )
    let list:string[][] = []
    for(const art of sliced){
      const splited = art.split(",")
      splited.shift()
      list = [...list, splited]
    }
    const cleandList = exitList(list)
    console.log(cleandList)
  }
}
main()

