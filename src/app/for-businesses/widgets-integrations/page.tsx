// src/app/for-businesses/widgets-integrations/page.tsx

import WidgetsHero from "@/components/widgets/WidgetsHero";
import WidgetShowcase from "@/components/widgets/WidgetShowcase";
import IntegrationsAndApi from "@/components/widgets/IntegrationsAndApi"; // Add this import

export default function WidgetsAndIntegrationsPage() {
    return (
        <main>
            <WidgetsHero />
            <WidgetShowcase />
            <IntegrationsAndApi /> {/* And add the component here */}
        </main>
    );
}