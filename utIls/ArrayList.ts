// export const ArrayList = (splited:string[]) => {
//     let elem: Array<string> = []
//     const objectList = splited.map((value:string, index:number) => {
//       const obj = {
//         index,
//         value
//       }
//       return obj
//     })
    
//     const list: Array<Array<string>> = []

//     objectList.forEach(({ index, value }) => {
//       const indexCell = index % 4
//       let valueCell = value.toLowerCase()
//       if (indexCell === 0){ 
//         elem = []
//         const searchEsc = valueCell.indexOf("\\n")
//         if(valueCell.includes("\\n")) valueCell = valueCell.slice(searchEsc + 1)
//       }
//       elem[indexCell] = valueCell
//       if(indexCell === 3){ 
//         if(elem[0] !== "") list.push(elem)
//       }
//     }
//     )
//     return list
// }

export const ArrayList = (listArt:string[]) => {
  listArt.shift()
  const objectList = listArt.map((value:string) => value.split(","))
  const list = objectList.reduce((acc:string[][], el:string[]) =>{
    const localCode = el[0]
    const code = !el[1] ? 'NC' : el[1]
    const route = el[2]?.toLowerCase()
    const price = el[3]
    //return acc = [...acc, el]
    return acc = [...acc, [localCode,code, route, price]]
  },[])
  
  return list
}