interface listArt{
  codigo_interno:string,
  codigo_art:string,
  nombre_depart:string,
  precio:string,
  type:string,
  talla:string|null,
  name:string
}

export function cleanXLSX(xlsx:listArt, elem:string){
  if(!xlsx) {
      const ar = Array(4).fill("")
      ar[0] = elem
      return ar
  }
  const {codigo_interno, codigo_art, nombre_depart, precio, talla} = xlsx
  const ruta = cleanR(talla, nombre_depart)
  const code = codigo_art === 'NC' ? codigo_interno : codigo_art 
  const prcSplited = precio.split('.')
  const prc = prcSplited[1] === "0" ? prcSplited[0]: precio
  return codigo_interno.charAt(0) === "N" ? [codigo_interno, codigo_interno , ruta, prc] : [codigo_interno, code, ruta, prc]
}

export function cleanR(size:string|null = 'u', dep:string){
  let s = ''
  if(!dep) return ''
  const d = upperR(dep)
  if(size && size !== undefined) s = size.toUpperCase()
  if(size?.includes('MES')) return d+s
  if(dep.includes('hogar')) return d.slice(0,d.length - 1)
  if(dep.includes('accesorios')) return d.slice(0,d.length - 1)
  if(dep.includes('zapato')) return d+'T'+s
  return d+'Talla '+s
}

export function upperR(r:string){
  if(!r || typeof(r) === "number") return ""
  const splited = r.split("\\")
  const upper = splited.map( (el:string) =>{
      const first = el.charAt(0)
      const firstUpper = first.toUpperCase()
      const rest = el.slice(1)
      return firstUpper+rest
  })
  const joined = upper.join("\\")
  return joined
}