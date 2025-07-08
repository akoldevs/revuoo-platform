import { DollarSign, ShieldCheck, TrendingUp, Zap } from "lucide-react";

const benefits = [
  {
    name: "Competitive Commissions",
    description:
      "Earn up to 30% recurring commission on every subscription you refer. Transparent, scalable, and built for long-term success.",
    icon: DollarSign,
  },
  {
    name: "High Conversion Rates",
    description:
      "Revuoo’s trust-building features—like verified reviews and the Revuoo Score—make it easy to convert your audience into paying customers.",
    icon: Zap,
  },
  {
    name: "Recurring Revenue",
    description:
      "Get paid monthly for every active subscription your referral maintains. The more you refer, the more your passive income grows.",
    icon: TrendingUp,
  },
  {
    name: "A Trusted Brand",
    description:
      "Partner with a platform that prioritizes authenticity, transparency, and ethical growth. Promote with confidence.",
    icon: ShieldCheck,
  },
];

export default function WhyPartner() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Why Join
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Unlock Growth. Build Trust. Earn Commission.
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our affiliate program is designed to be a true partnership. We
            provide the tools, support, and commission structure you need to
            succeed.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.name}
                className="flex flex-col transition duration-500 ease-in-out transform hover:scale-[1.02] animate-fade-in"
              >
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <benefit.icon
                    className="h-7 w-7 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {benefit.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{benefit.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Earnings Calculator will be added here */}
        {/* <EarningsCalculator /> */}
      </div>
    </div>
  );
}
