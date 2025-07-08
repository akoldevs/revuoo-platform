"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { createClient } from "@/lib/supabase/client";

type PlatformStats = {
  approved_reviews_count: number;
  businesses_count: number;
  categories_count: number;
  total_users_count: number;
};

const formatStat = (num: number | null | undefined): number => {
  if (!num) return 0;
  return num;
};

export default function OurImpact() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc("get_platform_stats")
        .single<PlatformStats>();

      if (!error && data) {
        setStats(data);
      } else {
        console.error("Error fetching stats:", error?.message);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const today = new Date();
  const dateString = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const statItems = [
    { label: "Verified Reviews", value: stats?.approved_reviews_count },
    { label: "Businesses Listed", value: stats?.businesses_count },
    { label: "Categories Explored", value: stats?.categories_count },
    { label: "Community Members", value: stats?.total_users_count },
  ];

  return (
    <section
      className="relative bg-white py-24 sm:py-32"
      aria-labelledby="our-impact-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title */}
        <div className="mx-auto max-w-2xl text-center lg:max-w-none">
          <h2
            id="our-impact-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Revuoo&apos;s Impact: Real Results, Real Trust
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We are proud to be building a community that values authenticity and
            helps thousands make better choices every day.
          </p>
        </div>

        {/* Stats */}
        <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 text-center sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-y-2">
              <dt className="text-base leading-7 text-gray-600">
                {stat.label}
              </dt>
              <dd className="text-5xl font-semibold tracking-tight text-indigo-600">
                {loading ? (
                  <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
                ) : (
                  <CountUp
                    end={formatStat(stat.value)}
                    duration={2}
                    separator=","
                  />
                )}
              </dd>
            </div>
          ))}
        </dl>

        {/* Date */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Data accurate as of {dateString}
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-24 flow-root sm:mt-32">
          <div className="-m-8 sm:-m-12">
            <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-12">
              {/* Testimonial 1 */}
              <figure className="text-center">
                <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                  <p>
                    “Revuoo helped me find the perfect plumber in under an hour,
                    and I felt completely confident knowing every review was
                    genuine. It&apos;s a game-changer.”
                  </p>
                </blockquote>
                <figcaption className="mt-8 flex items-center justify-center gap-x-3">
                  <Image
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
                    alt="Headshot of Sarah L."
                    width={40}
                    height={40}
                    priority
                  />
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold text-gray-900">Sarah L.</div>
                    Revuoo User
                  </div>
                </figcaption>
              </figure>

              {/* Testimonial 2 */}
              <figure className="text-center">
                <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                  <p>
                    “Since listing on Revuoo and encouraging our customers to
                    leave verified reviews, our local cleaning business has seen
                    a 30% increase in qualified leads.”
                  </p>
                </blockquote>
                <figcaption className="mt-8 flex items-center justify-center gap-x-3">
                  <Image
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
                    alt="Headshot of Mark T."
                    width={40}
                    height={40}
                    priority
                  />
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold text-gray-900">Mark T.</div>
                    Owner of ProClean Services
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
