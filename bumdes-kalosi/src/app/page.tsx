import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/custom/HeroSection";
import { ServiceShowcase } from "@/components/custom/ServiceShowcase";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { AboutSection } from "@/components/custom/AboutSection";
import { CTABanner } from "@/components/custom/CTABanner";
import { FeaturedProducts } from "@/components/custom/FeaturedProducts";
import { RecentNews } from "@/components/custom/RecentNews";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Business Units Grid */}
        <section className="py-20 container mx-auto px-4 relative z-30">
          <SectionHeader
            title="Layanan Kami"
            subtitle="Jelajahi berbagai layanan unggulan dari BUMDes Sumber Kalosi"
            align="center"
            className="mb-12"
          />
          <ServiceShowcase />
        </section>

        {/* Featured Products from DB */}
        <FeaturedProducts />

        {/* Recent News from DB */}
        <RecentNews />

        {/* Introduction / About Section */}
        <AboutSection />

        {/* CTA Banner */}
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}

