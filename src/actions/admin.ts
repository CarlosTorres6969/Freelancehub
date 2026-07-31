"use server"
import { revalidatePath } from "next/cache"
import { requireRole,requireRoleReauth } from "@/lib/auth/guards"
import { getPool,sql } from "@/lib/db"
import { canTransitionOrder,type OrderStatus } from "@/lib/validation"

async function admin(){const {user}=await requireRole(["admin"]);return {pool:await getPool(),actorId:user.id}}
async function adminReauth(password:string){const {user}=await requireRoleReauth(["admin"],password);return {pool:await getPool(),actorId:user.id}}

async function logAudit(pool:Awaited<ReturnType<typeof getPool>>,actorId:string,action:string,entityType:string,entityId:string|null,oldValues?:unknown,newValues?:unknown){
  await pool.request()
    .input("actor",sql.UniqueIdentifier,actorId)
    .input("action",sql.VarChar(100),action)
    .input("entityType",sql.VarChar(100),entityType)
    .input("entityId",sql.UniqueIdentifier,entityId)
    .input("old",sql.NVarChar(sql.MAX),oldValues!=null?JSON.stringify(oldValues):null)
    .input("new",sql.NVarChar(sql.MAX),newValues!=null?JSON.stringify(newValues):null)
    .query(`INSERT dbo.audit_log(actor_id,action,entity_type,entity_id,old_values,new_values) VALUES(@actor,@action,@entityType,@entityId,@old,@new)`)
}

export async function getAdminStats(){const {pool}=await admin(),r=await pool.request().query(`SELECT(SELECT COUNT(*)FROM dbo.profiles)totalUsers,(SELECT COUNT(*)FROM dbo.profiles WHERE role='freelancer')totalFreelancers,(SELECT COUNT(*)FROM dbo.services WHERE active=1)totalServices,(SELECT COUNT(*)FROM dbo.[orders])totalOrders,(SELECT COUNT(*)FROM dbo.[orders] WHERE status='disputed')totalDisputes,(SELECT COUNT(*)FROM dbo.users WHERE disabled=1)totalBanned;SELECT total,service_fee,status,created_at FROM dbo.[orders];SELECT TOP(10)o.*,s.title service_title,b.name buyer_name,f.name freelancer_name FROM dbo.[orders]o JOIN dbo.services s ON s.id=o.service_id JOIN dbo.profiles b ON b.id=o.buyer_id JOIN dbo.profiles f ON f.id=o.freelancer_id ORDER BY o.created_at DESC`),sets=r.recordsets as unknown as Array<Array<Record<string,unknown>>>,head=sets[0][0],ordersData=sets[1].map(o=>({total:Number(o.total),service_fee:Number(o.service_fee),status:String(o.status),created_at:o.created_at})),recentOrders=sets[2].map(({row_version:_rv,...o})=>({...o,total:Number(o.total),service_fee:Number(o.service_fee),service:{title:String(o.service_title)},buyer:{name:String(o.buyer_name)},freelancer:{name:String(o.freelancer_name)}})),completed=ordersData.filter(o=>o.status==="completed");return{totalUsers:Number(head.totalUsers),totalFreelancers:Number(head.totalFreelancers),totalServices:Number(head.totalServices),totalOrders:Number(head.totalOrders),totalDisputes:Number(head.totalDisputes),totalBanned:Number(head.totalBanned),totalRevenue:completed.reduce((n,o)=>n+o.total,0),totalFees:completed.reduce((n,o)=>n+o.service_fee,0),ordersData,recentOrders}}
export async function getAdminUsers(){const {pool}=await admin();return(await pool.request().query(`SELECT p.*,u.email,u.disabled FROM dbo.profiles p JOIN dbo.users u ON u.id=p.id ORDER BY p.created_at DESC`)).recordset.map(p=>({...p,disabled:Boolean(p.disabled),skills:[],languages:[]}))}
export async function getAdminServices(){const {pool}=await admin();return(await pool.request().query(`SELECT s.*,c.name category_name,p.name freelancer_name,u.email freelancer_email FROM dbo.services s JOIN dbo.categories c ON c.id=s.category_id JOIN dbo.profiles p ON p.id=s.freelancer_id JOIN dbo.users u ON u.id=p.id ORDER BY s.created_at DESC`)).recordset.map(s=>({...s,price:Number(s.price),category:{name:s.category_name},freelancer:{name:s.freelancer_name,email:s.freelancer_email},images:[],tags:[]}))}
export async function updateUserRole(id:string,role:"client"|"freelancer"|"admin",password:string){const {pool,actorId}=await adminReauth(password),prev=await pool.request().input("id",sql.UniqueIdentifier,id).query(`SELECT role FROM dbo.profiles WHERE id=@id`);await pool.request().input("id",sql.UniqueIdentifier,id).input("role",sql.VarChar(20),role).query(`UPDATE dbo.profiles SET role=@role,updated_at=SYSUTCDATETIME() WHERE id=@id`);await logAudit(pool,actorId,"update_role","profile",id,{role:prev.recordset[0]?.role},{role});revalidatePath("/admin")}
export async function toggleServiceActive(id:string,active:boolean,password:string){const {pool,actorId}=await adminReauth(password);await pool.request().input("id",sql.UniqueIdentifier,id).input("active",sql.Bit,active).query(`UPDATE dbo.services SET active=@active,updated_at=SYSUTCDATETIME() WHERE id=@id`);await logAudit(pool,actorId,active?"activate_service":"deactivate_service","service",id,{active:!active},{active});revalidatePath("/admin")}
export async function getCommissionRate(){const r=await(await getPool()).request().query(`SELECT value FROM dbo.platform_settings WHERE[key]='commission_rate'`);return Number(r.recordset[0]?.value??.05)}
export async function updateCommissionRate(rate:number,password:string){if(rate<0||rate>.5)throw new Error("Comisión inválida");const {pool,actorId}=await adminReauth(password);await pool.request().input("value",sql.NVarChar(500),String(rate)).query(`UPDATE dbo.platform_settings SET value=@value,updated_at=SYSUTCDATETIME() WHERE[key]='commission_rate'`);await logAudit(pool,actorId,"update_commission_rate","platform_settings","commission_rate",null,{rate})}

