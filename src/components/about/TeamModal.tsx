"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import type { TeamMember } from "./MeetTheTeam";

type TeamModalProps = {
  member: TeamMember;
  onClose: () => void;
};

export default function TeamModal({ member, onClose }: TeamModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-member-name"
      ref={modalRef}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <Image
          src={member.imageUrl}
          alt={`Portrait of ${member.name}`}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-lg"
          priority
        />
        <h2
          id="team-member-name"
          className="mt-4 text-2xl font-bold text-gray-900"
        >
          {member.name}
        </h2>
        <p className="text-indigo-600 font-medium">{member.role}</p>
        <p className="mt-4 text-gray-700 text-sm leading-6">{member.bio}</p>

        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-indigo-600 hover:underline text-sm font-medium"
        >
          View LinkedIn Profile →
        </a>
      </div>
    </div>
  );
}
