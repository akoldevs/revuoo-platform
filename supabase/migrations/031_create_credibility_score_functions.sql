-- This file creates the logic to automatically calculate and update a user's credibility score.

-- First, create a function that can calculate the total score for a given user.
-- We define our scoring rules here: +10 points for every approved review, +5 for every upvote.
CREATE OR REPLACE FUNCTION public.calculate_credibility_score(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  total_score INT;
BEGIN
  SELECT
    COALESCE(
      (SELECT COUNT(*) * 10 FROM public.reviews WHERE author_id = p_user_id AND status = 'approved') +
      (SELECT SUM(upvote_count) * 5 FROM public.reviews WHERE author_id = p_user_id),
      0
    )
  INTO total_score;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Second, create a function that will be run by our trigger.
-- This function finds the author of the review that was changed and calls the calculation function for them.
CREATE OR REPLACE FUNCTION public.update_profile_credibility_score_on_change()
RETURNS TRIGGER AS $$
DECLARE
  v_author_id UUID;
BEGIN
  -- Determine the author's ID from the changed row
  IF (TG_OP = 'DELETE') THEN
    v_author_id := OLD.author_id;
  ELSE
    v_author_id := NEW.author_id;
  END IF;

  -- If an author exists, update their score
  IF v_author_id IS NOT NULL THEN
    UPDATE public.profiles
    SET credibility_score = (SELECT public.calculate_credibility_score(v_author_id))
    WHERE id = v_author_id;
  END IF;

  -- Return the appropriate record
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Finally, create the trigger itself.
-- This trigger fires whenever a review is inserted, updated (e.g., its vote count changes), or deleted.
CREATE TRIGGER on_review_change_update_author_score
  AFTER INSERT OR UPDATE OF upvote_count, downvote_count, status OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_profile_credibility_score_on_change();