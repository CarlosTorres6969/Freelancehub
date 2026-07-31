import "server-only"
import { getSessionUser } from "./session"
import { verifyPassword } from "./password"
import { getPool,sql } from "@/lib/db"
export async function requireUser(){const user=await getSessionUser();if(!user)throw new Error("No autenticado");return user}
export async function requireRole(roles:Array<"client"|"freelancer"|"admin">){const user=await requireUser();const r=await(await getPool()).request().input("id",sql.UniqueIdentifier,user.id).query(`SELECT role FROM dbo.profiles WHERE id=@id`);if(!r.recordset[0]||!roles.includes(r.recordset[0].role))throw new Error("Acceso denegado");return{user,role:r.recordset[0].role as "client"|"freelancer"|"admin"}}
async function verifyCurrentPassword(userId:string,password:string){const r=await(await getPool()).request().input("id",sql.UniqueIdentifier,userId).query(`SELECT password_hash FROM dbo.users WHERE id=@id`);const hash=r.recordset[0]?.password_hash;if(!password||!hash||!(await verifyPassword(password,hash)))throw new Error("Contraseña incorrecta")}
export async function requireReauth(password:string){const user=await requireUser();await verifyCurrentPassword(user.id,password);return user}
export async function requireRoleReauth(roles:Array<"client"|"freelancer"|"admin">,password:string){const {user,role}=await requireRole(roles);await verifyCurrentPassword(user.id,password);return{user,role}}
