import { Client } from "std/mysql";

const hostname = "localhost"
const username = "Abraham"
const db = "almacen"
const password = "2272426"

export const client = await new Client().connect({
    hostname, 
    username,
    db,
    password
  });