// src/lib/pricing-data.ts

export const plans = [
    {
        name: 'Free',
        slug: 'free',
        price: { monthly: 0, annually: 0 },
        description: 'For businesses getting started and building a basic online presence.',
        cta: 'Get Started Free',
        isMostPopular: false,
    },
    {
        name: 'Pro',
        slug: 'pro',
        price: { monthly: 49, annually: 39 },
        description: 'For growing businesses ready to actively manage their reputation.',
        cta: 'Choose Pro',
        isMostPopular: true,
    },
    {
        name: 'Advanced',
        slug: 'advanced',
        price: { monthly: 99, annually: 79 },
        description: 'For established businesses that need deeper insights and more scale.',
        cta: 'Choose Advanced',
        isMostPopular: false,
    },
    {
        name: 'Enterprise',
        slug: 'enterprise',
        price: { monthly: 0, annually: 0 },
        description: 'Custom solutions for large organizations with unique needs.',
        cta: 'Contact Sales',
        isMostPopular: false,
    },
];

export const features = [
    {
        category: 'Core Features',
        items: [
            { name: 'Claim & Verify Business Profile', tiers: { Free: true, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Secure your official Revuoo profile and complete our verification process to earn a badge of trust.' },
            { name: 'Revuoo Score Display', tiers: { Free: true, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Display your proprietary trust score, calculated from multiple data points, on your public profile.' },
            { name: 'Publicly Respond to Reviews', tiers: { Free: true, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Engage directly with your customers by responding to their reviews.' },
            { name: 'Manual Review Invitation Link', tiers: { Free: '50/month', Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Generate a shareable link to invite customers to review your business.' },
        ],
    },
    {
        category: 'Enhanced Profile & Branding',
        items: [
            { name: 'Customizable Profile Page', tiers: { Free: false, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Enhance your profile with a cover photo, video embeds, and rich descriptions.' },
            { name: 'Product/Service Showcase', tiers: { Free: false, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Highlight specific products or services directly on your Revuoo page.' },
            { name: '"Revuoo Verified Purchase" Integration', tiers: { Free: false, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Automate review verification by connecting to your e-commerce or CRM platform.' },
        ],
    },
    {
        category: 'AI-Powered Insights',
        items: [
            { name: 'AI-Assisted Response Suggestions', tiers: { Free: false, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Get AI-drafted, sentiment-aware responses to reviews that you can edit and approve.' },
            { name: 'Topic Reports with Sentiment Analysis', tiers: { Free: false, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Our AI identifies recurring themes in your reviews (e.g., "customer service") and analyzes the sentiment for each.' },
            { name: 'Full Competitor Benchmarking', tiers: { Free: false, Pro: '3 Competitors', Advanced: '10 Competitors', Enterprise: true }, tooltip: 'Compare your Revuoo Score and review sentiment against your key competitors.' },
        ],
    },
    {
        category: 'Widgets & Branding',
        items: [
            { name: 'Revuoo Score Widget', tiers: { Free: true, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Display your live Revuoo Score on your website.' },
            { name: 'Testimonial Block Widget', tiers: { Free: false, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Showcase a single, powerful testimonial.' },
            { name: 'Review Carousel Widget', tiers: { Free: false, Pro: false, Advanced: true, Enterprise: true }, tooltip: 'Display a rotating carousel of your best reviews.' },
            { name: 'Downloadable Brand Assets', tiers: { Free: true, Pro: true, Advanced: true, Enterprise: true }, tooltip: 'Access official Revuoo logos and badges for your marketing materials.' },
        ]
    },
    {
        category: 'Support & Scalability',
        items: [
            { name: 'Automated Invitations', tiers: { Free: false, Pro: '1,000/month', Advanced: '5,000/month', Enterprise: 'Unlimited' } },
            { name: 'Multiple User Logins', tiers: { Free: '1 user', Pro: '5 users', Advanced: '20 users', Enterprise: 'Unlimited' } },
            { name: 'Multi-Location/Domain Support', tiers: { Free: false, Pro: false, Advanced: '5 locations', Enterprise: 'Unlimited' } },
            { name: 'Dedicated Onboarding/CSM', tiers: { Free: false, Pro: false, Advanced: 'Onboarding', Enterprise: 'Dedicated CSM' } },
        ],
    },
];