-- migration: 087_create_approve_expert_review_fn.sql
-- This SQL creates a secure database function to handle the complex logic
-- of approving an expert review in a single, atomic transaction.

create or replace function public.approve_expert_review_and_pay(
    p_review_id uuid,
    p_assignment_id bigint,
    p_contributor_id uuid,
    p_payout_amount numeric
)
returns void
language plpgsql
security definer -- This allows the function to run with the permissions of the user who defined it
as $$
begin
    -- Step 1: Update the expert review status to 'approved' and set the publication date.
    update public.expert_reviews
    set
        status = 'approved',
        published_at = now()
    where id = p_review_id;

    -- Step 2: Update the original assignment status to 'completed'.
    update public.assignments
    set status = 'completed'
    where id = p_assignment_id;

    -- Step 3: Create a payment record to queue the payout for the contributor.
    insert into public.content_payments(contributor_id, expert_review_id, amount, status)
    values (p_contributor_id, p_review_id, p_payout_amount, 'pending');
end;
$$;
