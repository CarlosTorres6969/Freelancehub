import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/guards"
import { getPool,sql } from "@/lib/db"
import { toggleFavorite } from "@/actions/favorites"
export async function GET(){try{const u=await requireUser();const r=await(await getPool()).request().input("u",sql.UniqueIdentifier,u.id).query(`SELECT service_id FROM dbo.favorites WHERE user_id=@u`);return NextResponse.json(r.recordset.map(x=>String(x.service_id)))}catch{return NextResponse.json({error:"No autenticado"},{status:401})}}
export async function POST(req:Request){try{const{serviceId}=await req.json();return NextResponse.json({active:await toggleFavorite(serviceId)})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Error"},{status:400})}}
