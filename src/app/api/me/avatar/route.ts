import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/guards"
import { uploadImage } from "@/lib/blob"
import { getPool,sql } from "@/lib/db"
export async function POST(req:Request){try{const u=await requireUser(),data=await req.formData(),file=data.get("file");if(!(file instanceof File))throw new Error("Archivo requerido");const ext=(file.name.split(".").pop()||"bin").replace(/[^a-z0-9]/gi,""),url=await uploadImage(file,`avatars/${u.id}/avatar-${Date.now()}.${ext}`);await(await getPool()).request().input("id",sql.UniqueIdentifier,u.id).input("url",sql.NVarChar(2048),url).query(`UPDATE dbo.profiles SET avatar_url=@url,updated_at=SYSUTCDATETIME() WHERE id=@id`);return NextResponse.json({url})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Error"},{status:400})}}
