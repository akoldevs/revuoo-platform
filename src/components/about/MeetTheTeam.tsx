"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import { useState } from "react";
import TeamModal from "./TeamModal";

export type TeamMember = {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  linkedinUrl: string;
};

const team: TeamMember[] = [
  {
    name: "Akeem Oladipo",
    role: "Founder & CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    bio: "Frustrated by unreliable online information, Akeem founded Revuoo to create a platform built on integrity, transparency, and the power of genuine, verified experiences.",
    linkedinUrl: "#",
  },
  // Add more team members here
];

export default function MeetTheTeam() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section
      className="bg-white py-24 sm:py-32"
      aria-labelledby="meet-the-team-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="meet-the-team-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Meet the Visionaries Behind Revuoo
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our team is driven by a shared passion for creating a more
            transparent and trustworthy world.
          </p>
        </div>

        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {team.map((person) => (
            <li
              key={person.name}
              className="cursor-pointer group"
              onClick={() => setSelectedMember(person)}
            >
              <div className="overflow-hidden rounded-2xl">
                <Image
                  className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={person.imageUrl}
                  alt={`Headshot of ${person.name}`}
                  width={800}
                  height={600}
                  priority
                />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                {person.name}
              </h3>
              <p className="text-base leading-7 text-gray-600">{person.role}</p>
              <ul role="list" className="mt-4 flex gap-x-4">
                <li>
                  <Link
                    href={person.linkedinUrl}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label={`LinkedIn profile of ${person.name}`}
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {selectedMember && (
        <TeamModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </section>
  );
}
