// src/app/dashboard/page.tsx
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <p>Welcome to your Revuoo dashboard. From here you can manage your content and profile.</p>

      <div className="mt-6 space-y-2">
        <Link href="/dashboard/my-reviews" className="text-indigo-600 hover:underline block">
          → View My Reviews
        </Link>
        <Link href="/dashboard/business" className="text-indigo-600 hover:underline block">
          → View My Business Dashboard
        </Link>
      </div>
    </div>
  );
}