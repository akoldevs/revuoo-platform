// src/app/page.tsx
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import TrendingReviews from "@/components/TrendingReviews";
import LatestGuides from "@/components/LatestGuides";
import TrustSection from "@/components/TrustSection";
import CtaSection from "@/components/CtaSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategoryShowcase />
      <TrendingReviews />
      <LatestGuides />
      <TrustSection />
      <CtaSection />
    </main>
  );
}