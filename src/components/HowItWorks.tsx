// src/components/HowItWorks.tsx
import { Search, PenSquare, CheckCircle } from "lucide-react";
import { ReactNode } from "react";

interface StepCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const StepCard = ({ icon, title, description }: StepCardProps) => (
  <article className="text-center">
    <div className="flex justify-center items-center mb-4">
      <div
        className="bg-indigo-100 p-4 rounded-full"
        role="presentation"
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
    <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </article>
);

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-white py-24 sm:py-32 scroll-mt-16"
    >
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Your Journey to Smarter Choices
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            In just a few simple steps, find exactly what you're looking for and
            make decisions with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-8">
          <StepCard
            icon={<Search className="h-8 w-8 text-indigo-600" />}
            title="Search & Discover"
            description="Find the perfect service or product with our powerful, intuitive search."
          />
          <StepCard
            icon={<CheckCircle className="h-8 w-8 text-indigo-600" />}
            title="Compare & Verify"
            description="Dive into verified reviews, Revuoo Scores, and expert insights to compare your options."
          />
          <StepCard
            icon={<PenSquare className="h-8 w-8 text-indigo-600" />}
            title="Decide & Share"
            description="Make confident choices and share your own experience to help the community grow."
          />
        </div>
      </div>
    </section>
  );
}
