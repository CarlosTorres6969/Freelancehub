import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Categories from "@/components/Categories"
import Testimonials from "@/components/Testimonials"
import CTASection from "@/components/CTASection"
import { getCategories, getPublicStats, getTestimonials } from "@/lib/repositories/public"

export const revalidate = 300

export default async function Home() {
  const [categories, testimonials, stats] = await Promise.all([
    getCategories(),
    getTestimonials(),
    getPublicStats(),
  ])

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
