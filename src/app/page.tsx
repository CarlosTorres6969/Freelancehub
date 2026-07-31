import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Categories from "@/components/Categories"
import Testimonials from "@/components/Testimonials"
import CTASection from "@/components/CTASection"
import { getCategories, getPublicStats, getTestimonials } from "@/lib/repositories/public"
import type { Category, Testimonial } from "@/types"

export const revalidate = 300

async function loadHomeData() {
  try {
    return await Promise.all([getCategories(), getTestimonials(), getPublicStats()])
  } catch {
    // Si la base de datos no está disponible al generar, al menos la página estática.
    const fallbackCategories: Category[] = []
    const fallbackTestimonials: Testimonial[] = []
    const fallbackStats = { projects: 0, freelancers: 0, rating: 0 }
    return [fallbackCategories, fallbackTestimonials, fallbackStats] as const
  }
}

export default async function Home() {
  const [categories, testimonials, stats] = await loadHomeData()

  return (
    <>
      <Hero stats={stats} />
      <Features />
      <Categories categories={categories} />
      <Testimonials testimonials={testimonials} />
      <CTASection />
    </>
  )
}
