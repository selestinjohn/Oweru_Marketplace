import { SiteFooter } from '@/components/common/SiteFooter'
import { FeaturedProperties } from '@/features/home/components/FeaturedProperties'
import { HeroSection } from '@/features/home/components/HeroSection'
import { HomeCTA } from '@/features/home/components/HomeCTA'
import { HowItWorks } from '@/features/home/components/HowItWorks'
import { ProfessionalServices } from '@/features/home/components/ProfessionalServices'
import { PropertyCategories } from '@/features/home/components/PropertyCategories'
import { TrustStrip } from '@/features/home/components/TrustStrip'
import { VerifySection } from '@/features/home/components/VerifySection'
import { WhyOweru } from '@/features/home/components/WhyOweru'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedProperties />
      <PropertyCategories />
      <VerifySection />
      <HowItWorks />
      <ProfessionalServices />
      <WhyOweru />
      <HomeCTA />
      <SiteFooter />
    </>
  )
}
