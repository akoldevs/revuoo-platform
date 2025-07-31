-- migration: 072_create_opportunity_matrix_function.sql

-- First, we define the structure of the data our function will return.
-- This creates a custom type for cleaner and more predictable results.
CREATE TYPE public.opportunity_assignment AS (
    id BIGINT,
    title TEXT,
    payout_amount INTEGER,
    demand_score INTEGER,
    categories JSON
);

-- Now, create the main function
CREATE OR REPLACE FUNCTION public.get_opportunity_matrix_assignments()
-- The function returns a set of our custom type
RETURNS SETOF public.opportunity_assignment
LANGUAGE plpgsql
SECURITY DEFINER -- Important for RLS
AS $$
BEGIN
    -- This statement queries the database and returns the data
    -- in the structure we defined above (opportunity_assignment)
    RETURN QUERY
    SELECT
        a.id,
        a.title,
        a.payout_amount,
        a.demand_score,
        -- This part aggregates all related categories into a single JSON array
        -- Example output: [{"id": "uuid-1", "name": "SaaS"}, {"id": "uuid-2", "name": "AI"}]
        (
            SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
            FROM public.assignment_categories ac
            JOIN public.categories c ON ac.category_id = c.id
            WHERE ac.assignment_id = a.id
        ) AS categories
    FROM
        public.assignments a
    WHERE
        a.status = 'open'; -- We only want assignments that are available to be claimed
END;
$$;

-- Grant execution rights to authenticated users
GRANT EXECUTE ON FUNCTION public.get_opportunity_matrix_assignments() TO authenticated;