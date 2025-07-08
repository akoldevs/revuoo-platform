// src/app/for-contributors/page.tsx

import ContributorHero from "@/components/contributors/ContributorHero";
import Benefits from "@/components/contributors/Benefits";
import HowToApply from "@/components/contributors/HowToApply";
import IdealCandidate from "@/components/contributors/IdealCandidate";


export default function ForContributorsPage() {
    return (
        <main>
            <ContributorHero />
            <Benefits />
            <IdealCandidate />
            <HowToApply />
        </main>
    );
}