// src/app/about/page.tsx

import AboutHero from "@/components/about/AboutHero";
import TheRevuooWay from "@/components/about/TheRevuooWay";
import OurValues from "@/components/about/OurValues";
import MeetTheTeam from "@/components/about/MeetTheTeam";
import OurImpact from "@/components/about/OurImpact";       // Add this import
import JoinUsCTA from "@/components/about/JoinUsCTA";       // Add this import

export default function AboutPage() {
    return (
        <main>
            <AboutHero />
            <TheRevuooWay />
            <OurValues />
            <MeetTheTeam />
            <OurImpact />   {/* And add the component here */}
            <JoinUsCTA />   {/* And here */}
        </main>
    );
}