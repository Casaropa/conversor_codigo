export const ArrayList = (listArt:string[]) => {
  listArt.shift()
  const objectList = listArt.map((value:string) => value.split(","))
  const list = objectList.reduce((acc:string[][], el:string[]) =>{
    const localCode = el[0]
    const code = !el[1] ? 'NC' : el[1]
    const route = el[2]?.toLowerCase()
    const price = el[3]
    return acc = [...acc, [localCode,code, route, price]]
  },[])
  
  return list
}