// ─── Ban / unban ──────────────────────────────────────────────────────────
export async function banUser(id:string,reason:string|undefined,password:string){
  const {pool,actorId}=await adminReauth(password)
  if(id===actorId)throw new Error("No puedes banearte a ti mismo")
  const r=await pool.request().input("id",sql.UniqueIdentifier,id).query(`SELECT u.disabled,p.role FROM dbo.users u JOIN dbo.profiles p ON p.id=u.id WHERE u.id=@id`)
  const row=r.recordset[0]
  if(!row)throw new Error("Usuario no encontrado")
  if(row.role==="admin")throw new Error("No se puede banear a un administrador")
  await pool.request().input("id",sql.UniqueIdentifier,id).query(`UPDATE dbo.users SET disabled=1,updated_at=SYSUTCDATETIME() WHERE id=@id`)
  await logAudit(pool,actorId,"ban_user","user",id,{disabled:false},{disabled:true,reason:reason?.trim().slice(0,500)||null})
  revalidatePath("/admin")
}
export async function unbanUser(id:string,password:string){
  const {pool,actorId}=await adminReauth(password)
  await pool.request().input("id",sql.UniqueIdentifier,id).query(`UPDATE dbo.users SET disabled=0,updated_at=SYSUTCDATETIME() WHERE id=@id`)
  await logAudit(pool,actorId,"unban_user","user",id,{disabled:true},{disabled:false})
  revalidatePath("/admin")
}

