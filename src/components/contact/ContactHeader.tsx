// src/components/contact/ContactHeader.tsx

"use client";

export default function ContactHeader() {
  return (
    <section className="bg-gray-50" aria-labelledby="contact-header-heading">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 text-center animate-fade-in">
        <h1
          id="contact-header-heading"
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
        >
          Contact Us
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Have a question, feedback, or a business inquiry? We&apos;d love to
          hear from you.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          We typically respond within 1–2 business days.
        </p>
      </div>
    </section>
  );
}
