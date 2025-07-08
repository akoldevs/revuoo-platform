"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

const faqItems = [
  {
    category: "Commissions & Payments",
    items: [
      {
        value: "faq-commission",
        question: "How much commission do I earn?",
        answer:
          "Our standard commission rate is a competitive 30% recurring revenue for the lifetime of the customer you refer. The more they stay, the more you earn.",
      },
      {
        value: "faq-payouts",
        question: "When and how do I get paid?",
        answer:
          "Payouts are processed monthly via PayPal or direct bank transfer, once you reach the minimum payout threshold of $50.",
      },
      {
        value: "faq-cookie",
        question: "How long is the cookie duration?",
        answer:
          "We offer a generous 90-day cookie window. If a user clicks your link and signs up for a paid plan within 90 days, you earn the commission.",
      },
    ],
  },
  {
    category: "Tracking & Tools",
    items: [
      {
        value: "faq-dashboard",
        question: "How do I track my referrals and earnings?",
        answer:
          "You’ll have access to a real-time affiliate dashboard where you can monitor clicks, signups, conversions, and commissions.",
      },
      {
        value: "faq-resources",
        question: "Do you provide marketing materials?",
        answer:
          "Yes! You’ll get banners, logos, email templates, and social media content to help you promote Revuoo effectively.",
      },
      {
        value: "faq-deep-linking",
        question: "Can I link to specific pages?",
        answer:
          "Absolutely. Our deep linking feature lets you direct traffic to any Revuoo page with your referral tag attached.",
      },
    ],
  },
  {
    category: "Eligibility & Support",
    items: [
      {
        value: "faq-approval",
        question: "How long does it take to get approved?",
        answer:
          "Most applications are reviewed within 48 hours. We prioritize partners who align with our mission of trust and transparency.",
      },
      {
        value: "faq-support",
        question: "Is there support for affiliates?",
        answer:
          "Yes. You’ll have access to onboarding guides, a dedicated affiliate manager, and a private support channel.",
      },
      {
        value: "faq-restrictions",
        question: "Are there any restrictions?",
        answer:
          "We don’t allow spammy tactics or misleading promotions. We’re building a trust-first ecosystem, and we expect our partners to do the same.",
      },
    ],
  },
];

// Generate structured data for SEO
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }))
  ),
};

export default function AffiliateClosing() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(faqStructuredData);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section id="apply" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 divide-y divide-gray-200">
        {/* FAQ Section */}
        <div className="pb-20">
          <p className="text-base font-semibold text-indigo-600 text-center">
            Got Questions?
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 text-center sm:text-4xl">
            Affiliate Program FAQs
          </h2>
          <div className="mt-12 max-w-3xl mx-auto space-y-12">
            {faqItems.map((group) => (
              <div key={group.category}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {group.category}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {group.items.map((item) => (
                    <AccordionItem value={item.value} key={item.value}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="pt-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Let’s Grow Together—with Revuoo
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            It’s free to join. No minimums. Just real rewards for real
            referrals.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <Link href="/affiliates/signup">
                Start Earning with Revuoo Today
              </Link>
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              Trusted by 500+ businesses across 50+ industries.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Still have questions?{" "}
              <Link href="/contact" className="text-indigo-600 hover:underline">
                Talk to our team
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
