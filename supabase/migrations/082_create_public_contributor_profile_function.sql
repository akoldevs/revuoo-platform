-- migration: 082_create_public_contributor_profile_function.sql

-- First, drop the old version of the function to ensure a clean update.
DROP FUNCTION IF EXISTS public.get_public_contributor_profile(TEXT);

-- Re-create the function with the case-insensitive fix.
CREATE OR REPLACE FUNCTION public.get_public_contributor_profile(p_username TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_profile RECORD;
    v_badges JSON;
    v_reviews JSON;
BEGIN
    -- ✅ FIX: Use LOWER() for a case-insensitive username match.
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE LOWER(username) = LOWER(p_username) AND 'contributor' = ANY(roles);

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Get all badges earned by this contributor.
    SELECT json_agg(
        json_build_object(
            'name', b.name,
            'description', b.description,
            'icon_svg', b.icon_svg,
            'earned_at', cb.earned_at
        )
    ) INTO v_badges
    FROM public.contributor_badges cb
    JOIN public.badges b ON cb.badge_id = b.id
    WHERE cb.contributor_id = v_profile.id;

    -- Get the 10 most recent approved reviews by this contributor.
    SELECT json_agg(
        json_build_object(
            'id', er.id,
            'title', er.title,
            'summary', er.summary,
            'published_at', er.published_at,
            'rating', er.rating_overall
        ) ORDER BY er.published_at DESC
    ) INTO v_reviews
    FROM public.expert_reviews er
    WHERE er.contributor_id = v_profile.id AND er.status = 'approved'
    LIMIT 10;

    -- Combine all the data into a single JSON response.
    RETURN json_build_object(
        'profile', json_build_object(
            'full_name', v_profile.full_name,
            'username', v_profile.username,
            'avatar_url', v_profile.avatar_url,
            'bio', v_profile.bio
        ),
        'badges', COALESCE(v_badges, '[]'::json),
        'reviews', COALESCE(v_reviews, '[]'::json)
    );
END;
$$;


-- Grant execution rights for the new function
GRANT EXECUTE ON FUNCTION public.get_public_contributor_profile(TEXT) TO anon, authenticated;
