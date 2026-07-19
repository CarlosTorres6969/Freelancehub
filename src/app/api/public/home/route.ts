import { NextResponse } from "next/server"
import { getCategories,getPublicStats,getTestimonials } from "@/lib/repositories/public"
export async function GET(){const[categories,testimonials,stats]=await Promise.all([getCategories(),getTestimonials(),getPublicStats()]);return NextResponse.json({categories,testimonials,stats})}
