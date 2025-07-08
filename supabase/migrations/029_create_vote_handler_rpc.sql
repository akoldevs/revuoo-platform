-- This is the new, improved function to handle votes.
-- It is simpler and more direct than the previous version.

CREATE OR REPLACE FUNCTION public.handle_review_vote(
  p_review_id BIGINT,
  p_vote_type TEXT
)
RETURNS void AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_existing_vote TEXT;
BEGIN
  -- First, find out if the user has already voted on this review.
  SELECT vote_type INTO v_existing_vote
  FROM public.review_votes
  WHERE review_id = p_review_id AND user_id = v_user_id;

  -- If the user clicks the same vote button again, they are "un-voting"
  IF v_existing_vote = p_vote_type THEN
    -- So, we delete their existing vote.
    DELETE FROM public.review_votes
    WHERE review_id = p_review_id AND user_id = v_user_id;
  ELSE
    -- Otherwise, this is a new vote or a changed vote.
    -- We use ON CONFLICT to either INSERT a new vote, or UPDATE their existing one.
    INSERT INTO public.review_votes (review_id, user_id, vote_type)
    VALUES (p_review_id, v_user_id, p_vote_type)
    ON CONFLICT (review_id, user_id)
    DO UPDATE SET vote_type = p_vote_type;
  END IF;

  -- Finally, we recount the votes for that review and update the main 'reviews' table.
  -- This is the most reliable way to ensure the counts are always accurate.
  UPDATE public.reviews
  SET
    upvote_count = (SELECT COUNT(*) FROM public.review_votes WHERE review_id = p_review_id AND vote_type = 'up'),
    downvote_count = (SELECT COUNT(*) FROM public.review_votes WHERE review_id = p_review_id AND vote_type = 'down')
  WHERE id = p_review_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;