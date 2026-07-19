import { NextResponse } from "next/server"
import { getPool,sql } from "@/lib/db"
import { verifyPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
export async function POST(req:Request){const {email,password}=await req.json();if(typeof email!=="string"||typeof password!=="string")return NextResponse.json({error:"Datos inválidos"},{status:400});const r=await(await getPool()).request().input("email",sql.NVarChar(320),email.trim().toLowerCase()).query(`SELECT id,email,password_hash,disabled FROM dbo.users WHERE email=@email`);const u=r.recordset[0];if(!u||u.disabled||!u.password_hash||!(await verifyPassword(password,u.password_hash)))return NextResponse.json({error:"Credenciales incorrectas"},{status:401});await createSession({id:String(u.id),email:u.email});return NextResponse.json({ok:true})}
