export const ArrayList = (splited:string[]) => {
    let elem: Array<string> = []
    const objectList = splited.map((value:string, index:number) => {
      const obj = {
        index,
        value
      }
      return obj
    })
    
    const list: Array<Array<string>> = []

    objectList.forEach(({ index, value }) => {
      const indexCell = index % 4
      let valueCell = value.toLowerCase()
      if (indexCell === 0){ 
        elem = []
        const searchEsc = valueCell.indexOf("\\n")
        if(valueCell.includes("\\n")) valueCell = valueCell.slice(searchEsc + 1)
      }
      elem[indexCell] = valueCell
      if(indexCell === 3){ 
        if(elem[0] !== "") list.push(elem)
      }
    }
    )
    return list
}

export const ArrayList2 = (splited:string[]) => {
  const objectList = splited.map((value:string) => value.split(","))
  const list = objectList.reduce((acc:string[][], el:string[]) =>{
    if(el[1] == '') el[1] = 'NC'
    if(el[2]) el[2] = (el[2]+'\\').toLowerCase()
    
    return acc = [...acc, el]
  },[])
  
  return list
}