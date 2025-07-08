// src/app/for-businesses/page.tsx

import BusinessHero from "@/components/business/BusinessHero";
import HowItWorks from "@/components/business/HowItWorks";
import Features from "@/components/business/Features";
import BusinessFAQ from "@/components/business/BusinessFAQ";

export default function ForBusinessesPage() {
    return (
        <main>
            <BusinessHero />
            <HowItWorks />
            <Features />
            <BusinessFAQ />
        </main>
    );
}