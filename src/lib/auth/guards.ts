import "server-only"
import { getSessionUser } from "./session"
import { getPool,sql } from "@/lib/db"
export async function requireUser(){const user=await getSessionUser();if(!user)throw new Error("No autenticado");return user}
export async function requireRole(roles:Array<"client"|"freelancer"|"admin">){const user=await requireUser();const r=await(await getPool()).request().input("id",sql.UniqueIdentifier,user.id).query(`SELECT role FROM dbo.profiles WHERE id=@id`);if(!r.recordset[0]||!roles.includes(r.recordset[0].role))throw new Error("Acceso denegado");return{user,role:r.recordset[0].role as "client"|"freelancer"|"admin"}}
