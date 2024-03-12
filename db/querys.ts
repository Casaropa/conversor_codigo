import { client } from "./conn.ts"

//
interface listArt{
  localCode:string, 
  code:string, 
  prc:number,
  route:string, 
  type:string, 
  size:string|null, 
  name:string
}

// ALL
export const AllDepart = async () => await client.query('SELECT id_departamento ,nombre_depart, codigo_dep FROM departamentos ORDER BY id_departamento')

export const AllArt = async () => await client.query('SELECT id_articulo, codigo_art FROM articulos ORDER BY id_articulo')

// Search max

export const searchMAX = (type:string) => client.query(`SELECT MAX(articulos.codigo_interno) as max FROM articulos WHERE articulos.tipo = ?`, [type])

// Seach by code
export const searchDepByCode = (code:string) => client.query(`SELECT id_departamento, nombre_depart, codigo_dep FROM departamentos WHERE codigo LIKE ?`, [code])

export const searchArtByCode = (code:string) => client.query(`SELECT id_articulo FROM articulos WHERE codigo_art LIKE ?`, [code])

// Search by Id
export const searchDepById = (code:string) => client.query(`SELECT id_departamento, nombre_depart, codigo_dep FROM departamentos WHERE codigo LIKE ${code}`)

export const searchArtById = (id:number) => client.query(`SELECT articulos.codigo_interno, articulos.precio,departamentos.nombre_depart AS ruta, articulos.talla FROM articulos JOIN departamentos ON articulos.id_departamento = departamentos.id_departamento WHERE id_articulo LIKE ?`,[id]) 

//Search by route
export const searchDepByRoute = (route:string) => client.query(`SELECT id_departamento, nombre_depart FROM departamentos WHERE nombre_depart LIKE ?`, [route])

// Search by adsm
export const searchArtInfo = (code:string|null) => client.query(`SELECT articulos.codigo_interno, articulos.precio,departamentos.nombre_depart AS ruta, articulos.talla FROM articulos JOIN departamentos ON articulos.id_departamento = departamentos.id_departamento WHERE codigo_art LIKE ?`,[code])

export const searchArtByRouteAndPrice = (route:string, prc:number) => client.query(`SELECT articulos.id_articulo, articulos.nombre, departamentos.nombre_depart, articulos.codigo_interno FROM articulos JOIN departamentos ON departamentos.id_departamento = articulos.id_departamento WHERE articulos.codigo_art = 'NC' AND departamentos.nombre_depart = ? AND articulos.precio = ?`, [route,prc])

export const searchArtByCodeAndPrc = (code:string, prc:string) => client.query(`SELECT articulos.codigo_interno, departamentos.nombre_depart as ruta, articulos.codigo_interno, articulos.precio FROM articulos JOIN departamentos ON departamentos.id_departamento = articulos.id_departamento WHERE articulos.codigo_art = 'NC' AND departamentos.codigo_dep LIKE ? AND articulos.precio LIKE ?`, [code, prc]) 

export const searchNC = (route:string|null, prc:number|null, size:string|null) =>{
  const querySize = !size ? "IS NULL" : `LIKE '${size}'` 
  return client.query(`SELECT articulos.codigo_interno, departamentos.nombre_depart as ruta, articulos.precio, articulos.talla FROM articulos JOIN departamentos ON articulos.id_departamento = departamentos.id_departamento WHERE articulos.tipo = "NC" AND articulos.precio LIKE ? AND departamentos.nombre_depart = ? AND articulos.talla ${querySize} AND articulos.codigo_interno NOT LIKE "N0%" AND articulos.codigo_interno NOT LIKE "NC%"`,[prc, route])
}
  

export const searchSend = (code:string) => client.query(`SELECT articulos.codigo_interno, articulos.codigo_art, articulos.talla, articulos.precio, departamentos.nombre_depart FROM articulos JOIN departamentos ON departamentos.id_departamento = articulos.id_departamento WHERE articulos.codigo_interno = ?`, [code])

export const insertDepRow = (nomDep:string,codigo:string) => client.query(`INSERT INTO departamentos(nombre_depart, codigo_dep) VALUES(?,?)`, [nomDep,codigo]) 

export const insertDepart = async (nomDep:string) =>{
  const code = '100'
  const newName = nomDep.replace(/\\/ig, '\\\\')
  const isDuplicated = await searchDepByRoute(nomDep)
  if(isDuplicated[0]) throw new Error(`Departamento ${newName} ya existe`)
//  const res = isDuplicated
  const res = await insertDepRow(newName,code)
  return res
}

export const insertArtRow = (code:string, localCode:string, name:string, price:number, size:string|null, type:string, idDep:number) => client.execute(`INSERT INTO articulos(codigo_art, codigo_interno, nombre, precio, talla, tipo, id_departamento) VALUES (?,?,?,?,?,?,?)`, [code, localCode,name, price, size, type, idDep]) 

export const insertArt = async (Art:listArt) => {
  const {route, localCode, code, size, name, prc, type} = Art   
  const depart = await searchDepByRoute(route) 
  if(!depart[0]) return `Departamento "${route}" no Existe`
  
  const idDepartamento = depart[0]?.id_departamento
  if(type === 'Caja'){
    const isDuplicated = code === "NC" ? await searchNC (route, prc, size) : await searchArtByCode(code)
    if(isDuplicated[0])  return `Articulo ${isDuplicated[0].id_articulo} ya existente`}
  //const res = depart

  const res = await insertArtRow(code, localCode, name, prc, size, type, idDepartamento)
  return res
}

interface Art{
  code: string,
  prc: number
} 
// Updates
const updatePriceRow = (code:string, prc:number) =>  client.execute(`UPDATE articulos SET articulos.precio = ? WHERE articulos.codigo_interno LIKE ?`,[prc, code])

export async function updatePrice(art:Art) {
  const {code, prc} = art
  const product = await searchSend(code)
  let nonExistentList:string[] = []
  if(!product[0]){ 
    nonExistentList = [...nonExistentList, code]
    throw new Error(`El articulo ${code} no existe`);
  }

  if(product[0]?.precio == prc) throw new Error(`Precio del articulo ${product[0]?.codigo_interno} al dia`)
  const res = await updatePriceRow(code, prc)
  return res.affectedRows === 1 ? "Precio actualizado" : `Precio del articulo ${product[0].codigo_interno} al dia`
  //return nonExistentList
}
