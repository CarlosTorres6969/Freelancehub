import { NextResponse } from "next/server"
import { getPool,sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
import { toTitleCase } from "@/lib/validation"
export async function POST(req:Request){
  const body=await req.json()
  const email=body.email,password=body.password
  const name=toTitleCase(String(body.name??"").trim())
  const department=String(body.department??"").trim()
  const municipality=String(body.municipality??"").trim()
  const description=String(body.description??"").trim()
  const rawLanguages:string[]=Array.isArray(body.languages)?body.languages.map((l:unknown)=>String(l).trim()).filter((l:string)=>l.length>0):[]
  const languages:string[]=Array.from(new Set(rawLanguages)).slice(0,20)
  const nativeLanguage=String(body.native_language??"").trim()
  if(typeof email!=="string"||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=="string"||password.length<8)
    return NextResponse.json({error:"Correo inválido o contraseña menor de 8 caracteres"},{status:400})
  if(!name||name.length>150)
    return NextResponse.json({error:"Ingresa tu nombre completo"},{status:400})
  if(!department||!municipality)
    return NextResponse.json({error:"Selecciona tu ubicación"},{status:400})
  if(!description)
    return NextResponse.json({error:"Ingresa una descripción corta"},{status:400})
  if(languages.length===0)
    return NextResponse.json({error:"Agrega al menos un idioma"},{status:400})
  if(!nativeLanguage||!languages.includes(nativeLanguage))
    return NextResponse.json({error:"Selecciona tu idioma nativo entre los idiomas seleccionados"},{status:400})

  const normalized=email.trim().toLowerCase(),pool=await getPool(),tx=new sql.Transaction(pool)
  const location=`${municipality}, ${department}`
  try{
    await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE)
    const exists=await new sql.Request(tx).input("email",sql.NVarChar(320),normalized).query(`SELECT id FROM dbo.users WITH(UPDLOCK,HOLDLOCK) WHERE email=@email`)
    if(exists.recordset.length){await tx.rollback();return NextResponse.json({error:"El correo ya está registrado"},{status:409})}
    const id=crypto.randomUUID(),hash=await hashPassword(password)
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).input("email",sql.NVarChar(320),normalized).input("hash",sql.NVarChar(500),hash).query(`INSERT dbo.users(id,email,password_hash,email_verified,disabled) VALUES(@id,@email,@hash,0,0)`)
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).input("name",sql.NVarChar(150),name).input("description",sql.NVarChar(1000),description).input("department",sql.NVarChar(100),department).input("municipality",sql.NVarChar(100),municipality).input("location",sql.NVarChar(200),location).input("nativeLanguage",sql.NVarChar(100),nativeLanguage).query(`INSERT dbo.profiles(id,name,description,department,municipality,location,native_language) VALUES(@id,@name,@description,@department,@municipality,@location,@nativeLanguage)`)
    for(const language of languages)
      await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).input("value",sql.NVarChar(100),language).query(`INSERT dbo.profile_languages(profile_id,language) VALUES(@id,@value)`)
    await tx.commit()
    await createSession({id,email:normalized})
    return NextResponse.json({ok:true},{status:201})
  }catch(error){
    await tx.rollback().catch(()=>{})
    console.error("register failed",error)
    return NextResponse.json({error:"No se pudo crear la cuenta"},{status:500})
  }
}