// ─── Disputas ─────────────────────────────────────────────────────────────
export async function getDisputedOrders(){
  const {pool}=await admin()
  const r=await pool.request().query(`SELECT o.*,s.title service_title,b.name buyer_name,f.name freelancer_name FROM dbo.[orders] o JOIN dbo.services s ON s.id=o.service_id JOIN dbo.profiles b ON b.id=o.buyer_id JOIN dbo.profiles f ON f.id=o.freelancer_id WHERE o.status='disputed' ORDER BY o.updated_at DESC`)
  return r.recordset.map(({row_version:_rv,...o})=>({...o,total:Number(o.total),price:Number(o.price),service_fee:Number(o.service_fee),service:{title:o.service_title},buyer:{name:o.buyer_name},freelancer:{name:o.freelancer_name}}))
}
export async function resolveDispute(orderId:string,resolution:"completed"|"cancelled",password:string){
  const {pool,actorId}=await adminReauth(password)
  const tx=new sql.Transaction(pool)
  await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE)
  try{
    const r=await new sql.Request(tx).input("id",sql.UniqueIdentifier,orderId).query(`SELECT status FROM dbo.[orders] WITH(UPDLOCK,HOLDLOCK) WHERE id=@id`)
    const o=r.recordset[0]
    if(!o)throw new Error("Orden no encontrada")
    if(o.status!=="disputed")throw new Error("La orden no está en disputa")
    if(!canTransitionOrder("admin",o.status as OrderStatus,resolution))throw new Error("Transición no permitida")
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,orderId).input("status",sql.VarChar(20),resolution).query(`UPDATE dbo.[orders] SET status=@status,updated_at=SYSUTCDATETIME() WHERE id=@id`)
    await tx.commit()
  }catch(e){await tx.rollback().catch(()=>{});throw e}
  await logAudit(pool,actorId,"resolve_dispute","order",orderId,{status:"disputed"},{status:resolution})
  revalidatePath("/admin")
  revalidatePath("/dashboard")
}

// ─── Eliminar recursos ──────────────────────────────────────────────────────
export async function deleteService(id:string,password:string){
  const {pool,actorId}=await adminReauth(password)
  const existing=await pool.request().input("id",sql.UniqueIdentifier,id).query(`SELECT title FROM dbo.services WHERE id=@id`)
  if(!existing.recordset[0])throw new Error("Servicio no encontrado")
  try{
    await pool.request().input("id",sql.UniqueIdentifier,id).query(`DELETE FROM dbo.services WHERE id=@id`)
  }catch(e){
    const number=(e as {number?:number}).number
    if(number===547)throw new Error("No se puede eliminar: el servicio tiene órdenes asociadas. Desactívalo en su lugar.")
    throw e
  }
  await logAudit(pool,actorId,"delete_service","service",id,{title:existing.recordset[0].title},null)
  revalidatePath("/admin")
}
export async function getAdminReviews(){
  const {pool}=await admin()
  const r=await pool.request().query(`SELECT r.id,r.rating,r.content,r.created_at,r.service_id,s.title service_title,p.name user_name FROM dbo.reviews r JOIN dbo.services s ON s.id=r.service_id JOIN dbo.profiles p ON p.id=r.user_id ORDER BY r.created_at DESC`)
  return r.recordset.map(x=>({...x,id:String(x.id),rating:Number(x.rating)}))
}
export async function deleteReview(id:string,password:string){
  const {pool,actorId}=await adminReauth(password)
  const tx=new sql.Transaction(pool)
  await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE)
  try{
    const r=await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).query(`SELECT service_id,rating FROM dbo.reviews WITH(UPDLOCK,HOLDLOCK) WHERE id=@id`)
    const review=r.recordset[0]
    if(!review)throw new Error("Reseña no encontrada")
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).query(`DELETE FROM dbo.reviews WHERE id=@id`)
    const agg=await new sql.Request(tx).input("serviceId",sql.UniqueIdentifier,review.service_id).query(`SELECT COALESCE(AVG(CAST(rating AS DECIMAL(10,2))),0) avg_rating,COUNT(*) cnt FROM dbo.reviews WHERE service_id=@serviceId`)
    const agg0=agg.recordset[0]
    await new sql.Request(tx).input("serviceId",sql.UniqueIdentifier,review.service_id).input("rating",sql.Decimal(3,2),agg0.avg_rating).input("count",sql.Int,agg0.cnt).query(`UPDATE dbo.services SET rating=@rating,reviews_count=@count,updated_at=SYSUTCDATETIME() WHERE id=@serviceId`)
    await tx.commit()
  }catch(e){await tx.rollback().catch(()=>{});throw e}
  await logAudit(pool,actorId,"delete_review","review",id,null,null)
  revalidatePath("/admin")
}

// ─── Auditoría ────────────────────────────────────────────────────────────
export async function getAuditLog(){
  const {pool}=await admin()
  const r=await pool.request().query(`SELECT TOP(200) a.id,a.action,a.entity_type,a.entity_id,a.old_values,a.new_values,a.created_at,p.name actor_name FROM dbo.audit_log a LEFT JOIN dbo.profiles p ON p.id=a.actor_id ORDER BY a.created_at DESC`)
  return r.recordset.map(x=>({...x,id:Number(x.id),actor_name:x.actor_name??"Sistema"}))
}
