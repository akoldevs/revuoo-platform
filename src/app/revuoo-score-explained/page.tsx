// src/app/revuoo-score-explained/page.tsx
import { ShieldCheck, Star, Bot, CheckCircle2 } from 'lucide-react';

export default function RevuooScoreExplainedPage() {
  return (
    <div className="bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <ShieldCheck className="mx-auto h-16 w-16 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The Revuoo Score Explained
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Transparency is at the heart of everything we do. Here&apos;s a clear breakdown of how we calculate our unique, trustworthy score.
          </p>
        </div>

        {/* Core Principles Section */}
        <div className="space-y-10">
          <div className="p-8 border rounded-lg bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Star className="mr-3 h-6 w-6 text-yellow-500" /> Beyond a Simple Star Rating</h2>
            <p className="text-gray-700">
              A simple 1-to-5 star rating doesn&apos;t tell the whole story. The Revuoo Score is a more nuanced rating from 0-10 that is calculated as a weighted average of five key aspects of a service:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 text-gray-700">
              <li><span className="font-semibold">Quality (30% weight):</span> The overall quality of the work delivered.</li>
              <li><span className="font-semibold">Value (20% weight):</span> The perceived value for the price paid.</li>
              <li><span className="font-semibold">Professionalism (20% weight):</span> The courtesy and conduct of the staff.</li>
              <li><span className="font-semibold">Punctuality (15% weight):</span> Reliability and adherence to schedules.</li>
              <li><span className="font-semibold">Communication (15% weight):</span> The ease of booking and clarity of communication.</li>
            </ul>
          </div>

          <div className="p-8 border rounded-lg bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><CheckCircle2 className="mr-3 h-6 w-6 text-green-600" /> The Importance of Verified Reviews</h2>
            <p className="text-gray-700">
              Trust is paramount. While all approved reviews contribute to the score, reviews that have been verified by our system (e.g., via receipt upload) may be given a slightly higher influence in future versions of the score calculation. This rewards businesses who serve real, verifiable customers.
            </p>
          </div>

          <div className="p-8 border rounded-lg bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Bot className="mr-3 h-6 w-6 text-blue-600" /> Dynamic and Fair Calculation</h2>
            <p className="text-gray-700">
              The Revuoo Score is not static. It is automatically recalculated every time a new review for a business is approved. This ensures the score is always up-to-date and provides a fair, current reflection of the business&apos;s performance based on real customer feedback. Only reviews you, our admin, have approved will ever count towards the score.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}