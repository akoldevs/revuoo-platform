// src/components/CategoryShowcase.tsx
import Link from 'next/link';
import { Brush, Wrench, CloudCog, Truck, WholeWord, Tv } from 'lucide-react';

// Mock data for our categories. Later, this will come from your database.
const categories = [
  { name: 'Cleaning Services', href: '/categories/cleaning', icon: Brush },
  { name: 'Handyman Services', href: '/categories/handyman', icon: Wrench },
  { name: 'SaaS Software', href: '/categories/saas', icon: CloudCog },
  { name: 'Moving Services', href: '/categories/moving', icon: Truck },
  { name: 'Digital Marketing', href: '/categories/marketing', icon: WholeWord },
  { name: 'Electronics', href: '/categories/electronics', icon: Tv },
];

export default function CategoryShowcase() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Popular Categories
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find and compare top-rated businesses and services across a variety
            of categories to meet your specific needs.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {categories.map((category) => (
              <Link href={category.href} key={category.name} className="flex flex-col p-6 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <category.icon className="h-6 w-6 flex-none text-indigo-600" aria-hidden="true" />
                  {category.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">A placeholder description for the {category.name} category will go here.</p>
                  <p className="mt-6">
                    <span className="text-sm font-semibold leading-6 text-indigo-600">
                      View options <span aria-hidden="true">→</span>
                    </span>
                  </p>
                </dd>
              </Link>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}