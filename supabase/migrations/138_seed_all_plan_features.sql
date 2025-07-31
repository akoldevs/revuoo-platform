-- This migration seeds the database with a complete list of all plan features
-- and assigns them to the appropriate subscription plans.

-- Step 1: Insert ALL features listed on the pricing page into the master 'features' table.
-- The ON CONFLICT clause prevents duplicates if a feature already exists.
INSERT INTO public.features (name, description)
VALUES
    -- Core Features
    ('core.claim_verify', 'Allows a business to claim and verify their profile.'),
    ('core.score_display', 'Displays the proprietary Revuoo Score on the business profile.'),
    ('core.public_responses', 'Allows a business to publicly respond to reviews.'),
    ('invitations.manual_link', 'Provides a shareable link for manually inviting customers to leave a review.'),

    -- Enhanced Profile & Branding
    ('branding.custom_profile', 'Enables a customizable business profile page with more branding options.'),
    ('branding.showcase', 'Allows the business to showcase specific products or services.'),
    ('branding.verified_purchase', 'Adds a "Verified Purchase" badge to reviews generated via Revuoo invitations.'),
    ('widgets.score', 'Allows embedding of the Revuoo Score widget on the business''s own website.'),
    ('widgets.testimonial', 'Allows embedding of a testimonial block widget.'),
    ('widgets.carousel', 'Allows embedding of a review carousel widget.'),
    ('branding.brand_assets', 'Provides downloadable Revuoo brand assets for marketing.'),

    -- AI-Powered Insights
    ('ai.response_suggestions', 'Provides AI-assisted suggestions for responding to reviews.'),
    ('ai.sentiment_analysis', 'Generates topic reports with sentiment analysis from review content.'),
    ('ai.competitor_benchmarking', 'Provides benchmarking data against a set number of competitors.'),

    -- Support & Scalability
    ('invitations.automated', 'Enables automated review invitations after a customer purchase.'),
    ('scalability.multi_user', 'Allows multiple staff members to access the business dashboard.'),
    ('scalability.multi_location', 'Provides support for managing multiple business locations or domains.')
ON CONFLICT (name) DO NOTHING;


-- Step 2: Assign the correct features to each plan.
-- This section is declarative and can be easily modified in the future.
DO $$
DECLARE
    free_plan_id uuid;
    pro_plan_id uuid;
    advanced_plan_id uuid;
BEGIN
    -- Get the IDs of your plans
    SELECT id INTO free_plan_id FROM public.plans WHERE name = 'Free';
    SELECT id INTO pro_plan_id FROM public.plans WHERE name = 'Pro';
    SELECT id INTO advanced_plan_id FROM public.plans WHERE name = 'Advanced';

    -- === Assign features to FREE plan ===
    IF free_plan_id IS NOT NULL THEN
        INSERT INTO public.plan_features (plan_id, feature_id)
        SELECT free_plan_id, f.id FROM public.features f
        WHERE f.name IN (
            'core.claim_verify',
            'core.score_display',
            'core.public_responses',
            'invitations.manual_link',
            'widgets.score',
            'branding.brand_assets'
        ) ON CONFLICT (plan_id, feature_id) DO NOTHING;
    END IF;

    -- === Assign features to PRO plan ===
    -- Pro includes all Free features, plus its own.
    IF pro_plan_id IS NOT NULL THEN
        INSERT INTO public.plan_features (plan_id, feature_id)
        SELECT pro_plan_id, f.id FROM public.features f
        WHERE f.name IN (
            'core.claim_verify', 'core.score_display', 'core.public_responses', 'invitations.manual_link', 'widgets.score', 'branding.brand_assets',
            'branding.custom_profile',
            'branding.showcase',
            'branding.verified_purchase',
            'widgets.testimonial',
            'ai.response_suggestions',
            'ai.sentiment_analysis',
            'ai.competitor_benchmarking',
            'invitations.automated',
            'scalability.multi_user'
        ) ON CONFLICT (plan_id, feature_id) DO NOTHING;
    END IF;

    -- === Assign features to ADVANCED plan ===
    -- Advanced includes all Pro features, plus its own.
    IF advanced_plan_id IS NOT NULL THEN
        INSERT INTO public.plan_features (plan_id, feature_id)
        SELECT advanced_plan_id, f.id FROM public.features f
        -- This selects ALL features, as Advanced has everything.
        ON CONFLICT (plan_id, feature_id) DO NOTHING;
    END IF;

END $$;