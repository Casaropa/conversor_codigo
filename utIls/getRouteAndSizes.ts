export const getRouteAndSizes = (elem:string) => {
  if(!elem) return  {route:"", size:"" }
  if(elem.includes("Hogar")) return {route:elem, size:"" }
  if(elem.includes("Accesorios")) return {route:elem, size:"" }
  const splited = elem.split("\\")  
  const trimed = splited.map( (e:string) => e.trim())
  const reversed = trimed.toReversed()
  const size = reversed[0].replace(/Talla/ig, "").replace(/T/ig, "").trim()
  
  const withoutSize = reversed.slice(1, reversed.length)
  const normaliced = withoutSize.toReversed()
  const r = normaliced.join("\\\\")
  const route = `${r}\\\\`
  return {route, size }
}