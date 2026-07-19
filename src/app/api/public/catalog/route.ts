import { NextResponse } from "next/server"
import { getCategories,getServices } from "@/lib/repositories/public"
export async function GET(){const[services,categories]=await Promise.all([getServices(),getCategories()]);return NextResponse.json({services,categories})}
