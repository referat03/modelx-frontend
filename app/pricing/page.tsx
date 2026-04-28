import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PricingSection } from "@/components/landing/pricing-section"

export const metadata = {
  title: "Тарифы",
  description: "Выберите подходящий тарифный план для доступа к лучшим AI-моделям",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
