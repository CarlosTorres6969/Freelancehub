import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/guards"
import { getPool,sql } from "@/lib/db"
export async function GET(){try{const u=await requireUser();const r=await(await getPool()).request().input("u",sql.UniqueIdentifier,u.id).query(`SELECT TOP(50)* FROM dbo.notifications WHERE user_id=@u ORDER BY created_at DESC`);return NextResponse.json(r.recordset)}catch{return NextResponse.json({error:"No autenticado"},{status:401})}}
export async function PATCH(req:Request){try{const u=await requireUser(),{id,all}=await req.json(),q=(await getPool()).request().input("u",sql.UniqueIdentifier,u.id);if(all)await q.query(`UPDATE dbo.notifications SET [read]=1 WHERE user_id=@u AND [read]=0`);else await q.input("id",sql.UniqueIdentifier,id).query(`UPDATE dbo.notifications SET [read]=1 WHERE id=@id AND user_id=@u`);return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"Error"},{status:400})}}
