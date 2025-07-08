// src/app/affiliates/page.tsx

import AffiliatesHero from "@/components/affiliates/AffiliatesHero";
import WhyPartner from "@/components/affiliates/WhyPartner";
import CommissionAndCalculator from "@/components/affiliates/CommissionAndCalculator";
import HowAndWho from "@/components/affiliates/HowAndWho";
import ToolsAndResources from "@/components/affiliates/ToolsAndResources"; // Add this import
import AffiliateClosing from "@/components/affiliates/AffiliateClosing"; // Add this import

export default function AffiliatesPage() {
  return (
    <main>
      <AffiliatesHero />
      <WhyPartner />
      <CommissionAndCalculator />
      <HowAndWho />
      <ToolsAndResources />
      <AffiliateClosing />
    </main>
  );
}
