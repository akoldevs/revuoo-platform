-- migration: 073_create_assignment_details_function.sql

-- First, we define the structure of the data this function will return.
-- It's similar to our matrix type but includes more detail, like the description.
CREATE TYPE public.assignment_details AS (
    id BIGINT,
    title TEXT,
    description TEXT,
    payout_amount INTEGER,
    demand_score INTEGER,
    status public.assignment_status,
    due_date TIMESTAMPTZ,
    contributor_id UUID,
    categories JSON
);

-- Now, create the function that accepts an assignment ID as an argument
CREATE OR REPLACE FUNCTION public.get_assignment_details(p_assignment_id BIGINT)
-- It returns a SINGLE row matching our custom type
RETURNS SETOF public.assignment_details
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.title,
        a.description,
        a.payout_amount,
        a.demand_score,
        a.status,
        a.due_date,
        a.contributor_id,
        (
            SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
            FROM public.assignment_categories ac
            JOIN public.categories c ON ac.category_id = c.id
            WHERE ac.assignment_id = a.id
        ) AS categories
    FROM
        public.assignments a
    WHERE
        a.id = p_assignment_id; -- Filter by the provided assignment ID
END;
$$;

-- Grant execution rights to authenticated users
GRANT EXECUTE ON FUNCTION public.get_assignment_details(p_assignment_id BIGINT) TO authenticated;