// src/components/CtaSection.tsx
import Link from 'next/link';
import { Button } from './ui/button'; // Using our shadcn button

export default function CtaSection() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Dive In?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join thousands of users and businesses building a more transparent and trustworthy community. Share your experience or grow your brand with us.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/write-a-review">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200">
                Write a Review
              </Button>
            </Link>
            <Link href="/for-businesses">
              <Button size="lg" variant="secondary">
                Claim Your Business
              </Button>
            </Link>
          </div>
          {/* This is a decorative background element */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}