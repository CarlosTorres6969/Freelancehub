import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/guards"
import { getPool,sql } from "@/lib/db"
export async function PATCH(req:Request){const u=await requireUser(),{role}=await req.json();if(!["client","freelancer"].includes(role))return NextResponse.json({error:"Rol inválido"},{status:400});await(await getPool()).request().input("id",sql.UniqueIdentifier,u.id).input("role",sql.VarChar(20),role).query(`UPDATE dbo.profiles SET role=@role,updated_at=SYSUTCDATETIME() WHERE id=@id AND role<>'admin'`);return NextResponse.json({ok:true})}
