-- migration: 088_create_get_admin_contributor_list_fn.sql
-- This SQL creates a secure database function to efficiently gather all
-- contributor data needed for the admin "Contributor Signals" page.

create or replace function public.get_admin_contributor_list()
returns table (
    id uuid,
    full_name text,
    specialties text[],
    portfolio_url text,
    created_at timestamptz,
    approved_reviews_count bigint
)
language sql
security definer
as $$
    select
        c.id,
        p.full_name,
        c.specialties,
        c.portfolio_url,
        c.created_at,
        coalesce(er_counts.approved_count, 0) as approved_reviews_count
    from
        public.contributors as c
    join
        public.profiles as p on c.id = p.id
    left join (
        select
            contributor_id,
            count(*) as approved_count
        from
            public.expert_reviews
        where
            status = 'approved'
        group by
            contributor_id
    ) as er_counts on c.id = er_counts.contributor_id
    order by
        p.full_name;
$$;
