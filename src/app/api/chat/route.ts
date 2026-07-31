import { NextResponse } from "next/server"
import { getPool,sql } from "@/lib/db"
import { getSessionUser } from "@/lib/auth/session"
const API="https://api.groq.com/openai/v1/chat/completions",MODEL="llama-3.3-70b-versatile"
interface ChatMessage{role:"user"|"assistant"|"system";content:string}
const SERVICE_STOPWORDS=new Set(["que","qué","cual","cuál","cuales","cuáles","como","cómo","donde","dónde","cuando","cuándo","cuanto","cuánto","cuanta","cuánta","cuantos","cuántos","cuantas","cuántas","para","este","esta","estos","estas","con","los","las","del","por","una","uno","hay","son","mas","más","dame","dime","quiero","busco","buscas","busca","necesito","tienes","tienen","tiene","algun","algún","alguna","algo","sobre","puedo","puedes","puede","ver","tipo","servicio","servicios","disponible","disponibles","plataforma","favor","porfa","porfavor"])
const SERVICE_INTENT_WORDS=/^barat|^econo|^popular|^vendid|^mejor|^calificad|^recomend|^recomien/

async function contextFor(message:string,userId:string|null){
  const pool=await getPool(),q=message.toLowerCase(),parts:string[]=[]
  if(/categor|tipo|área|area/.test(q)){
    const r=await pool.request().query(`SELECT name,description,services_count FROM dbo.categories ORDER BY name`)
    parts.push("CATEGORÍAS:\n"+r.recordset.map(x=>`- ${x.name}: ${x.description} (${x.services_count} servicios)`).join("\n"))
  }
  if(/servicio|popular|vendido|barat|recomend|diseño|web|logo|marketing|seo|programaci/.test(q)){
    const isCheap=/barat|econ[oó]mic/.test(q)
    const terms=Array.from(new Set(q.replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(w=>w.length>=3&&!SERVICE_STOPWORDS.has(w)&&!SERVICE_INTENT_WORDS.test(w)))).slice(0,6)
    const order=isCheap?"s.price ASC":"s.sales DESC,s.rating DESC"
    let r
    if(terms.length){
      const request=pool.request()
      const conds=terms.map((t,i)=>{
        request.input(`t${i}`,sql.NVarChar(100),`%${t}%`)
        return `(s.title LIKE @t${i} OR s.description LIKE @t${i} OR c.name LIKE @t${i} OR EXISTS(SELECT 1 FROM dbo.service_tags st WHERE st.service_id=s.id AND st.tag LIKE @t${i}))`
      }).join(" OR ")
      r=await request.query(`SELECT TOP(8)s.title,s.price,s.rating,s.sales,s.delivery_time,c.name category FROM dbo.services s JOIN dbo.categories c ON c.id=s.category_id WHERE s.active=1 AND (${conds}) ORDER BY ${order}`)
      parts.push(r.recordset.length?"SERVICIOS QUE COINCIDEN CON LA BÚSQUEDA:\n"+r.recordset.map(x=>`- ${x.title} | L${x.price} | ${x.rating} estrellas | ${x.category}`).join("\n"):`No se encontró en FreelanceHub ningún servicio relacionado con "${terms.join(" ")}".`)
    }else{
      r=await pool.request().query(`SELECT TOP(8)s.title,s.price,s.rating,s.sales,s.delivery_time,c.name category FROM dbo.services s JOIN dbo.categories c ON c.id=s.category_id WHERE s.active=1 ORDER BY ${order}`)
      parts.push("SERVICIOS:\n"+r.recordset.map(x=>`- ${x.title} | L${x.price} | ${x.rating} estrellas | ${x.category}`).join("\n"))
    }
  }
  if(userId&&/pedido|orden|compra|historial/.test(q)){
    const r=await pool.request().input("u",sql.UniqueIdentifier,userId).query(`SELECT TOP(10)o.status,o.total,o.created_at,s.title FROM dbo.[orders]o JOIN dbo.services s ON s.id=o.service_id WHERE o.buyer_id=@u ORDER BY o.created_at DESC`)
    parts.push("PEDIDOS DEL USUARIO:\n"+r.recordset.map(x=>`- ${x.title} | ${x.status} | L${x.total}`).join("\n"))
  }
  if(userId&&/favorito|guardado/.test(q)){
    const r=await pool.request().input("u",sql.UniqueIdentifier,userId).query(`SELECT TOP(10)s.title,s.price,s.rating FROM dbo.favorites f JOIN dbo.services s ON s.id=f.service_id WHERE f.user_id=@u`)
    parts.push("FAVORITOS DEL USUARIO:\n"+r.recordset.map(x=>`- ${x.title} | L${x.price} | ${x.rating} estrellas`).join("\n"))
  }
  return parts.join("\n\n")
}
export async function POST(req:Request){try{const body=await req.json(),message=typeof body.message==="string"?body.message.trim():"",history=Array.isArray(body.history)?body.history:[];if(!message||message.length>2000)return NextResponse.json({error:"Mensaje inválido"},{status:400});if(!process.env.GROQ_API_KEY)return NextResponse.json({error:"API key no configurada"},{status:500});const session=await getSessionUser(),context=await contextFor(message,session?.id??null),system=`Eres Asistente FH de FreelanceHub Honduras. Responde en español, breve y con datos del contexto. No inventes ni reveles datos de terceros. Solo puedes recomendar servicios, freelancers y categorías que existen dentro de FreelanceHub Honduras; nunca recomiendes herramientas, apps, sitios o plataformas externas (ej. Excel, Tableau, Power BI, Google Data Studio, Canva, Fiverr, Upwork). Si el usuario pide algo que no se resuelve con el contexto disponible, sugiere buscar un freelancer o servicio dentro de FreelanceHub para esa necesidad, o pide más detalles; no salgas del alcance de la plataforma. ${session?"El usuario está autenticado.":"El usuario no está autenticado."}\n${context}`;const safeHistory:ChatMessage[]=history.slice(-10).filter((x:unknown):x is ChatMessage=>{if(!x||typeof x!=="object")return false;const y=x as Record<string,unknown>;return(y.role==="user"||y.role==="assistant")&&typeof y.content==="string"&&y.content.length<=2000});const response=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.GROQ_API_KEY}`},body:JSON.stringify({model:MODEL,messages:[{role:"system",content:system},...safeHistory,{role:"user",content:message}],max_tokens:512,temperature:.4})});if(!response.ok)return NextResponse.json({error:"Servicio de IA no disponible"},{status:502});const data=await response.json();return NextResponse.json({reply:data.choices?.[0]?.message?.content??"No pude generar una respuesta."})}catch(error){console.error("chat failed",error);return NextResponse.json({error:"Error interno"},{status:500})}}
