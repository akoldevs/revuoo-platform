// src/app/for-businesses/plans-pricing/page.tsx
'use client'; // This page needs to be a client component to manage state

import { useState } from 'react';
import PricingHeader from '@/components/pricing/PricingHeader';
import PricingTable from '@/components/pricing/PricingTable';
import FeatureComparison from '@/components/pricing/FeatureComparison';
import BusinessFAQ from '@/components/business/BusinessFAQ'; // We can reuse the FAQ component

export default function PlansAndPricingPage() {
    // State to manage the billing cycle toggle (monthly vs. annually)
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

    return (
        <main>
            <PricingHeader 
                billingCycle={billingCycle}
                setBillingCycle={setBillingCycle}
            />
            <PricingTable billingCycle={billingCycle} />
            <FeatureComparison />
            {/* We can reuse the FAQ component from the /for-businesses page for consistency */}
            <BusinessFAQ /> 
        </main>
    );
}