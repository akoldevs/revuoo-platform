// src/components/business/BusinessFAQ.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = {
  value: string;
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  items: FAQ[];
};

const faqCategories: FAQCategory[] = [
  {
    title: "Reviews & Trust",
    items: [
      {
        value: "reviews-1",
        question: "How do I claim my business profile?",
        answer:
          'If your business is already listed on Revuoo, you can find your page and click the "Claim this Business" button. You’ll be guided through a simple verification process. If your business isn’t listed, you can easily create a new profile for free.',
      },
      {
        value: "reviews-2",
        question: "How does the review verification process work?",
        answer:
          "We encourage users to provide proof of purchase or service. Verified reviews are marked with a badge and carry more weight in your Revuoo Score.",
      },
      {
        value: "reviews-3",
        question: "How should I handle a negative review?",
        answer:
          "Respond publicly and professionally. A thoughtful reply shows potential customers that you care and are committed to resolving issues.",
      },
    ],
  },
  {
    title: "Features & Insights",
    items: [
      {
        value: "features-1",
        question: "How can AI-Powered Insights help my business?",
        answer:
          "Our AI analyzes review content to surface key topics and sentiment trends—helping you understand what customers love and where to improve.",
      },
      {
        value: "features-2",
        question: "What if I have multiple business locations?",
        answer:
          "Our Advanced and Enterprise plans support multiple locations. Enterprise includes tools for managing franchises or chains at scale.",
      },
      {
        value: "features-3",
        question: "Can I respond to reviews as a business owner?",
        answer:
          "Yes. Public responses help build trust and demonstrate your commitment to customer satisfaction.",
      },
    ],
  },
  {
    title: "Billing & Plans",
    items: [
      {
        value: "billing-1",
        question: "Is Revuoo free to use?",
        answer:
          "Yes. We offer a Free plan with core features, and paid plans for advanced analytics, multi-location support, and more.",
      },
      {
        value: "billing-2",
        question:
          "What happens to my reviews if I cancel or downgrade my plan?",
        answer:
          "Your reviews and your business profile always belong to you. Downgrading to our Free plan retains all existing reviews, but premium features will be disabled.",
      },
    ],
  },
  {
    title: "Content & Community",
    items: [
      {
        value: "content-1",
        question: "Does Revuoo offer content like guides or insights?",
        answer:
          "Yes! Our blog features expert-written guides, industry insights, and customer success stories to help you grow your business and reputation.",
      },
      {
        value: "content-2",
        question: "Can I contribute to the Revuoo blog?",
        answer:
          "We’re building a contributor program for thought leaders and business owners. Stay tuned or reach out to our team to express interest.",
      },
    ],
  },
];

export default function BusinessFAQ() {
  return (
    <section
      className="bg-white py-24 sm:py-32"
      aria-labelledby="business-faq-heading"
    >
      <div className="w-full max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            id="business-faq-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600 text-base">
            Everything you need to know about managing your business, reviews,
            and content on Revuoo.
          </p>
        </div>

        <div className="space-y-16">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {category.title}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item) => (
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
    </section>
  );
}
