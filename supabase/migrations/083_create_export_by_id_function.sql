-- migration: 083_create_export_by_id_function.sql
CREATE OR REPLACE FUNCTION public.get_public_contributor_profile_by_id(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_profile RECORD;
    v_badges JSON;
    v_reviews JSON;
BEGIN
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE id = p_user_id AND 'contributor' = ANY(roles);

    IF NOT FOUND THEN RETURN NULL; END IF;

    SELECT json_agg(json_build_object('name', b.name, 'description', b.description, 'earned_at', cb.earned_at))
    INTO v_badges
    FROM public.contributor_badges cb JOIN public.badges b ON cb.badge_id = b.id
    WHERE cb.contributor_id = v_profile.id;

    SELECT json_agg(json_build_object('id', er.id, 'title', er.title, 'summary', er.summary, 'published_at', er.published_at, 'rating', er.rating_overall) ORDER BY er.published_at DESC)
    INTO v_reviews
    FROM public.expert_reviews er
    WHERE er.contributor_id = v_profile.id AND er.status = 'approved' LIMIT 10;

    RETURN json_build_object(
        'profile', json_build_object('full_name', v_profile.full_name, 'username', v_profile.username, 'avatar_url', v_profile.avatar_url, 'bio', v_profile.bio),
        'badges', COALESCE(v_badges, '[]'::json),
        'reviews', COALESCE(v_reviews, '[]'::json)
    );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_contributor_profile_by_id(UUID) TO authenticated;
