// src/app/contact/page.tsx

import ContactHeader from "@/components/contact/ContactHeader";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
    return (
        <main>
            <ContactHeader />
            <div className="mx-auto max-w-2xl px-6 pb-24 sm:pb-32 lg:px-8">
                <ContactForm />
            </div>
        </main>
    );
}