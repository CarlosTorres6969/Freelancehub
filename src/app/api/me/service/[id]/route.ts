import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/guards"
import { getServiceById } from "@/lib/repositories/public"
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const u=await requireUser(),{id}=await params,s=await getServiceById(id);return s&&(s.freelancer_id===u.id)?NextResponse.json(s):NextResponse.json({error:"No encontrado"},{status:404})}
