// src/app/page.tsx
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import TrendingReviews from "@/components/TrendingReviews";
import LatestGuides from "@/components/LatestGuides";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import CtaSection from "@/components/CtaSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import LiveReviewFeed from "@/components/LiveReviewFeed"; // NEW Import

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustSection />
      <CategoryShowcase />
      <TrendingReviews />
      <LatestGuides />
      <HowItWorks />
      <CtaSection />
      <NewsletterSignup />
      <LiveReviewFeed /> {/* NEW Component */}
    </main>
  );
}