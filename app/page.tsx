import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { DemoShowcaseSection } from '@/components/landing/demo-showcase-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { TokenPackagesSection } from '@/components/landing/token-packages-section'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <DemoShowcaseSection />
        <HowItWorksSection />
        <PricingSection />
        <TokenPackagesSection />
      </main>
      <Footer />
    </div>
  )
}
