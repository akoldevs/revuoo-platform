// src/components/TrustSection.tsx
import { ShieldCheck, FunctionSquare, GraduationCap } from 'lucide-react';

const trustPillars = [
  {
    name: 'Verified Reviews',
    description: 'We verify user-submitted reviews to ensure you\'re reading authentic experiences from real customers, not fake accounts.',
    icon: ShieldCheck,
  },
  {
    name: 'Proprietary Revuoo Score',
    description: 'Our unique score combines multiple data points, including user feedback and expert analysis, into a single, trustworthy rating.',
    icon: FunctionSquare,
  },
  {
    name: 'In-Depth Expert Insights',
    description: 'Our expert-written analyses and guides go beyond simple star ratings to give you the complete picture for complex decisions.',
    icon: GraduationCap,
  },
];

export default function TrustSection() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Your Most Trusted Source</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Decide with Confidence
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Revuoo was built on a foundation of trust and transparency. We provide the tools and information you need to make choices you won't regret.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {trustPillars.map((pillar) => (
              <div key={pillar.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <pillar.icon className="h-7 w-7 flex-none text-indigo-600" aria-hidden="true" />
                  {pillar.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{pillar.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}