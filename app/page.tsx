import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { CategoriesSection } from "@/components/landing/categories-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}
